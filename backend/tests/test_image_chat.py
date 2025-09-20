#!/usr/bin/env python3
"""
Test script for the image chat functionality
"""

import requests
import json
import os

# Configuration
API_BASE_URL = "http://localhost:8000"
CHAT_API_URL = f"{API_BASE_URL}/chats/chat-with-images/"
UPLOAD_API_URL = f"{API_BASE_URL}/chats/upload-image/"

def test_image_upload(image_path):
    """Test image upload without OCR"""
    print(f"\n=== Testing Image Upload ===")
    
    if not os.path.exists(image_path):
        print(f"Error: Image file {image_path} not found")
        return False
    
    with open(image_path, 'rb') as f:
        files = {'image': f}
        response = requests.post(UPLOAD_API_URL, files=files)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Upload successful: {result['message']}")
        print(f"   Total images: {result['total_images']}")
        return True
    else:
        print(f"❌ Upload failed: {response.text}")
        return False

def test_chat_message(message):
    """Test chat message processing"""
    print(f"\n=== Testing Chat Message ===")
    print(f"User: {message}")
    
    data = {'message': message}
    response = requests.post(CHAT_API_URL, json=data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"Bot: {result['response']}")
        
        if result.get('type') == 'ocr_result':
            print(f"\n📄 Extracted Text:")
            print(f"   From: {result['image_name']}")
            print(f"   Text: {result['extracted_text']}")
        elif result.get('type') == 'image_list':
            print(f"\n📸 Images:")
            for img in result.get('images', []):
                print(f"   {img}")
        
        return True
    else:
        print(f"❌ Chat failed: {response.text}")
        return False

def main():
    """Main test function"""
    print("🤖 Image Chat App Test")
    print("=" * 50)
    
    # Test 1: Regular chat message (no images)
    test_chat_message("Hello, how are you?")
    
    # Test 2: List images (should be empty)
    test_chat_message("list images")
    
    # Test 3: Try to extract text (should fail - no images)
    test_chat_message("extract text from last image")
    
    # Test 4: Upload an image (create a dummy image if needed)
    sample_image_path = "sample_image.jpg"
    
    # Create a simple test image if it doesn't exist
    if not os.path.exists(sample_image_path):
        try:
            from PIL import Image, ImageDraw, ImageFont
            
            # Create a simple test image with text
            img = Image.new('RGB', (400, 200), color='white')
            draw = ImageDraw.Draw(img)
            
            # Add some text
            text = "This is a test image\nfor OCR extraction\nHello World!"
            try:
                # Try to use a default font
                font = ImageFont.load_default()
            except:
                font = None
            
            draw.text((50, 50), text, fill='black', font=font)
            img.save(sample_image_path)
            print(f"✅ Created test image: {sample_image_path}")
            
        except ImportError:
            print("❌ PIL not available. Please create a test image manually.")
            return
    
    # Test 5: Upload the image
    if test_image_upload(sample_image_path):
        
        # Test 6: List images (should show 1 image)
        test_chat_message("list images")
        
        # Test 7: Extract text from last image
        test_chat_message("extract text from last image")
        
        # Test 8: Upload another image (if exists)
        if os.path.exists("another_image.jpg"):
            test_image_upload("another_image.jpg")
            test_chat_message("list images")
            test_chat_message("extract text from image 1")
            test_chat_message("extract text from image 2")
    
    print("\n" + "=" * 50)
    print("🎉 Test completed!")

if __name__ == "__main__":
    main()