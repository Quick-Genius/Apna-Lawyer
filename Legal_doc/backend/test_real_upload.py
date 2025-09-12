#!/usr/bin/env python
import requests
import json
import io

BASE_URL = 'http://127.0.0.1:8000/api'

def create_test_pdf():
    """Create a simple PDF with extractable text using reportlab"""
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    
    # Add some text to the PDF
    p.drawString(100, 750, "SAMPLE LEGAL CONTRACT")
    p.drawString(100, 720, "")
    p.drawString(100, 690, "This is a sample legal document for testing purposes.")
    p.drawString(100, 660, "")
    p.drawString(100, 630, "TERMS AND CONDITIONS:")
    p.drawString(100, 600, "1. The parties agree to the following terms...")
    p.drawString(100, 570, "2. Liability shall be limited to...")
    p.drawString(100, 540, "3. This agreement shall terminate...")
    p.drawString(100, 510, "")
    p.drawString(100, 480, "CONFIDENTIALITY CLAUSE:")
    p.drawString(100, 450, "All information shared shall remain confidential.")
    
    p.showPage()
    p.save()
    
    buffer.seek(0)
    return buffer.getvalue()

def test_upload_with_text():
    """Test document upload with extractable text"""
    
    # First create a chat session
    session_data = {'title': 'Test Upload Session with Text'}
    response = requests.post(f'{BASE_URL}/chat/sessions/', json=session_data)
    print(f"Chat Session Creation: {response.status_code}")
    
    if response.status_code != 201:
        print(f"Session creation failed: {response.json()}")
        return
    
    session_id = response.json()['id']
    print(f"Created session ID: {session_id}")
    
    # Use simple PDF since reportlab isn't available
    print("Using simple PDF for testing")
    # Simple PDF with extractable text
    pdf_content = b"""%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R>>endobj
4 0 obj<</Length 44>>stream
BT /F1 12 Tf 72 720 Td (Sample Contract Text) Tj ET
endstream endobj
xref 0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer<</Size 5/Root 1 0 R>>
startxref 297
%%EOF"""
    
    # Upload the document
    files = {
        'file': ('sample_contract.pdf', io.BytesIO(pdf_content), 'application/pdf')
    }
    data = {
        'title': 'Sample Legal Contract'
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
        result = response.json()
        print(f"Upload successful!")
        print(f"Document ID: {result['document']['id']}")
        print(f"Analysis summary: {result['analysis_summary'][:200]}...")

if __name__ == '__main__':
    print("Testing document upload with extractable text...")
    test_upload_with_text()