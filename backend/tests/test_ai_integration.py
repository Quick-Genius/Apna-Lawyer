#!/usr/bin/env python
"""
Test AI integration, OCR, and chat functionality
"""

import os
import sys
import django
import requests
import json
import base64
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import io

# Add backend directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'apna_lawyer.settings')
django.setup()

from chats.ai_service import get_ai_service
from chats.ocr_service import ocr_service

BASE_URL = 'http://localhost:8000'

def create_test_image_with_text(text="This is a legal document for testing OCR functionality."):
    """Create a test image with text for OCR testing"""
    try:
        # Create a white image
        img = Image.new('RGB', (600, 200), color='white')
        draw = ImageDraw.Draw(img)
        
        # Add text
        try:
            font = ImageFont.load_default()
        except:
            font = None
        
        draw.text((20, 50), text, fill='black', font=font)
        draw.text((20, 100), "Contract Law - Section 10", fill='black', font=font)
        draw.text((20, 130), "Indian Contract Act, 1872", fill='black', font=font)
        
        # Convert to base64
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        # Encode to base64
        img_base64 = base64.b64encode(img_bytes.getvalue()).decode('utf-8')
        return f"data:image/png;base64,{img_base64}"
        
    except Exception as e:
        print(f"Error creating test image: {e}")
        return None

def test_ai_service_direct():
    """Test AI service directly"""
    print("🤖 Testing AI Service (Direct)...")
    
    try:
        ai_service = get_ai_service()
        
        # Test basic functionality
        response = ai_service.generate_legal_response(
            "What is contract law?",
            "You are a legal assistant specializing in Indian law."
        )
        
        print(f"✅ AI Service Type: {type(ai_service).__name__}")
        print(f"📝 Test Response: {response[:100]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ AI Service Error: {e}")
        return False

def test_ocr_service_direct():
    """Test OCR service directly"""
    print("\n📷 Testing OCR Service (Direct)...")
    
    try:
        # Test with generated image
        test_image_b64 = create_test_image_with_text()
        if not test_image_b64:
            print("❌ Could not create test image")
            return False
        
        # Extract base64 part
        base64_data = test_image_b64.split(',')[1]
        extracted_text = ocr_service.extract_text_from_base64(base64_data)
        
        print(f"✅ OCR Extracted Text: {extracted_text}")
        
        return "legal" in extracted_text.lower() or "contract" in extracted_text.lower()
        
    except Exception as e:
        print(f"❌ OCR Service Error: {e}")
        return False

def test_chat_api_endpoints():
    """Test chat API endpoints"""
    print("\n💬 Testing Chat API Endpoints...")
    
    # First, login with dummy user
    login_data = {
        'email': 'dummy.test@example.com',
        'password': 'dummypass123'
    }
    
    session = requests.Session()
    
    try:
        # Login
        login_response = session.post(f'{BASE_URL}/users/login/', json=login_data)
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            return False
        
        print("✅ Login successful")
        
        # Test AI service endpoint
        ai_test_response = session.get(f'{BASE_URL}/chats/test-ai/')
        if ai_test_response.status_code == 200:
            ai_data = ai_test_response.json()
            print(f"✅ AI Service Test: {ai_data['service_type']}")
        else:
            print(f"❌ AI Service Test failed: {ai_test_response.status_code}")
        
        # Test OCR service endpoint
        ocr_test_response = session.get(f'{BASE_URL}/chats/test-ocr/')
        if ocr_test_response.status_code == 200:
            ocr_data = ocr_test_response.json()
            print(f"✅ OCR Service Test: Available = {ocr_data['ocr_service_available']}")
        else:
            print(f"❌ OCR Service Test failed: {ocr_test_response.status_code}")
        
        # Test basic chat
        chat_data = {
            'message': 'What are the basic elements of a contract?'
        }
        
        chat_response = session.post(f'{BASE_URL}/chats/api/', json=chat_data)
        if chat_response.status_code == 200:
            response_data = chat_response.json()
            print(f"✅ Basic Chat: {response_data['response'][:100]}...")
        else:
            print(f"❌ Basic Chat failed: {chat_response.status_code}")
        
        # Test chat with image
        test_image = create_test_image_with_text("Legal Notice: This is a contract termination notice.")
        if test_image:
            image_chat_data = {
                'message': 'Please analyze this legal document',
                'image': test_image.split(',')[1]  # Remove data:image/png;base64, prefix
            }
            
            image_chat_response = session.post(f'{BASE_URL}/chats/api/', json=image_chat_data)
            if image_chat_response.status_code == 200:
                image_response_data = image_chat_response.json()
                print(f"✅ Image Chat: Extracted text included = {'extracted_text' in image_response_data}")
                if 'extracted_text' in image_response_data:
                    print(f"📝 Extracted: {image_response_data['extracted_text'][:50]}...")
            else:
                print(f"❌ Image Chat failed: {image_chat_response.status_code}")
        
        # Test chat history
        history_response = session.get(f'{BASE_URL}/chats/chat/history/')
        if history_response.status_code == 200:
            history_data = history_response.json()
            print(f"✅ Chat History: {history_data['total_count']} chats found")
        else:
            print(f"❌ Chat History failed: {history_response.status_code}")
        
        return True
        
    except Exception as e:
        print(f"❌ API Test Error: {e}")
        return False

def test_image_extraction_endpoint():
    """Test standalone image text extraction endpoint"""
    print("\n🖼️  Testing Image Text Extraction Endpoint...")
    
    # Login first
    login_data = {
        'email': 'dummy.test@example.com',
        'password': 'dummypass123'
    }
    
    session = requests.Session()
    
    try:
        # Login
        login_response = session.post(f'{BASE_URL}/users/login/', json=login_data)
        if login_response.status_code != 200:
            print(f"❌ Login failed for image test")
            return False
        
        # Create test image
        test_image = create_test_image_with_text("LEGAL AGREEMENT\nParty A: John Doe\nParty B: Jane Smith\nDate: 2024-01-01")
        if not test_image:
            print("❌ Could not create test image")
            return False
        
        # Test extraction endpoint
        extraction_data = {
            'image': test_image.split(',')[1]  # Remove data URL prefix
        }
        
        extraction_response = session.post(f'{BASE_URL}/chats/extract-text/', json=extraction_data)
        
        if extraction_response.status_code == 200:
            extraction_result = extraction_response.json()
            print(f"✅ Text Extraction: {extraction_result['extracted_text']}")
            return True
        else:
            print(f"❌ Text Extraction failed: {extraction_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Image Extraction Test Error: {e}")
        return False

def main():
    print("🧪 AI INTEGRATION & OCR TESTING SUITE")
    print("=" * 60)
    
    results = []
    
    # Test AI service directly
    results.append(("AI Service Direct", test_ai_service_direct()))
    
    # Test OCR service directly
    results.append(("OCR Service Direct", test_ocr_service_direct()))
    
    # Test API endpoints
    results.append(("Chat API Endpoints", test_chat_api_endpoints()))
    
    # Test image extraction endpoint
    results.append(("Image Extraction Endpoint", test_image_extraction_endpoint()))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if success:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL AI/OCR TESTS PASSED!")
    else:
        print("⚠️  Some tests failed. Check configuration:")
        print("- Ensure Django server is running")
        print("- Check GEMINI_API_KEY in .env file")
        print("- Verify tesseract is installed for OCR")
    
    print("\n" + "=" * 60)

if __name__ == '__main__':
    main()