#!/usr/bin/env python
"""
Test Supabase connection and create sample lawyers
"""

import os
import sys
import django
from dotenv import load_dotenv

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'apna_lawyer.settings')
django.setup()

from apna_lawyer.supabase_client import supabase

def test_connection():
    """Test basic Supabase connection"""
    print("🔍 Testing Supabase connection...")
    try:
        response = supabase.table('lawyers').select('*').execute()
        print(f"✅ Connection successful!")
        print(f"📊 Current lawyers in Supabase: {len(response.data)}")
        return True
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        return False

def create_sample_lawyers():
    """Create 2 sample lawyers in Supabase"""
    print("\n🚀 Creating sample lawyers in Supabase...")
    
    lawyers = [
        {
            'name': 'Robert Martinez',
            'email': 'robert.martinez@taxlaw.com',
            'phone_number': '+1222333444',
            'license_number': 'LAW135792',
            'professional_information': 'Tax law attorney specializing in corporate tax planning and IRS disputes',
            'years_of_experience': 13,
            'primary_practice_area': 'Tax Law',
            'practice_location': 'Nevada',
            'working_court': 'US Tax Court'
        },
        {
            'name': 'Lisa Chen',
            'email': 'lisa.chen@environmentallaw.com',
            'phone_number': '+1666777888',
            'license_number': 'LAW864209',
            'professional_information': 'Environmental law attorney focusing on climate change litigation and regulatory compliance',
            'years_of_experience': 11,
            'primary_practice_area': 'Environmental Law',
            'practice_location': 'Oregon',
            'working_court': 'Federal District Court'
        }
    ]
    
    created_count = 0
    for lawyer in lawyers:
        try:
            print(f"Creating {lawyer['name']}...")
            response = supabase.table('lawyers').insert(lawyer).execute()
            if response.data:
                print(f"✅ Created {lawyer['name']} successfully!")
                created_count += 1
            else:
                print(f"❌ Failed to create {lawyer['name']}")
        except Exception as e:
            print(f"❌ Error creating {lawyer['name']}: {str(e)}")
    
    return created_count

def list_all_lawyers():
    """List all lawyers in Supabase"""
    print("\n📋 Current lawyers in Supabase:")
    try:
        response = supabase.table('lawyers').select('*').execute()
        lawyers = response.data
        
        if not lawyers:
            print("   No lawyers found in database")
            return
        
        for i, lawyer in enumerate(lawyers, 1):
            print(f"\n{i}. {lawyer['name']}")
            print(f"   📧 {lawyer['email']}")
            print(f"   ⚖️  {lawyer['primary_practice_area']}")
            print(f"   📍 {lawyer['practice_location']}")
            print(f"   👨‍💼 {lawyer['years_of_experience']} years experience")
            
    except Exception as e:
        print(f"❌ Error listing lawyers: {str(e)}")

def test_api_endpoints():
    """Test the Django API endpoints"""
    print("\n🧪 Testing Django API endpoints...")
    
    import requests
    
    try:
        # Test lawyer list endpoint
        response = requests.get('http://localhost:8000/lawyers/api/lawyers/')
        print(f"📊 GET /lawyers/api/lawyers/ - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API working! Found {len(data)} lawyers")
        else:
            print(f"❌ API error: {response.text}")
            
    except Exception as e:
        print(f"❌ API test error: {str(e)}")
        print("Make sure Django server is running: python manage.py runserver")

def main():
    print("🚀 TESTING SUPABASE CONNECTION AND SETUP")
    print("=" * 60)
    
    # Test connection
    if not test_connection():
        print("\n❌ SETUP INCOMPLETE")
        print("Please follow the RLS disable instructions first:")
        print("python disable_rls_instructions.py")
        return
    
    # Create sample lawyers
    created = create_sample_lawyers()
    print(f"\n📊 Created {created}/2 lawyers successfully")
    
    # List all lawyers
    list_all_lawyers()
    
    # Test API endpoints
    test_api_endpoints()
    
    print("\n" + "=" * 60)
    if created > 0:
        print("✅ SUPABASE SETUP SUCCESSFUL!")
        print("Your Django app is now using Supabase for data storage.")
        print("No data will be saved locally anymore.")
    else:
        print("⚠️  PARTIAL SUCCESS")
        print("Connection works but couldn't create lawyers.")
        print("Check RLS settings in Supabase dashboard.")
    print("=" * 60)

if __name__ == '__main__':
    main()