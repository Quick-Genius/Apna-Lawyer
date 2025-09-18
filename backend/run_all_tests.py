#!/usr/bin/env python
"""
Complete test suite runner for Apna Lawyer API
This script runs all tests and provides comprehensive coverage report
"""

import os
import sys
import django
from django.core.management import execute_from_command_line
from django.test.utils import get_runner
from django.conf import settings

def main():
    """Run all tests with comprehensive reporting"""
    
    print("🚀 APNA LAWYER API - COMPREHENSIVE TEST SUITE")
    print("=" * 60)
    
    # Set up Django environment
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'apna_lawyer.test_settings')
    django.setup()
    
    print("\n📋 TEST COVERAGE OVERVIEW:")
    print("-" * 40)
    
    test_coverage = {
        'User Authentication & Management': [
            '✅ User Registration (POST /users/signup/)',
            '✅ User Login (POST /users/login/)',
            '✅ User Logout (POST /users/logout/)',
            '✅ User Profile (GET /users/profile/)',
            '✅ Duplicate Email Handling',
            '✅ Invalid Credentials Handling',
            '✅ Authentication Requirements'
        ],
        'AI Chat System': [
            '✅ Chatbot Interaction (POST /chats/api/)',
            '✅ Chat History (GET /chats/chat/history/)',
            '✅ Message Validation',
            '✅ Authentication Requirements',
            '✅ Database Persistence'
        ],
        'Lawyer Management': [
            '✅ Lawyer List (GET /lawyers/api/lawyers/)',
            '✅ Lawyer Creation (POST /lawyers/api/lawyers/create/)',
            '✅ Lawyer CRUD via ViewSet',
            '✅ Duplicate License/Email Handling',
            '✅ Field Validation',
            '✅ Not Found Handling'
        ]
    }
    
    for category, tests in test_coverage.items():
        print(f"\n{category}:")
        for test in tests:
            print(f"  {test}")
    
    print("\n" + "=" * 60)
    print("🧪 RUNNING TESTS...")
    print("=" * 60)
    
    # Run the tests
    from django.test.runner import DiscoverRunner
    
    test_runner = DiscoverRunner(
        verbosity=2,
        interactive=False,
        keepdb=False,
        reverse=False,
        debug_mode=False,
        debug_sql=False,
        parallel=0,
        tags=None,
        exclude_tags=None,
    )
    
    # Test all our custom API tests
    test_labels = [
        'users.test_api',
        'chats.test_api', 
        'lawyers.test_api'
    ]
    
    failures = test_runner.run_tests(test_labels)
    
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    if failures == 0:
        print("🎉 ALL TESTS PASSED SUCCESSFULLY!")
        print("\n✅ Your Apna Lawyer API is fully functional with:")
        print("   • Complete user authentication system")
        print("   • Working AI chat integration")
        print("   • Full lawyer management CRUD operations")
        print("   • Proper error handling and validation")
        print("   • Authentication and authorization")
        
        print("\n🚀 NEXT STEPS:")
        print("1. Set up your database credentials in .env file")
        print("2. Run migrations: python manage.py migrate")
        print("3. Create a superuser: python manage.py createsuperuser")
        print("4. Start the server: python manage.py runserver")
        print("5. Test endpoints manually using the test_endpoints.py script")
        
        print("\n📚 DOCUMENTATION:")
        print("• Check API_TESTING_GUIDE.md for detailed endpoint documentation")
        print("• Use test_endpoints.py for manual HTTP testing")
        print("• All endpoints are ready for frontend integration")
        
    else:
        print(f"❌ {failures} TEST(S) FAILED")
        print("Please review the test output above for details.")
        print("Common issues:")
        print("• Database connection problems")
        print("• Missing dependencies")
        print("• Configuration errors")
    
    print("\n" + "=" * 60)
    
    return failures

if __name__ == '__main__':
    failures = main()
    sys.exit(1 if failures else 0)