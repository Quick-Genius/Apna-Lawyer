#!/usr/bin/env python3
"""
Test script for new API endpoints
"""
import os
import sys
import django
import requests
import base64
from io import BytesIO
from PIL import Image

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'apna_lawyer.settings')
django.setup()

def test_endpoints():
    """Test the new API endpoints"""
    base_url = "http://localhost:8000"
    
    # Test OCR endpoint
    print("Testing OCR endpoint...")
    
    # Create a simple test image with text
    img = Image.new('RGB', (200, 100), color='white')
    img_buffer = BytesIO()
    img.save(img_buffer, format='PNG')
    img_buffer.seek(0)
    
    try:
        response = requests.post(
            f"{base_url}/api/ocr-image/",
            files={'image': ('test.png', img_buffer, 'image/png')},
            headers={'Authorization': 'Bearer your_token_here'}  # Replace with actual token
        )
        print(f"OCR endpoint status: {response.status_code}")
        if response.status_code == 200:
            print(f"OCR response: {response.json()}")
        else:
            print(f"OCR error: {response.text}")
    except Exception as e:
        print(f"OCR test failed: {e}")
    
    # Test document extraction endpoint
    print("\nTesting document extraction endpoint...")
    
    # Create a simple test PDF (would need actual PDF for real test)
    try:
        response = requests.post(
            f"{base_url}/api/extract-doc/",
            files={'file': ('test.pdf', b'dummy pdf content', 'application/pdf')},
            headers={'Authorization': 'Bearer your_token_here'}  # Replace with actual token
        )
        print(f"Document extraction endpoint status: {response.status_code}")
        if response.status_code == 200:
            print(f"Document extraction response: {response.json()}")
        else:
            print(f"Document extraction error: {response.text}")
    except Exception as e:
        print(f"Document extraction test failed: {e}")

if __name__ == "__main__":
    test_endpoints()