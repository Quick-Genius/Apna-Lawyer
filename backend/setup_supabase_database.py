#!/usr/bin/env python
"""
Setup Supabase database for direct Django usage
"""

import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

def disable_rls_on_lawyers_table():
    """Disable Row Level Security on lawyers table"""
    print("🔧 Attempting to disable RLS on lawyers table...")
    
    # This would typically require service role key or SQL access
    # For now, we'll create a simple policy that allows all operations
    
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json'
    }
    
    # Try to create a permissive RLS policy
    sql_commands = [
        "ALTER TABLE lawyers DISABLE ROW LEVEL SECURITY;",
        "DROP POLICY IF EXISTS \"Allow all operations\" ON lawyers;",
        "CREATE POLICY \"Allow all operations\" ON lawyers FOR ALL USING (true) WITH CHECK (true);"
    ]
    
    for sql in sql_commands:
        try:
            url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
            response = requests.post(url, headers=headers, json={"sql": sql})
            print(f"SQL: {sql}")
            print(f"Status: {response.status_code}")
            if response.status_code not in [200, 201]:
                print(f"Response: {response.text}")
        except Exception as e:
            print(f"Error executing SQL: {e}")

def create_lawyers_table_if_not_exists():
    """Create lawyers table in Supabase if it doesn't exist"""
    print("\n🏗️  Creating lawyers table structure...")
    
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json'
    }
    
    # Create table SQL
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS lawyers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone_number TEXT NOT NULL,
        license_number TEXT UNIQUE NOT NULL,
        professional_information TEXT,
        years_of_experience INTEGER,
        primary_practice_area TEXT,
        practice_location TEXT,
        working_court TEXT,
        specialization_document TEXT,
        education_document TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    try:
        url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
        response = requests.post(url, headers=headers, json={"sql": create_table_sql})
        print(f"Create table status: {response.status_code}")
        if response.status_code not in [200, 201]:
            print(f"Response: {response.text}")
        else:
            print("✅ Table creation attempted")
    except Exception as e:
        print(f"❌ Error creating table: {e}")

def test_direct_insert():
    """Test direct insert to Supabase"""
    print("\n🧪 Testing direct insert...")
    
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    test_lawyer = {
        'name': 'Test Lawyer Setup',
        'email': 'test.setup@example.com',
        'phone_number': '+1000000001',
        'license_number': 'SETUP123',
        'primary_practice_area': 'Test Law',
        'years_of_experience': 1
    }
    
    url = f"{SUPABASE_URL}/rest/v1/lawyers"
    
    try:
        response = requests.post(url, headers=headers, json=test_lawyer)
        print(f"Insert test status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            print("✅ Direct insert successful!")
            data = response.json()
            print(f"Created lawyer: {data}")
            
            # Clean up test data
            cleanup_url = f"{SUPABASE_URL}/rest/v1/lawyers?license_number=eq.SETUP123"
            requests.delete(cleanup_url, headers=headers)
            print("🧹 Test data cleaned up")
            return True
        else:
            print(f"❌ Insert failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Insert error: {e}")
        return False

def main():
    print("🚀 SETTING UP SUPABASE DATABASE FOR DIRECT USAGE")
    print("=" * 60)
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Missing Supabase credentials in .env file")
        return
    
    print(f"🔗 Supabase URL: {SUPABASE_URL}")
    print(f"🔑 Using API Key: {SUPABASE_KEY[:20]}...")
    
    # Step 1: Create table structure
    create_lawyers_table_if_not_exists()
    
    # Step 2: Try to disable RLS
    disable_rls_on_lawyers_table()
    
    # Step 3: Test insert
    success = test_direct_insert()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ SUPABASE SETUP SUCCESSFUL!")
        print("You can now use Django with Supabase directly.")
    else:
        print("⚠️  SUPABASE SETUP INCOMPLETE")
        print("Manual steps required:")
        print("1. Go to Supabase Dashboard")
        print("2. Navigate to Authentication > Policies")
        print("3. Disable RLS on 'lawyers' table OR create permissive policies")
        print("4. Ensure the table structure matches Django models")
    
    print("=" * 60)

if __name__ == '__main__':
    main()