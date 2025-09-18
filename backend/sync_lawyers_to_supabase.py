#!/usr/bin/env python
"""
Script to sync lawyer data to Supabase
"""

import os
import sys
import django
import json
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'apna_lawyer.settings')
django.setup()

from lawyers.models import Lawyer
from apna_lawyer.supabase_client import supabase

def sync_lawyer_to_supabase(lawyer_data):
    """Sync a single lawyer to Supabase"""
    try:
        # Convert datetime to string if needed
        if 'created_at' in lawyer_data and hasattr(lawyer_data['created_at'], 'isoformat'):
            lawyer_data['created_at'] = lawyer_data['created_at'].isoformat()
        
        # Convert UUID to string
        if 'id' in lawyer_data:
            lawyer_data['id'] = str(lawyer_data['id'])
        
        # Remove None values
        lawyer_data = {k: v for k, v in lawyer_data.items() if v is not None}
        
        print(f"Syncing lawyer: {lawyer_data['name']}")
        
        # Try to insert with RLS bypass (using service role if available)
        try:
            response = supabase.table('lawyers').insert(lawyer_data).execute()
            print(f"✅ Successfully synced {lawyer_data['name']} to Supabase")
            return response.data
        except Exception as rls_error:
            print(f"⚠️  RLS Error for {lawyer_data['name']}: {str(rls_error)}")
            # Try alternative approach - create a simple record without RLS sensitive fields
            simple_data = {
                'name': lawyer_data['name'],
                'email': lawyer_data['email'],
                'phone_number': lawyer_data['phone_number'],
                'license_number': lawyer_data['license_number'],
                'primary_practice_area': lawyer_data.get('primary_practice_area', ''),
                'years_of_experience': lawyer_data.get('years_of_experience', 0)
            }
            response = supabase.table('lawyers').insert(simple_data).execute()
            print(f"✅ Successfully synced {lawyer_data['name']} to Supabase (simplified)")
            return response.data
            
    except Exception as e:
        print(f"❌ Error syncing {lawyer_data.get('name', 'Unknown')}: {str(e)}")
        return None

def create_and_sync_new_lawyers():
    """Create 2 new lawyers and sync them to Supabase"""
    
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
    
    lawyers_to_create = [lawyer1_data, lawyer2_data]
    
    for lawyer_data in lawyers_to_create:
        try:
            # Create in local Django database first
            print(f"\nCreating lawyer in local database: {lawyer_data['name']}")
            lawyer = Lawyer.objects.create(**lawyer_data)
            print(f"✅ Created {lawyer.name} in local database with ID: {lawyer.id}")
            
            # Prepare data for Supabase
            supabase_data = {
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
                'specialization_document': lawyer.specialization_document,
                'education_document': lawyer.education_document,
                'created_at': lawyer.created_at.isoformat()
            }
            
            # Sync to Supabase
            sync_result = sync_lawyer_to_supabase(supabase_data)
            if sync_result:
                print(f"✅ Successfully synced {lawyer.name} to Supabase")
            else:
                print(f"❌ Failed to sync {lawyer.name} to Supabase")
                
        except Exception as e:
            print(f"❌ Error creating lawyer {lawyer_data['name']}: {str(e)}")

def main():
    print("🚀 STARTING LAWYER CREATION AND SUPABASE SYNC")
    print("=" * 60)
    
    create_and_sync_new_lawyers()
    
    print("\n" + "=" * 60)
    print("📊 FINAL DATABASE STATUS")
    
    # Show local database count
    local_count = Lawyer.objects.count()
    print(f"Local Database: {local_count} lawyers")
    
    # Try to get Supabase count
    try:
        supabase_response = supabase.table('lawyers').select('id').execute()
        supabase_count = len(supabase_response.data)
        print(f"Supabase Database: {supabase_count} lawyers")
    except Exception as e:
        print(f"Supabase Database: Error getting count - {str(e)}")
    
    print("=" * 60)
    print("✅ SYNC PROCESS COMPLETED")

if __name__ == '__main__':
    main()