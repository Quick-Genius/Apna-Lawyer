#!/usr/bin/env python3
"""
Simple usage example of the Image Chat App
Demonstrates the key behavior: no automatic OCR, only on-demand
"""

from chat_image_app import ChatImageApp

def main():
    print("🤖 Image Chat App - Usage Example")
    print("=" * 50)
    
    # Initialize the app
    app = ChatImageApp()
    
    print("\n1. Upload images (NO OCR runs automatically)")
    print("-" * 40)
    
    # Upload first image - NO OCR triggered
    result1 = app.upload_image("document1.jpg", "Legal Document 1")
    print(f"📤 {result1}")
    
    # Upload second image - NO OCR triggered  
    result2 = app.upload_image("contract.png", "Contract Scan")
    print(f"📤 {result2}")
    
    print("\n2. Regular chat messages (no OCR)")
    print("-" * 40)
    
    # Regular chat - no OCR
    response1 = app.process_message("Hello, I need legal advice")
    print(f"💬 User: Hello, I need legal advice")
    print(f"🤖 Bot: {response1}")
    
    # Another regular message - no OCR
    response2 = app.process_message("What are my rights?")
    print(f"💬 User: What are my rights?")
    print(f"🤖 Bot: {response2}")
    
    print("\n3. List uploaded images")
    print("-" * 40)
    
    # List images
    response3 = app.process_message("list images")
    print(f"💬 User: list images")
    print(f"🤖 Bot: {response3}")
    
    print("\n4. NOW request OCR (only when explicitly asked)")
    print("-" * 40)
    
    # Extract text from last image - OCR RUNS NOW
    response4 = app.process_message("extract text from last image")
    print(f"💬 User: extract text from last image")
    print(f"🤖 Bot: {response4}")
    
    # Extract text from specific image - OCR RUNS NOW
    response5 = app.process_message("extract text from image 1")
    print(f"💬 User: extract text from image 1")
    print(f"🤖 Bot: {response5}")
    
    print("\n5. More regular chat (no OCR)")
    print("-" * 40)
    
    # Back to regular chat - no OCR
    response6 = app.process_message("Can you help me understand this?")
    print(f"💬 User: Can you help me understand this?")
    print(f"🤖 Bot: {response6}")
    
    print("\n" + "=" * 50)
    print("✅ Key Points Demonstrated:")
    print("   • Images uploaded silently (no automatic OCR)")
    print("   • OCR only runs when explicitly requested")
    print("   • Can reference images by 'last' or number")
    print("   • Regular chat works normally without triggering OCR")

if __name__ == "__main__":
    main()