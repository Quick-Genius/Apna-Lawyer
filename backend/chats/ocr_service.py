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
        # Configure tesseract path if needed (for different OS)
        # pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'  # Linux/Mac
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Windows
        pass
    
    def extract_text_from_image(self, image_file):
        """
        Extract text from an uploaded image file
        
        Args:
            image_file: Django uploaded file or file path
            
        Returns:
            str: Extracted text from the image
        """
        try:
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
            
            # Extract text using pytesseract
            extracted_text = pytesseract.image_to_string(image, lang='eng+hin')
            
            # Clean up the text
            cleaned_text = self._clean_extracted_text(extracted_text)
            
            return cleaned_text
            
        except Exception as e:
            print(f"OCR Error: {e}")
            return f"Error extracting text from image: {str(e)}"
    
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