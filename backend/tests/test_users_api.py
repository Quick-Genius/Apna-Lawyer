from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
import json

User = get_user_model()

class UserAPITestCase(APITestCase):
    def setUp(self):
        self.signup_url = reverse('signup')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.profile_url = reverse('profile')
        
        self.test_user_data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'password': 'testpassword123',
            'residence': 'Test City',
            'is_lawyer': False
        }
        
        # Create a test user for authenticated tests
        self.user = User.objects.create_user(
            username='existing@example.com',
            email='existing@example.com',
            name='Existing User',
            password='existingpass123'
        )

    def test_signup_success(self):
        """Test successful user signup"""
        response = self.client.post(self.signup_url, self.test_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
        self.assertIn('user_id', response.data)
        self.assertEqual(response.data['email'], self.test_user_data['email'])

    def test_signup_duplicate_email(self):
        """Test signup with existing email"""
        # First signup
        self.client.post(self.signup_url, self.test_user_data, format='json')
        # Try to signup again with same email
        response = self.client.post(self.signup_url, self.test_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_signup_missing_fields(self):
        """Test signup with missing required fields"""
        incomplete_data = {'email': 'test@example.com'}
        response = self.client.post(self.signup_url, incomplete_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_success(self):
        """Test successful login"""
        login_data = {
            'email': 'existing@example.com',
            'password': 'existingpass123'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertIn('user_id', response.data)

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        login_data = {
            'email': 'existing@example.com',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)

    def test_profile_authenticated(self):
        """Test profile view for authenticated user"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)
        self.assertEqual(response.data['name'], self.user.name)

    def test_profile_unauthenticated(self):
        """Test profile view for unauthenticated user"""
        response = self.client.get(self.profile_url)
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_logout_authenticated(self):
        """Test logout for authenticated user"""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)

    def test_logout_unauthenticated(self):
        """Test logout for unauthenticated user"""
        response = self.client.post(self.logout_url)
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])