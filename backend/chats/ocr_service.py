"""
OCR Service for extracting text from images
"""

import os
import io
from PIL import Image
import pytesseract
import base64
from django.core.files.uploadedfile import InMemoryUploadedFile

class OCRService:
    def __init__(self):
        # Configure tesseract path for different environments
        self._configure_tesseract_path()
    
    def _configure_tesseract_path(self):
        """Configure Tesseract path based on environment"""
        import platform
        import shutil
        
        # Try to find tesseract in common locations
        possible_paths = [
            '/usr/bin/tesseract',  # Linux/Ubuntu
            '/usr/local/bin/tesseract',  # macOS with Homebrew
            '/opt/homebrew/bin/tesseract',  # macOS with Apple Silicon Homebrew
            'tesseract',  # If it's in PATH
        ]
        
        # Check if tesseract is available in PATH first
        tesseract_path = shutil.which('tesseract')
        
        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
            print(f"Tesseract found at: {tesseract_path}")
        else:
            # Try common installation paths
            for path in possible_paths:
                if os.path.exists(path):
                    pytesseract.pytesseract.tesseract_cmd = path
                    print(f"Tesseract configured at: {path}")
                    return
            
            print("Warning: Tesseract not found in common locations")
            # Let pytesseract try to find it automatically
    
    def check_tesseract_installation(self):
        """Check if Tesseract is properly installed and accessible"""
        try:
            version = pytesseract.get_tesseract_version()
            languages = pytesseract.get_languages()
            return True, {
                'version': str(version),
                'languages': languages,
                'path': pytesseract.pytesseract.tesseract_cmd
            }
        except Exception as e:
            return False, str(e)
    
    def extract_text_from_image(self, image_file):
        """
        Extract text from an uploaded image file
        
        Args:
            image_file: Django uploaded file or file path
            
        Returns:
            str: Extracted text from the image
        """
        try:
            # First check if Tesseract is available
            is_available, info = self.check_tesseract_installation()
            if not is_available:
                error_msg = f"Tesseract OCR is not properly installed or configured: {info}"
                print(error_msg)
                return error_msg
            
            # Handle different input types
            if isinstance(image_file, InMemoryUploadedFile):
                # Django uploaded file
                image = Image.open(image_file)
            elif isinstance(image_file, str):
                # File path
                image = Image.open(image_file)
            else:
                # File-like object
                image = Image.open(image_file)
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Extract text using pytesseract with better error handling
            try:
                extracted_text = pytesseract.image_to_string(image, lang='eng+hin')
            except pytesseract.TesseractNotFoundError:
                return "Tesseract OCR engine not found. Please ensure Tesseract is installed on the server."
            except pytesseract.TesseractError as te:
                return f"Tesseract OCR error: {str(te)}"
            
            # Clean up the text
            cleaned_text = self._clean_extracted_text(extracted_text)
            
            return cleaned_text
            
        except Exception as e:
            error_msg = f"Error extracting text from image: {str(e)}"
            print(f"OCR Error: {e}")
            import traceback
            print(f"Full traceback: {traceback.format_exc()}")
            return error_msg
    
    def extract_text_from_base64(self, base64_string):
        """
        Extract text from a base64 encoded image
        
        Args:
            base64_string (str): Base64 encoded image data
            
        Returns:
            str: Extracted text from the image
        """
        try:
            # Remove data URL prefix if present
            if ',' in base64_string:
                base64_string = base64_string.split(',')[1]
            
            # Decode base64 to bytes
            image_data = base64.b64decode(base64_string)
            
            # Create PIL Image from bytes
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Extract text using pytesseract
            extracted_text = pytesseract.image_to_string(image, lang='eng+hin')
            
            # Clean up the text
            cleaned_text = self._clean_extracted_text(extracted_text)
            
            return cleaned_text
            
        except Exception as e:
            print(f"OCR Error: {e}")
            return f"Error extracting text from image: {str(e)}"
    
    def _clean_extracted_text(self, text):
        """
        Clean and format extracted text
        
        Args:
            text (str): Raw extracted text
            
        Returns:
            str: Cleaned text
        """
        if not text:
            return "No text could be extracted from the image."
        
        # Remove extra whitespace and empty lines
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        cleaned_text = '\n'.join(lines)
        
        # Remove excessive whitespace
        cleaned_text = ' '.join(cleaned_text.split())
        
        if not cleaned_text:
            return "No readable text found in the image."
        
        return cleaned_text
    
    def test_ocr(self):
        """Test OCR functionality with a simple text image"""
        try:
            # Create a simple test image with text
            from PIL import Image, ImageDraw, ImageFont
            
            # Create a white image
            img = Image.new('RGB', (400, 100), color='white')
            draw = ImageDraw.Draw(img)
            
            # Add some text
            try:
                # Try to use a default font
                font = ImageFont.load_default()
            except:
                font = None
            
            draw.text((10, 30), "This is a test document", fill='black', font=font)
            
            # Save to bytes
            img_bytes = io.BytesIO()
            img.save(img_bytes, format='PNG')
            img_bytes.seek(0)
            
            # Extract text
            extracted = self.extract_text_from_image(img_bytes)
            
            return True, extracted
            
        except Exception as e:
            return False, str(e)


# Global OCR service instance
ocr_service = OCRService()