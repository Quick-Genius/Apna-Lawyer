#!/usr/bin/env python3
"""
Test script to verify Gemini AI service is working
"""

import os
import sys
import django
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'apna_lawyer.settings')
django.setup()

from chats.ai_service import get_ai_service

def test_ai_service():
    print("Testing AI Service Connection...")
    print("-" * 50)
    
    try:
        # Get AI service
        ai_service = get_ai_service()
        print(f"AI Service Type: {type(ai_service).__name__}")
        
        # Test connection
        success, response = ai_service.test_connection()
        print(f"Connection Test: {'✅ SUCCESS' if success else '❌ FAILED'}")
        
        if success:
            print(f"Test Response: {response[:200]}...")
            
            # Test a real legal question
            print("\nTesting with a legal question...")
            legal_response = ai_service.generate_legal_response(
                "What is a contract in Indian law?",
                "You are a legal assistant specializing in Indian law."
            )
            print(f"Legal Response: {legal_response[:300]}...")
            
        else:
            print(f"Error: {response}")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False
    
    return success

if __name__ == "__main__":
    test_ai_service()