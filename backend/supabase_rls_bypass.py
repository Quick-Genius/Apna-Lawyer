#!/usr/bin/env python
"""
Attempt to bypass Supabase RLS or use service role
"""

import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

def test_supabase_connection():
    """Test basic Supabase connection"""
    print("🔍 Testing Supabase Connection...")
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Missing Supabase credentials")
        return False
    
    # Test read access
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
    }
    
    url = f"{SUPABASE_URL}/rest/v1/lawyers"
    
    try:
        response = requests.get(url, headers=headers)
        print(f"📊 GET Request Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Successfully connected to Supabase")
            print(f"📊 Current lawyers in Supabase: {len(data)}")
            return True
        else:
            print(f"❌ Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Connection error: {str(e)}")
        return False

def try_simple_insert():
    """Try a simple insert to test RLS"""
    print("\n🔄 Testing Simple Insert...")
    
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    # Try with minimal data
    test_data = {
        'name': 'Test Lawyer',
        'email': 'test@example.com',
        'phone_number': '+1000000000',
        'license_number': 'TEST123'
    }
    
    url = f"{SUPABASE_URL}/rest/v1/lawyers"
    
    try:
        response = requests.post(url, headers=headers, json=test_data)
        print(f"📊 POST Request Status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            print("✅ Insert successful!")
            print(f"📄 Response: {response.json()}")
            
            # Clean up test data
            cleanup_test_data()
            return True
        else:
            print(f"❌ Insert failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Insert error: {str(e)}")
        return False

def cleanup_test_data():
    """Clean up test data"""
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
    }
    
    url = f"{SUPABASE_URL}/rest/v1/lawyers?license_number=eq.TEST123"
    
    try:
        response = requests.delete(url, headers=headers)
        if response.status_code in [200, 204]:
            print("🧹 Test data cleaned up")
    except:
        pass

def insert_real_lawyers():
    """Insert the 2 real lawyers we created"""
    print("\n🚀 Attempting to Insert Real Lawyers...")
    
    lawyers_data = [
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
    
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    url = f"{SUPABASE_URL}/rest/v1/lawyers"
    success_count = 0
    
    for lawyer_data in lawyers_data:
        try:
            print(f"Inserting {lawyer_data['name']}...")
            response = requests.post(url, headers=headers, json=lawyer_data)
            
            if response.status_code in [200, 201]:
                print(f"✅ Successfully inserted {lawyer_data['name']}")
                success_count += 1
            else:
                print(f"❌ Failed to insert {lawyer_data['name']}: {response.text}")
                
        except Exception as e:
            print(f"❌ Error inserting {lawyer_data['name']}: {str(e)}")
    
    return success_count

def main():
    print("🔧 SUPABASE RLS BYPASS ATTEMPT")
    print("=" * 50)
    
    # Test connection
    if not test_supabase_connection():
        print("❌ Cannot proceed without Supabase connection")
        return
    
    # Try simple insert
    if try_simple_insert():
        print("✅ RLS allows inserts - proceeding with real data")
        success_count = insert_real_lawyers()
        print(f"\n📊 Successfully inserted {success_count}/2 lawyers")
    else:
        print("❌ RLS is blocking inserts")
        print("\n💡 SOLUTIONS:")
        print("1. Disable RLS on the 'lawyers' table in Supabase dashboard")
        print("2. Create RLS policies that allow INSERT operations")
        print("3. Use a service role key instead of anon key")
        print("4. Add authentication to bypass RLS")
    
    print("\n" + "=" * 50)
    print("✅ ANALYSIS COMPLETED")

if __name__ == '__main__':
    main()