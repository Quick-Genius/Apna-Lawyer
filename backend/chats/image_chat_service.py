import os
import re
import uuid
from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import datetime
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

try:
    import pytesseract
    from PIL import Image
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False

@dataclass
class StoredImage:
    id: str
    file_path: str
    original_name: str
    uploaded_at: datetime
    user_id: Optional[str] = None

class ImageChatService:
    """
    Service for handling image uploads and on-demand OCR in chat
    """
    
    def __init__(self):
        # In-memory storage for demo (use Redis/database in production)
        self.user_images: Dict[str, List[StoredImage]] = {}
        self.ocr_reader = None
        
        # Initialize OCR if available
        if OCR_AVAILABLE:
            self.ocr_method = 'tesseract'
    
    def get_user_session_id(self, request) -> str:
        """
        Get user session ID for image storage
        """
        if hasattr(request, 'user') and request.user.is_authenticated:
            return str(request.user.id)
        else:
            # Use session key for anonymous users
            if not request.session.session_key:
                request.session.create()
            return f"anon_{request.session.session_key}"
    
    def store_image(self, image_file, user_session_id: str, original_name: str = None) -> Dict:
        """
        Store uploaded image without running OCR
        """
        try:
            # Validate image file
            valid_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'}
            file_ext = os.path.splitext(image_file.name)[1].lower()
            
            if file_ext not in valid_extensions:
                return {"success": False, "error": "Invalid image format"}
            
            # Generate unique filename
            unique_id = str(uuid.uuid4())
            filename = f"chat_images/{user_session_id}/{unique_id}{file_ext}"
            
            # Save file
            file_path = default_storage.save(filename, ContentFile(image_file.read()))
            
            # Create stored image record
            stored_image = StoredImage(
                id=unique_id,
                file_path=file_path,
                original_name=original_name or image_file.name,
                uploaded_at=datetime.now(),
                user_id=user_session_id
            )
            
            # Store in memory (use database in production)
            if user_session_id not in self.user_images:
                self.user_images[user_session_id] = []
            
            self.user_images[user_session_id].append(stored_image)
            
            return {
                "success": True,
                "message": f"Image '{stored_image.original_name}' uploaded successfully",
                "image_id": unique_id,
                "total_images": len(self.user_images[user_session_id])
            }
            
        except Exception as e:
            return {"success": False, "error": f"Upload failed: {str(e)}"}
    
    def extract_text_from_image(self, image_path: str) -> str:
        """
        Extract text from image using OCR
        """
        if not OCR_AVAILABLE:
            return "OCR service not available. Please install easyocr or pytesseract."
        
        try:
            # Get full file path
            full_path = default_storage.path(image_path) if hasattr(default_storage, 'path') else image_path
            
            if not os.path.exists(full_path):
                return "Image file not found."
            
            # Use Tesseract
            from PIL import Image
            image = Image.open(full_path)
            extracted_text = pytesseract.image_to_string(image)
            
            return extracted_text.strip() if extracted_text.strip() else "No text found in image."
            
        except Exception as e:
            return f"OCR extraction failed: {str(e)}"
    
    def get_user_images(self, user_session_id: str) -> List[StoredImage]:
        """
        Get all images for a user session
        """
        return self.user_images.get(user_session_id, [])
    
    def get_image_by_reference(self, user_session_id: str, reference: str) -> Optional[StoredImage]:
        """
        Get image by various reference methods
        """
        user_images = self.get_user_images(user_session_id)
        
        if not user_images:
            return None
        
        reference = reference.lower().strip()
        
        # Handle "last image" or "latest image"
        if 'last' in reference or 'latest' in reference:
            return user_images[-1]
        
        # Handle numeric references
        number_match = re.search(r'(\d+)', reference)
        if number_match:
            number = int(number_match.group(1))
            
            # Try as 1-based index
            if 1 <= number <= len(user_images):
                return user_images[number - 1]
        
        return None
    
    def process_chat_message(self, message: str, user_session_id: str) -> Dict:
        """
        Process chat message and handle OCR requests
        """
        message_lower = message.lower().strip()
        user_images = self.get_user_images(user_session_id)
        
        # Check for OCR extraction requests
        if any(phrase in message_lower for phrase in ['extract text', 'ocr', 'read text', 'get text']):
            
            if not user_images:
                return {
                    "type": "error",
                    "message": "No images uploaded yet. Please upload an image first."
                }
            
            # Determine which image to process
            target_image = None
            
            if 'last' in message_lower or 'latest' in message_lower:
                target_image = self.get_image_by_reference(user_session_id, 'last')
            else:
                # Look for image references
                number_match = re.search(r'image\s+(\d+)', message_lower)
                if number_match:
                    target_image = self.get_image_by_reference(user_session_id, f"image {number_match.group(1)}")
                else:
                    # Default to last image
                    target_image = user_images[-1]
            
            if not target_image:
                return {
                    "type": "error",
                    "message": "Could not find the specified image."
                }
            
            extracted_text = self.extract_text_from_image(target_image.file_path)
            
            return {
                "type": "ocr_result",
                "message": f"Text extracted from '{target_image.original_name}':",
                "extracted_text": extracted_text,
                "image_name": target_image.original_name
            }
        
        # Check for list images request
        elif any(phrase in message_lower for phrase in ['list images', 'show images', 'my images']):
            if not user_images:
                return {
                    "type": "info",
                    "message": "No images uploaded yet."
                }
            
            image_list = []
            for i, img in enumerate(user_images, 1):
                image_list.append(f"{i}. {img.original_name} - {img.uploaded_at.strftime('%H:%M:%S')}")
            
            return {
                "type": "image_list",
                "message": f"Your uploaded images ({len(user_images)} total):",
                "images": image_list
            }
        
        # Regular chat message - no OCR triggered
        return {
            "type": "chat",
            "message": "I received your message. Upload an image and ask me to extract text from it!",
            "user_message": message
        }

# Global service instance
image_chat_service = ImageChatService()