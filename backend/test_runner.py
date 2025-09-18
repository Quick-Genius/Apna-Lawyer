#!/usr/bin/env python
"""
Comprehensive test runner for the Apna Lawyer API
This script runs all tests and provides a summary of API endpoint coverage
"""

import os
import sys
import django
from django.conf import settings
from django.test.utils import get_runner
from django.core.management import execute_from_command_line

def setup_django():
    """Setup Django environment"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'apna_lawyer.settings')
    django.setup()

def run_tests():
    """Run all tests"""
    print("=" * 60)
    print("APNA LAWYER API - COMPREHENSIVE TEST SUITE")
    print("=" * 60)
    
    # Test apps and their endpoints
    test_coverage = {
        'users': [
            'POST /users/signup/ - User registration',
            'POST /users/login/ - User authentication', 
            'POST /users/logout/ - User logout',
            'GET /users/profile/ - User profile retrieval'
        ],
        'chats': [
            'POST /chats/api/ - AI chatbot interaction',
            'GET /chats/chat/history/ - Chat history retrieval'
        ],
        'lawyers': [
            'GET /lawyers/api/lawyers/ - Lawyer list retrieval',
            'POST /lawyers/api/lawyers/create/ - Lawyer creation',
            'GET /lawyers/lawyers/ - LawyerViewSet list',
            'POST /lawyers/lawyers/ - LawyerViewSet create',
            'GET /lawyers/lawyers/{id}/ - LawyerViewSet retrieve',
            'PUT /lawyers/lawyers/{id}/ - LawyerViewSet update',
            'PATCH /lawyers/lawyers/{id}/ - LawyerViewSet partial update',
            'DELETE /lawyers/lawyers/{id}/ - LawyerViewSet delete'
        ]
    }
    
    print("\nAPI ENDPOINTS BEING TESTED:")
    print("-" * 40)
    for app, endpoints in test_coverage.items():
        print(f"\n{app.upper()} APP:")
        for endpoint in endpoints:
            print(f"  ✓ {endpoint}")
    
    print("\n" + "=" * 60)
    print("RUNNING TESTS...")
    print("=" * 60)
    
    # Run Django tests
    from django.test.runner import DiscoverRunner
    test_runner = DiscoverRunner(verbosity=2, interactive=False, keepdb=False)
    
    # Test specific apps
    test_apps = ['users.test_api', 'chats.test_api', 'lawyers.test_api']
    
    failures = test_runner.run_tests(test_apps)
    
    print("\n" + "=" * 60)
    if failures:
        print(f"TESTS COMPLETED WITH {failures} FAILURES")
        print("Please check the output above for details.")
    else:
        print("ALL TESTS PASSED SUCCESSFULLY! ✅")
        print("Your API endpoints are working correctly.")
    print("=" * 60)
    
    return failures

def main():
    """Main function"""
    setup_django()
    failures = run_tests()
    
    if failures:
        sys.exit(1)
    else:
        print("\n🎉 Congratulations! Your Apna Lawyer API is ready for use.")
        print("\nNext steps:")
        print("1. Run migrations: python manage.py migrate")
        print("2. Create superuser: python manage.py createsuperuser")
        print("3. Start development server: python manage.py runserver")
        sys.exit(0)

if __name__ == '__main__':
    main()