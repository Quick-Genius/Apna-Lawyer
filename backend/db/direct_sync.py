#!/usr/bin/env python
"""
Direct Supabase sync using HTTP requests
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

from lawyers.models import Lawyer
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

def create_lawyers_locally():
    """Create 2 new lawyers in local database"""
    
    # Lawyer 1: Robert Martinez
    lawyer1_data = {
        'name': 'Robert Martinez',
        'email': 'robert.martinez@taxlaw.com',
        'phone_number': '+1222333444',
        'license_number': 'LAW135792',
        'professional_information': 'Tax law attorney specializing in corporate tax planning and IRS disputes',
        'years_of_experience': 13,
        'primary_practice_area': 'Tax Law',
        'practice_location': 'Nevada',
        'working_court': 'US Tax Court'
    }
    
    # Lawyer 2: Lisa Chen
    lawyer2_data = {
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
    
    created_lawyers = []
    
    for lawyer_data in [lawyer1_data, lawyer2_data]:
        try:
            # Check if lawyer already exists
            existing = Lawyer.objects.filter(license_number=lawyer_data['license_number']).first()
            if existing:
                print(f"⚠️  Lawyer {lawyer_data['name']} already exists with license {lawyer_data['license_number']}")
                created_lawyers.append(existing)
                continue
                
            print(f"Creating lawyer: {lawyer_data['name']}")
            lawyer = Lawyer.objects.create(**lawyer_data)
            print(f"✅ Created {lawyer.name} in local database with ID: {lawyer.id}")
            created_lawyers.append(lawyer)
            
        except Exception as e:
            print(f"❌ Error creating lawyer {lawyer_data['name']}: {str(e)}")
    
    return created_lawyers

def sync_to_supabase_direct(lawyers):
    """Sync lawyers to Supabase using direct HTTP requests"""
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Missing Supabase credentials")
        return
    
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    url = f"{SUPABASE_URL}/rest/v1/lawyers"
    
    for lawyer in lawyers:
        try:
            # Prepare data for Supabase
            data = {
                'id': str(lawyer.id),
                'name': lawyer.name,
                'email': lawyer.email,
                'phone_number': lawyer.phone_number,
                'license_number': lawyer.license_number,
                'professional_information': lawyer.professional_information,
                'years_of_experience': lawyer.years_of_experience,
                'primary_practice_area': lawyer.primary_practice_area,
                'practice_location': lawyer.practice_location,
                'working_court': lawyer.working_court,
                'created_at': lawyer.created_at.isoformat()
            }
            
            print(f"Syncing {lawyer.name} to Supabase...")
            response = requests.post(url, headers=headers, json=data)
            
            if response.status_code in [200, 201]:
                print(f"✅ Successfully synced {lawyer.name} to Supabase")
                print(f"   Response: {response.json()}")
            else:
                print(f"❌ Failed to sync {lawyer.name} to Supabase")
                print(f"   Status: {response.status_code}")
                print(f"   Error: {response.text}")
                
        except Exception as e:
            print(f"❌ Error syncing {lawyer.name}: {str(e)}")

def verify_supabase_data():
    """Verify data in Supabase"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return
    
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
    }
    
    url = f"{SUPABASE_URL}/rest/v1/lawyers"
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"📊 Supabase contains {len(data)} lawyers:")
            for lawyer in data:
                print(f"   • {lawyer.get('name', 'Unknown')} - {lawyer.get('primary_practice_area', 'Unknown')}")
        else:
            print(f"❌ Error fetching Supabase data: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error verifying Supabase data: {str(e)}")

def main():
    print("🚀 CREATING NEW LAWYERS AND SYNCING TO SUPABASE")
    print("=" * 60)
    
    # Create lawyers locally
    lawyers = create_lawyers_locally()
    
    print(f"\n📊 Created {len(lawyers)} lawyers locally")
    
    # Sync to Supabase
    if lawyers:
        print("\n🔄 Syncing to Supabase...")
        sync_to_supabase_direct(lawyers)
    
    # Verify
    print("\n🔍 Verifying Supabase data...")
    verify_supabase_data()
    
    # Show local count
    local_count = Lawyer.objects.count()
    print(f"\n📊 Local Database: {local_count} lawyers total")
    
    print("\n" + "=" * 60)
    print("✅ PROCESS COMPLETED")

if __name__ == '__main__':
    main()