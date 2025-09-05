import requests
import json

BASE_URL = 'http://127.0.0.1:8000/api'

def test_user_registration():
    """Test user registration"""
    import random
    username = f'testuser{random.randint(1000, 9999)}'
    data = {
        'username': username,
        'email': f'test{random.randint(100, 999)}@example.com',
        'first_name': 'Test',
        'last_name': 'User',
        'password': 'testpass123',
        'password_confirm': 'testpass123'
    }
    
    response = requests.post(f'{BASE_URL}/users/register/', json=data)
    print(f"Registration: {response.status_code}")
    if response.status_code != 201:
        print(f"Registration error: {response.json()}")
    if response.status_code == 201:
        return response.json().get('token')
    return None

def test_chat_session(token):
    """Test creating chat session and sending message"""
    headers = {'Authorization': f'Token {token}'}
    
    # Create chat session
    session_data = {'title': 'Test Chat'}
    response = requests.post(f'{BASE_URL}/chat/sessions/', json=session_data, headers=headers)
    print(f"Chat Session Creation: {response.status_code}")
    
    if response.status_code == 201:
        session_id = response.json()['id']
        
        # Send message (without OpenAI key, will get error but test structure)
        message_data = {'message': 'What is a liability clause?'}
        response = requests.post(f'{BASE_URL}/chat/sessions/{session_id}/send_message/', 
                               json=message_data, headers=headers)
        print(f"Send Message: {response.status_code}")
        print(f"Response: {response.json()}")

def test_lawyers_api(token):
    """Test lawyers API"""
    headers = {'Authorization': f'Token {token}'}
    
    response = requests.get(f'{BASE_URL}/lawyers/list/', headers=headers)
    print(f"Get Lawyers: {response.status_code}")
    if response.status_code == 200:
        print(f"Found {len(response.json()['results'])} lawyers")

if __name__ == '__main__':
    print("Testing API endpoints...")
    
    # Test registration
    token = test_user_registration()
    
    if token:
        print(f"Got token: {token[:20]}...")
        
        # Test other endpoints
        test_chat_session(token)
        test_lawyers_api(token)
    else:
        print("Registration failed, skipping other tests")
