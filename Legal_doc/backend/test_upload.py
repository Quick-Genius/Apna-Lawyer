#!/usr/bin/env python
import requests
import json
import io

BASE_URL = 'http://127.0.0.1:8000/api'

def test_upload_document():
    """Test document upload to chat session"""
    
    # First create a chat session
    session_data = {'title': 'Test Upload Session'}
    response = requests.post(f'{BASE_URL}/chat/sessions/', json=session_data)
    print(f"Chat Session Creation: {response.status_code}")
    
    if response.status_code != 201:
        print(f"Session creation failed: {response.json()}")
        return
    
    session_id = response.json()['id']
    print(f"Created session ID: {session_id}")
    
    # Create a simple PDF-like file for testing
    # This is a minimal PDF structure
    pdf_content = b"""%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Test Document) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF"""
    
    # Upload the document
    files = {
        'file': ('test_document.pdf', io.BytesIO(pdf_content), 'application/pdf')
    }
    data = {
        'title': 'Test Document'
    }
    
    response = requests.post(
        f'{BASE_URL}/chat/sessions/{session_id}/upload_document/',
        files=files,
        data=data
    )
    
    print(f"Upload Document: {response.status_code}")
    if response.status_code != 201:
        print(f"Upload error: {response.text}")
        try:
            error_json = response.json()
            print(f"Error details: {json.dumps(error_json, indent=2)}")
        except:
            print("Could not parse error as JSON")
    else:
        print(f"Upload successful: {response.json()}")

if __name__ == '__main__':
    print("Testing document upload...")
    test_upload_document()