#!/usr/bin/env python
"""
Instructions and helper script to disable RLS on Supabase
"""

import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')

def print_instructions():
    print("🔧 MANUAL STEPS TO DISABLE RLS ON SUPABASE")
    print("=" * 60)
    print()
    print("Since we can't disable RLS programmatically, follow these steps:")
    print()
    print("1. 🌐 Go to your Supabase Dashboard:")
    print(f"   {SUPABASE_URL.replace('/rest/v1', '')}")
    print()
    print("2. 📊 Navigate to 'Table Editor' in the left sidebar")
    print()
    print("3. 🔍 Find the 'lawyers' table (create it if it doesn't exist)")
    print()
    print("4. ⚙️  Click on the 'lawyers' table")
    print()
    print("5. 🔒 Look for 'RLS' (Row Level Security) toggle/button")
    print("   - It might be in the table settings or a toggle switch")
    print("   - Click to DISABLE RLS for the lawyers table")
    print()
    print("6. ✅ Confirm the change")
    print()
    print("ALTERNATIVE METHOD:")
    print("=" * 30)
    print("If you can't find RLS toggle:")
    print()
    print("1. 🛠️  Go to 'SQL Editor' in Supabase Dashboard")
    print()
    print("2. 📝 Run this SQL command:")
    print("   ALTER TABLE lawyers DISABLE ROW LEVEL SECURITY;")
    print()
    print("3. ✅ Execute the query")
    print()
    print("CREATING THE TABLE (if it doesn't exist):")
    print("=" * 45)
    print("If the lawyers table doesn't exist, run this SQL:")
    print()
    print("""
CREATE TABLE lawyers (
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

-- Disable RLS
ALTER TABLE lawyers DISABLE ROW LEVEL SECURITY;
    """)
    print()
    print("=" * 60)
    print("After completing these steps, run:")
    print("python test_supabase_connection.py")
    print("=" * 60)

if __name__ == '__main__':
    print_instructions()