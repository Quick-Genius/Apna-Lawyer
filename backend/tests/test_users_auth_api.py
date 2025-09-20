"""
Comprehensive test suite for authentication API endpoints.
Tests user registration, login, logout, and profile management.
"""

import json
import requests
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class AuthenticationAPITestCase(APITestCase):
    """Test case for authentication API endpoints."""
    
    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.signup_url = '/api/signup/'
        self.login_url = '/api/login/'
        self.logout_url = '/api/logout/'
        self.profile_url = '/api/profile/'
        self.change_password_url = '/api/change-password/'
        
        self.user_data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'password': 'testpassword123',
            'password_confirm': 'testpassword123',
            'residence': 'Test City',
            'is_lawyer': False
        }
        
        self.lawyer_data = {
            'name': 'Test Lawyer',
            'email': 'lawyer@example.com',
            'password': 'lawyerpassword123',
            'password_confirm': 'lawyerpassword123',
            'residence': 'Law City',
            'is_lawyer': True
        }

    def test_user_signup_success(self):
        """Test successful user registration."""
        response = self.client.post(self.signup_url, self.user_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)
        
        # Check user data
        user_data = response.data['user']
        self.assertEqual(user_data['name'], self.user_data['name'])
        self.assertEqual(user_data['email'], self.user_data['email'])
        self.assertEqual(user_data['is_lawyer'], False)
        
        # Check tokens
        tokens = response.data['tokens']
        self.assertIn('access', tokens)
        self.assertIn('refresh', tokens)
        
        # Verify user was created in database
        user = User.objects.get(email=self.user_data['email'])
        self.assertEqual(user.name, self.user_data['name'])

    def test_lawyer_signup_success(self):
        """Test successful lawyer registration."""
        response = self.client.post(self.signup_url, self.lawyer_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user_data = response.data['user']
        self.assertEqual(user_data['is_lawyer'], True)

    def test_signup_duplicate_email(self):
        """Test signup with duplicate email."""
        # Create first user
        self.client.post(self.signup_url, self.user_data, format='json')
        
        # Try to create second user with same email
        response = self.client.post(self.signup_url, self.user_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_signup_password_mismatch(self):
        """Test signup with password confirmation mismatch."""
        data = self.user_data.copy()
        data['password_confirm'] = 'differentpassword'
        
        response = self.client.post(self.signup_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)

    def test_signup_weak_password(self):
        """Test signup with weak password."""
        data = self.user_data.copy()
        data['password'] = '123'
        data['password_confirm'] = '123'
        
        response = self.client.post(self.signup_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_login_success(self):
        """Test successful user login."""
        # Create user first
        self.client.post(self.signup_url, self.user_data, format='json')
        
        # Login
        login_data = {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        }
        response = self.client.post(self.login_url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)
        
        # Check tokens
        tokens = response.data['tokens']
        self.assertIn('access', tokens)
        self.assertIn('refresh', tokens)

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials."""
        # Create user first
        self.client.post(self.signup_url, self.user_data, format='json')
        
        # Try login with wrong password
        login_data = {
            'email': self.user_data['email'],
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_nonexistent_user(self):
        """Test login with non-existent user."""
        login_data = {
            'email': 'nonexistent@example.com',
            'password': 'somepassword'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_profile_get_authenticated(self):
        """Test getting user profile when authenticated."""
        # Create and login user
        signup_response = self.client.post(self.signup_url, self.user_data, format='json')
        access_token = signup_response.data['tokens']['access']
        
        # Get profile
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get(self.profile_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user_data['email'])
        self.assertEqual(response.data['name'], self.user_data['name'])

    def test_profile_get_unauthenticated(self):
        """Test getting user profile when not authenticated."""
        response = self.client.get(self.profile_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_update(self):
        """Test updating user profile."""
        # Create and login user
        signup_response = self.client.post(self.signup_url, self.user_data, format='json')
        access_token = signup_response.data['tokens']['access']
        
        # Update profile
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        update_data = {
            'name': 'Updated Name',
            'residence': 'Updated City'
        }
        response = self.client.put(self.profile_url, update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Name')
        self.assertEqual(response.data['residence'], 'Updated City')

    def test_change_password_success(self):
        """Test successful password change."""
        # Create and login user
        signup_response = self.client.post(self.signup_url, self.user_data, format='json')
        access_token = signup_response.data['tokens']['access']
        
        # Change password
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        password_data = {
            'old_password': self.user_data['password'],
            'new_password': 'newpassword123',
            'new_password_confirm': 'newpassword123'
        }
        response = self.client.post(self.change_password_url, password_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)

    def test_change_password_wrong_old_password(self):
        """Test password change with wrong old password."""
        # Create and login user
        signup_response = self.client.post(self.signup_url, self.user_data, format='json')
        access_token = signup_response.data['tokens']['access']
        
        # Try to change password with wrong old password
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        password_data = {
            'old_password': 'wrongoldpassword',
            'new_password': 'newpassword123',
            'new_password_confirm': 'newpassword123'
        }
        response = self.client.post(self.change_password_url, password_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('old_password', response.data)

    def test_logout_success(self):
        """Test successful logout."""
        # Create and login user
        signup_response = self.client.post(self.signup_url, self.user_data, format='json')
        access_token = signup_response.data['tokens']['access']
        refresh_token = signup_response.data['tokens']['refresh']
        
        # Logout
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        logout_data = {'refresh': refresh_token}
        response = self.client.post(self.logout_url, logout_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)


def test_authentication_endpoints_manually():
    """
    Manual test function to test authentication endpoints.
    Run this to test the API endpoints manually.
    """
    base_url = 'http://localhost:8000'
    
    # Test data
    user_data = {
        'name': 'Manual Test User',
        'email': 'manual@example.com',
        'password': 'manualtest123',
        'password_confirm': 'manualtest123',
        'residence': 'Manual Test City',
        'is_lawyer': False
    }
    
    print("Testing Authentication API Endpoints")
    print("=" * 50)
    
    try:
        # Test Signup
        print("1. Testing Signup...")
        signup_response = requests.post(
            f'{base_url}/api/signup/',
            json=user_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"Signup Status: {signup_response.status_code}")
        if signup_response.status_code == 201:
            signup_data = signup_response.json()
            print(f"User created: {signup_data['user']['name']}")
            access_token = signup_data['tokens']['access']
            refresh_token = signup_data['tokens']['refresh']
        else:
            print(f"Signup failed: {signup_response.text}")
            return
        
        # Test Login
        print("\n2. Testing Login...")
        login_response = requests.post(
            f'{base_url}/api/login/',
            json={
                'email': user_data['email'],
                'password': user_data['password']
            },
            headers={'Content-Type': 'application/json'}
        )
        print(f"Login Status: {login_response.status_code}")
        if login_response.status_code == 200:
            login_data = login_response.json()
            print(f"Login successful for: {login_data['user']['name']}")
        else:
            print(f"Login failed: {login_response.text}")
        
        # Test Profile
        print("\n3. Testing Profile...")
        profile_response = requests.get(
            f'{base_url}/api/profile/',
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
        )
        print(f"Profile Status: {profile_response.status_code}")
        if profile_response.status_code == 200:
            profile_data = profile_response.json()
            print(f"Profile retrieved: {profile_data['name']}")
        else:
            print(f"Profile failed: {profile_response.text}")
        
        # Test Logout
        print("\n4. Testing Logout...")
        logout_response = requests.post(
            f'{base_url}/api/logout/',
            json={'refresh': refresh_token},
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
        )
        print(f"Logout Status: {logout_response.status_code}")
        if logout_response.status_code == 200:
            print("Logout successful")
        else:
            print(f"Logout failed: {logout_response.text}")
        
        print("\n" + "=" * 50)
        print("Manual testing completed!")
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to server. Make sure Django is running on localhost:8000")
    except Exception as e:
        print(f"Error during testing: {str(e)}")


if __name__ == '__main__':
    test_authentication_endpoints_manually()