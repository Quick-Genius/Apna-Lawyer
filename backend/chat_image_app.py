import os
import re
from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import datetime

try:
    import easyocr
    OCR_AVAILABLE = True
except ImportError:
    try:
        import pytesseract
        from PIL import Image
        OCR_AVAILABLE = True
    except ImportError:
        OCR_AVAILABLE = False

@dataclass
class StoredImage:
    id: int
    file_path: str
    original_name: str
    uploaded_at: datetime

class ChatImageApp:
    def __init__(self):
        self.images: List[StoredImage] = []
        self.image_counter = 0
        self.ocr_reader = None
        
        # Initialize OCR if available
        if OCR_AVAILABLE:
            try:
                # Try EasyOCR first (more accurate)
                self.ocr_reader = easyocr.Reader(['en'])
                self.ocr_method = 'easyocr'
            except:
                # Fallback to Tesseract
                self.ocr_method = 'tesseract'
        
    def upload_image(self, file_path: str, original_name: str = None) -> Dict:
        """
        Store image reference without running OCR
        """
        if not os.path.exists(file_path):
            return {"success": False, "error": "File not found"}
        
        # Validate it's an image file
        valid_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'}
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext not in valid_extensions:
            return {"success": False, "error": "Invalid image format"}
        
        self.image_counter += 1
        stored_image = StoredImage(
            id=self.image_counter,
            file_path=file_path,
            original_name=original_name or os.path.basename(file_path),
            uploaded_at=datetime.now()
        )
        
        self.images.append(stored_image)
        
        return {
            "success": True,
            "message": f"Image uploaded successfully (ID: {self.image_counter})",
            "image_id": self.image_counter,
            "total_images": len(self.images)
        }
    
    def extract_text(self, image_path: str) -> str:
        """
        Extract text from image using OCR
        """
        if not OCR_AVAILABLE:
            return "OCR libraries not available. Please install easyocr or pytesseract."
        
        if not os.path.exists(image_path):
            return "Image file not found."
        
        try:
            if self.ocr_method == 'easyocr' and self.ocr_reader:
                # Use EasyOCR
                results = self.ocr_reader.readtext(image_path)
                extracted_text = ' '.join([result[1] for result in results])
            else:
                # Use Tesseract
                from PIL import Image
                image = Image.open(image_path)
                extracted_text = pytesseract.image_to_string(image)
            
            return extracted_text.strip() if extracted_text.strip() else "No text found in image."
            
        except Exception as e:
            return f"OCR extraction failed: {str(e)}"
    
    def get_image_by_reference(self, reference: str) -> Optional[StoredImage]:
        """
        Get image by various reference methods (last, index, id)
        """
        reference = reference.lower().strip()
        
        if not self.images:
            return None
        
        # Handle "last image" or "latest image"
        if 'last' in reference or 'latest' in reference:
            return self.images[-1]
        
        # Handle numeric references (image 1, image 2, etc.)
        number_match = re.search(r'(\d+)', reference)
        if number_match:
            number = int(number_match.group(1))
            
            # Try as 1-based index first
            if 1 <= number <= len(self.images):
                return self.images[number - 1]
            
            # Try as ID
            for img in self.images:
                if img.id == number:
                    return img
        
        return None
    
    def list_images(self) -> str:
        """
        List all uploaded images
        """
        if not self.images:
            return "No images uploaded yet."
        
        result = f"Uploaded images ({len(self.images)} total):\n"
        for i, img in enumerate(self.images, 1):
            result += f"{i}. {img.original_name} (ID: {img.id}) - {img.uploaded_at.strftime('%H:%M:%S')}\n"
        
        return result
    
    def process_message(self, message: str) -> str:
        """
        Process user message and handle OCR requests
        """
        message_lower = message.lower().strip()
        
        # Check for OCR extraction requests
        if any(phrase in message_lower for phrase in ['extract text', 'ocr', 'read text', 'get text']):
            
            # Determine which image to process
            target_image = None
            
            if 'last' in message_lower or 'latest' in message_lower:
                target_image = self.get_image_by_reference('last')
            else:
                # Look for image references (image 1, image 2, etc.)
                number_match = re.search(r'image\s+(\d+)', message_lower)
                if number_match:
                    target_image = self.get_image_by_reference(f"image {number_match.group(1)}")
                elif self.images:
                    # Default to last image if no specific reference
                    target_image = self.images[-1]
            
            if not target_image:
                return "No image found to extract text from. Please upload an image first."
            
            extracted_text = self.extract_text(target_image.file_path)
            return f"Text extracted from {target_image.original_name}:\n\n{extracted_text}"
        
        # Check for list images request
        elif any(phrase in message_lower for phrase in ['list images', 'show images', 'images uploaded']):
            return self.list_images()
        
        # Check for help request
        elif 'help' in message_lower:
            return self.get_help_text()
        
        # Regular chat response
        else:
            return f"I received your message: '{message}'. Upload an image and ask me to extract text from it!"
    
    def get_help_text(self) -> str:
        """
        Return help text for available commands
        """
        return """
Available commands:
• Upload an image using upload_image(file_path)
• "extract text from last image" - Extract text from most recent image
• "extract text from image 2" - Extract text from specific image by number
• "list images" - Show all uploaded images
• "help" - Show this help message

Example workflow:
1. app.upload_image("path/to/image.jpg")
2. "extract text from last image"
        """.strip()

def simulate_chat():
    """
    Simulate a chat session with image upload and OCR functionality
    """
    app = ChatImageApp()
    
    print("=== Chat Image App ===")
    print("Type 'quit' to exit, 'help' for commands")
    print("Use app.upload_image('path/to/image.jpg') to upload images")
    print()
    
    while True:
        try:
            user_input = input("You: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("Goodbye!")
                break
            
            if not user_input:
                continue
            
            # Handle upload command simulation
            if user_input.startswith('upload '):
                file_path = user_input[7:].strip().strip('"\'')
                result = app.upload_image(file_path)
                if result['success']:
                    print(f"App: {result['message']}")
                else:
                    print(f"App: Error - {result['error']}")
                continue
            
            # Process regular message
            response = app.process_message(user_input)
            print(f"App: {response}")
            print()
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    # Example usage
    app = ChatImageApp()
    
    # Simulate uploading images
    print("=== Example Usage ===")
    
    # Example 1: Upload image (no OCR triggered)
    result1 = app.upload_image("example1.jpg", "Screenshot 1")
    print(f"Upload result: {result1}")
    
    # Example 2: Upload another image
    result2 = app.upload_image("example2.png", "Document scan")
    print(f"Upload result: {result2}")
    
    # Example 3: List images
    print("\nListing images:")
    print(app.process_message("list images"))
    
    # Example 4: Extract text (OCR only triggered now)
    print("\nExtracting text from last image:")
    print(app.process_message("extract text from last image"))
    
    print("\n" + "="*50)
    print("Starting interactive chat simulation...")
    simulate_chat()