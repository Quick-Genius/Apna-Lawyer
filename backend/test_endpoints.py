#!/usr/bin/env python
"""
Manual endpoint testing script for Apna Lawyer API
This script makes actual HTTP requests to test all endpoints
"""

import os
import sys
import django
import requests
import json
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'apna_lawyer.settings')
django.setup()

BASE_URL = 'http://localhost:8000'

class APITester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, endpoint, method, status_code, success, message=""):
        """Log test results"""
        result = {
            'endpoint': endpoint,
            'method': method,
            'status_code': status_code,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {method} {endpoint} - {status_code} - {message}")
    
    def test_user_endpoints(self):
        """Test user-related endpoints"""
        print("\n" + "="*50)
        print("TESTING USER ENDPOINTS")
        print("="*50)
        
        # Test signup
        signup_data = {
            'name': 'Test User',
            'email': 'testuser@example.com',
            'password': 'testpass123',
            'residence': 'Test City'
        }
        
        try:
            response = self.session.post(f'{BASE_URL}/users/signup/', json=signup_data)
            success = response.status_code in [200, 201]
            self.log_test('/users/signup/', 'POST', response.status_code, success, 
                         "User signup" + (" successful" if success else " failed"))
        except requests.exceptions.ConnectionError:
            self.log_test('/users/signup/', 'POST', 0, False, "Server not running")
            return
        
        # Test login
        login_data = {
            'email': 'testuser@example.com',
            'password': 'testpass123'
        }
        
        try:
            response = self.session.post(f'{BASE_URL}/users/login/', json=login_data)
            success = response.status_code == 200
            self.log_test('/users/login/', 'POST', response.status_code, success,
                         "User login" + (" successful" if success else " failed"))
        except requests.exceptions.ConnectionError:
            self.log_test('/users/login/', 'POST', 0, False, "Server not running")
        
        # Test profile (requires authentication)
        try:
            response = self.session.get(f'{BASE_URL}/users/profile/')
            success = response.status_code in [200, 401]  # 401 is expected if not authenticated
            self.log_test('/users/profile/', 'GET', response.status_code, success,
                         "Profile access" + (" works" if success else " failed"))
        except requests.exceptions.ConnectionError:
            self.log_test('/users/profile/', 'GET', 0, False, "Server not running")
    
    def test_chat_endpoints(self):
        """Test chat-related endpoints"""
        print("\n" + "="*50)
        print("TESTING CHAT ENDPOINTS")
        print("="*50)
        
        # Test chatbot API
        chat_data = {
            'message': 'What is contract law?'
        }
        
        try:
            response = self.session.post(f'{BASE_URL}/chats/api/', json=chat_data)
            success = response.status_code in [200, 401]  # 401 expected if not authenticated
            self.log_test('/chats/api/', 'POST', response.status_code, success,
                         "Chatbot API" + (" accessible" if success else " failed"))
        except requests.exceptions.ConnectionError:
            self.log_test('/chats/api/', 'POST', 0, False, "Server not running")
        
        # Test chat history
        try:
            response = self.session.get(f'{BASE_URL}/chats/chat/history/')
            success = response.status_code in [200, 401]  # 401 expected if not authenticated
            self.log_test('/chats/chat/history/', 'GET', response.status_code, success,
                         "Chat history" + (" accessible" if success else " failed"))
        except requests.exceptions.ConnectionError:
            self.log_test('/chats/chat/history/', 'GET', 0, False, "Server not running")
    
    def test_lawyer_endpoints(self):
        """Test lawyer-related endpoints"""
        print("\n" + "="*50)
        print("TESTING LAWYER ENDPOINTS")
        print("="*50)
        
        # Test lawyer list
        try:
            response = self.session.get(f'{BASE_URL}/lawyers/api/lawyers/')
            success = response.status_code == 200
            self.log_test('/lawyers/api/lawyers/', 'GET', response.status_code, success,
                         "Lawyer list" + (" retrieved" if success else " failed"))
        except requests.exceptions.ConnectionError:
            self.log_test('/lawyers/api/lawyers/', 'GET', 0, False, "Server not running")
        
        # Test lawyer creation
        lawyer_data = {
            'name': 'Test Lawyer',
            'email': 'testlawyer@example.com',
            'phone_number': '+1234567890',
            'license_number': 'TEST123456',
            'professional_information': 'Test lawyer for API testing',
            'years_of_experience': 5,
            'primary_practice_area': 'Test Law',
            'practice_location': 'Test City'
        }
        
        try:
            response = self.session.post(f'{BASE_URL}/lawyers/api/lawyers/create/', json=lawyer_data)
            success = response.status_code in [200, 201]
            self.log_test('/lawyers/api/lawyers/create/', 'POST', response.status_code, success,
                         "Lawyer creation" + (" successful" if success else " failed"))
        except requests.exceptions.ConnectionError:
            self.log_test('/lawyers/api/lawyers/create/', 'POST', 0, False, "Server not running")
        
        # Test LawyerViewSet endpoints
        try:
            response = self.session.get(f'{BASE_URL}/lawyers/lawyers/')
            success = response.status_code == 200
            self.log_test('/lawyers/lawyers/', 'GET', response.status_code, success,
                         "LawyerViewSet list" + (" works" if success else " failed"))
        except requests.exceptions.ConnectionError:
            self.log_test('/lawyers/lawyers/', 'GET', 0, False, "Server not running")
    
    def run_all_tests(self):
        """Run all endpoint tests"""
        print("🚀 STARTING API ENDPOINT TESTS")
        print(f"Testing against: {BASE_URL}")
        print("Note: Server must be running on localhost:8000")
        
        self.test_user_endpoints()
        self.test_chat_endpoints()
        self.test_lawyer_endpoints()
        
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  ❌ {result['method']} {result['endpoint']} - {result['message']}")
        
        print("\n" + "="*60)
        
        if failed_tests == 0:
            print("🎉 ALL TESTS PASSED!")
        else:
            print("⚠️  Some tests failed. Check server status and configuration.")

def main():
    """Main function"""
    print("APNA LAWYER API - ENDPOINT TESTER")
    print("This script tests all API endpoints by making HTTP requests")
    print("Make sure your Django server is running: python manage.py runserver")
    
    input("\nPress Enter to start testing...")
    
    tester = APITester()
    tester.run_all_tests()

if __name__ == '__main__':
    main()