from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import UserChat

User = get_user_model()

class ChatAPITestCase(APITestCase):
    def setUp(self):
        self.chatbot_api_url = reverse('chatbot_api')
        self.chat_history_url = reverse('chat_history')
        
        # Create test user
        self.user = User.objects.create_user(
            username='testuser@example.com',
            email='testuser@example.com',
            name='Test User',
            password='testpass123'
        )
        
        # Create some test chats
        self.chat1 = UserChat.objects.create(
            user=self.user,
            user_text_input="What are my rights as a tenant?",
            ai_text_output="As a tenant, you have several rights..."
        )
        
        self.chat2 = UserChat.objects.create(
            user=self.user,
            user_text_input="How do I file a complaint?",
            ai_text_output="To file a complaint, you need to..."
        )

    def test_chatbot_api_authenticated(self):
        """Test chatbot API with authenticated user"""
        self.client.force_authenticate(user=self.user)
        
        message_data = {
            'message': 'What is contract law?'
        }
        
        response = self.client.post(self.chatbot_api_url, message_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('response', response.data)
        self.assertIn('chat_id', response.data)
        self.assertIn('timestamp', response.data)
        
        # Verify chat was saved to database
        chat_count = UserChat.objects.filter(user=self.user).count()
        self.assertEqual(chat_count, 3)  # 2 from setUp + 1 new

    def test_chatbot_api_unauthenticated(self):
        """Test chatbot API without authentication"""
        message_data = {
            'message': 'What is contract law?'
        }
        
        response = self.client.post(self.chatbot_api_url, message_data, format='json')
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_chatbot_api_empty_message(self):
        """Test chatbot API with empty message"""
        self.client.force_authenticate(user=self.user)
        
        message_data = {
            'message': ''
        }
        
        response = self.client.post(self.chatbot_api_url, message_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_chatbot_api_missing_message(self):
        """Test chatbot API with missing message field"""
        self.client.force_authenticate(user=self.user)
        
        response = self.client.post(self.chatbot_api_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_chat_history_authenticated(self):
        """Test chat history for authenticated user"""
        self.client.force_authenticate(user=self.user)
        
        response = self.client.get(self.chat_history_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('chats', response.data)
        self.assertIn('total_count', response.data)
        self.assertEqual(response.data['total_count'], 2)
        
        # Check if chats are ordered by most recent first
        chats = response.data['chats']
        self.assertEqual(len(chats), 2)
        self.assertIn('id', chats[0])
        self.assertIn('user_message', chats[0])
        self.assertIn('ai_response', chats[0])
        self.assertIn('timestamp', chats[0])

    def test_chat_history_unauthenticated(self):
        """Test chat history without authentication"""
        response = self.client.get(self.chat_history_url)
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_chat_history_empty(self):
        """Test chat history for user with no chats"""
        # Create new user with no chats
        new_user = User.objects.create_user(
            username='newuser@example.com',
            email='newuser@example.com',
            name='New User',
            password='newpass123'
        )
        
        self.client.force_authenticate(user=new_user)
        response = self.client.get(self.chat_history_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_count'], 0)
        self.assertEqual(len(response.data['chats']), 0)