#!/usr/bin/env python
"""
Create a dummy user for testing purposes
"""

import os
import sys
import django
import json
from datetime import datetime
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'apna_lawyer.settings')
django.setup()

from users.models import User

def create_dummy_user():
    """Create a dummy user for testing"""
    
    dummy_user_data = {
        'name': 'Test Dummy User',
        'email': 'dummy.test@example.com',
        'password': 'dummypass123',
        'residence': 'Test City',
        'is_dummy': True  # Special flag to identify dummy users
    }
    
    try:
        # Check if dummy user already exists
        existing_user = User.objects.filter(email=dummy_user_data['email']).first()
        if existing_user:
            print(f"⚠️  Dummy user already exists: {existing_user.email}")
            print(f"   User ID: {existing_user.id}")
            print(f"   Name: {existing_user.name}")
            return existing_user
        
        # Create new dummy user
        print("🔨 Creating dummy user...")
        user = User.objects.create_user(
            username=dummy_user_data['email'],  # Use email as username
            name=dummy_user_data['name'],
            email=dummy_user_data['email'],
            password=dummy_user_data['password'],
            residence=dummy_user_data['residence']
        )
        
        # Add dummy flag (if the model supports it)
        try:
            user.is_dummy = True
            user.save()
        except AttributeError:
            # Model doesn't have is_dummy field, that's okay
            pass
        
        print(f"✅ Created dummy user successfully!")
        print(f"   User ID: {user.id}")
        print(f"   Name: {user.name}")
        print(f"   Email: {user.email}")
        print(f"   Residence: {user.residence}")
        
        return user
        
    except Exception as e:
        print(f"❌ Error creating dummy user: {str(e)}")
        return None

def test_dummy_user_login():
    """Test login with dummy user"""
    print("\n🧪 Testing dummy user login...")
    
    import requests
    
    login_data = {
        'email': 'dummy.test@example.com',
        'password': 'dummypass123'
    }
    
    try:
        response = requests.post('http://localhost:8000/users/login/', json=login_data)
        
        if response.status_code == 200:
            print("✅ Dummy user login successful!")
            data = response.json()
            print(f"   Response: {data}")
            return True
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Login test error: {str(e)}")
        return False

def list_all_dummy_users():
    """List all dummy users in the database"""
    print("\n📋 All dummy/test users in database:")
    
    try:
        # Find users with dummy-like characteristics
        dummy_users = User.objects.filter(
            email__icontains='dummy'
        ) | User.objects.filter(
            email__icontains='test'
        ) | User.objects.filter(
            name__icontains='dummy'
        ) | User.objects.filter(
            name__icontains='test'
        )
        
        if not dummy_users:
            print("   No dummy users found")
            return
        
        for i, user in enumerate(dummy_users, 1):
            print(f"\n{i}. {user.name}")
            print(f"   📧 Email: {user.email}")
            print(f"   🆔 ID: {user.id}")
            print(f"   📍 Residence: {user.residence}")
            print(f"   📅 Created: {user.created_at}")
            
    except Exception as e:
        print(f"❌ Error listing users: {str(e)}")

def remove_dummy_users():
    """Remove all dummy users (for cleanup)"""
    print("\n🧹 Removing dummy users...")
    
    try:
        dummy_users = User.objects.filter(
            email__icontains='dummy'
        ) | User.objects.filter(
            email__icontains='test'
        )
        
        count = dummy_users.count()
        if count == 0:
            print("   No dummy users to remove")
            return
        
        dummy_users.delete()
        print(f"✅ Removed {count} dummy users")
        
    except Exception as e:
        print(f"❌ Error removing dummy users: {str(e)}")

def main():
    print("👤 DUMMY USER MANAGEMENT")
    print("=" * 40)
    
    # Create dummy user
    user = create_dummy_user()
    
    if user:
        # Test login
        test_dummy_user_login()
        
        # List all dummy users
        list_all_dummy_users()
    
    print("\n" + "=" * 40)
    print("✅ DUMMY USER SETUP COMPLETED")
    print("\nUseful commands:")
    print("- To remove dummy users: python tests/create_dummy_user.py --cleanup")
    print("- To test login: curl -X POST http://localhost:8000/users/login/ \\")
    print("    -H 'Content-Type: application/json' \\")
    print("    -d '{\"email\":\"dummy.test@example.com\",\"password\":\"dummypass123\"}'")

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--cleanup':
        remove_dummy_users()
    else:
        main()