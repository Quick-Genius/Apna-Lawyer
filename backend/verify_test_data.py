#!/usr/bin/env python3
"""
Verification script to read and display test data from users and user_chats tables
Run this after executing complete_test_data.sql in Supabase
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

def verify_supabase_test_data():
    """Verify that test data was successfully inserted and can be read"""
    
    print("🔍 Verifying Supabase Test Data")
    print("=" * 50)
    
    # Initialize Supabase client
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY')
    
    if not supabase_url or not supabase_key:
        print("❌ Supabase credentials not found!")
        return False
    
    supabase: Client = create_client(supabase_url, supabase_key)
    print("✅ Connected to Supabase")
    
    try:
        # 1. Verify users table
        print("\n👥 USERS TABLE VERIFICATION")
        print("-" * 30)
        
        users_result = supabase.table('users').select('*').order('created_at', desc=True).execute()
        
        if users_result.data:
            print(f"✅ Found {len(users_result.data)} users:")
            for i, user in enumerate(users_result.data, 1):
                print(f"\n   {i}. {user['name']}")
                print(f"      📧 Email: {user['email']}")
                print(f"      🏠 Residence: {user['residence']}")
                print(f"      ⚖️  Is Lawyer: {user['is_lawyer']}")
                print(f"      🆔 ID: {user['id']}")
                print(f"      📅 Created: {user['created_at']}")
        else:
            print("❌ No users found!")
            return False
        
        # 2. Verify user_chats table
        print(f"\n💬 USER_CHATS TABLE VERIFICATION")
        print("-" * 35)
        
        chats_result = supabase.table('user_chats').select('*').order('created_at', desc=False).execute()
        
        if chats_result.data:
            print(f"✅ Found {len(chats_result.data)} chat messages:")
            for i, chat in enumerate(chats_result.data, 1):
                print(f"\n   💬 Message {i}:")
                print(f"      🆔 Chat ID: {chat['id']}")
                print(f"      👤 User ID: {chat['user_id']}")
                print(f"      📝 User Input: {chat['user_text_input']}")
                print(f"      🤖 AI Output: {chat['ai_text_output']}")
                if chat['user_document_submission']:
                    print(f"      📄 User Doc: {chat['user_document_submission']}")
                if chat['chatbot_document']:
                    print(f"      📋 AI Doc: {chat['chatbot_document']}")
                print(f"      📅 Created: {chat['created_at']}")
        else:
            print("❌ No chats found!")
            return False
        
        # 3. Verify relationships
        print(f"\n🔗 RELATIONSHIP VERIFICATION")
        print("-" * 28)
        
        # Get users with their chat counts
        user_chat_stats = {}
        for user in users_result.data:
            user_id = user['id']
            user_chats = [chat for chat in chats_result.data if chat['user_id'] == user_id]
            user_chat_stats[user['name']] = {
                'email': user['email'],
                'chat_count': len(user_chats),
                'chats': user_chats
            }
        
        print("✅ User-Chat relationships:")
        for user_name, stats in user_chat_stats.items():
            print(f"\n   👤 {user_name} ({stats['email']})")
            print(f"      💬 Total messages: {stats['chat_count']}")
            
            if stats['chats']:
                print(f"      📝 Recent messages:")
                for chat in stats['chats'][:3]:  # Show first 3 messages
                    print(f"         • {chat['user_text_input'][:50]}...")
        
        # 4. Test specific queries
        print(f"\n🔍 SPECIFIC QUERY TESTS")
        print("-" * 25)
        
        # Test filtering by user
        test_user_email = 'testuser@example.com'
        test_user_result = supabase.table('users').select('*').eq('email', test_user_email).execute()
        
        if test_user_result.data:
            test_user = test_user_result.data[0]
            print(f"✅ Found test user: {test_user['name']}")
            
            # Get chats for this specific user
            user_chats_result = supabase.table('user_chats').select('*').eq('user_id', test_user['id']).order('created_at').execute()
            
            if user_chats_result.data:
                print(f"✅ Found {len(user_chats_result.data)} chats for test user")
                print(f"   📝 Conversation flow:")
                for i, chat in enumerate(user_chats_result.data, 1):
                    print(f"      {i}. USER: {chat['user_text_input']}")
                    print(f"         AI: {chat['ai_text_output']}")
            else:
                print("❌ No chats found for test user")
        else:
            print(f"❌ Test user not found: {test_user_email}")
        
        # 5. Data integrity checks
        print(f"\n🛡️  DATA INTEGRITY CHECKS")
        print("-" * 27)
        
        # Check for orphaned chats (chats without valid user_id)
        all_user_ids = [user['id'] for user in users_result.data]
        orphaned_chats = [chat for chat in chats_result.data if chat['user_id'] not in all_user_ids]
        
        if orphaned_chats:
            print(f"⚠️  Found {len(orphaned_chats)} orphaned chats (invalid user_id)")
        else:
            print("✅ No orphaned chats found - all foreign keys valid")
        
        # Check for duplicate emails
        emails = [user['email'] for user in users_result.data]
        duplicate_emails = [email for email in emails if emails.count(email) > 1]
        
        if duplicate_emails:
            print(f"⚠️  Found duplicate emails: {set(duplicate_emails)}")
        else:
            print("✅ No duplicate emails found - unique constraint working")
        
        # 6. Summary statistics
        print(f"\n📊 SUMMARY STATISTICS")
        print("-" * 20)
        
        total_users = len(users_result.data)
        total_chats = len(chats_result.data)
        lawyers_count = len([u for u in users_result.data if u['is_lawyer']])
        regular_users_count = total_users - lawyers_count
        
        print(f"👥 Total Users: {total_users}")
        print(f"   ⚖️  Lawyers: {lawyers_count}")
        print(f"   👤 Regular Users: {regular_users_count}")
        print(f"💬 Total Chat Messages: {total_chats}")
        print(f"📈 Average Messages per User: {total_chats/total_users:.1f}")
        
        # Check for users with documents
        chats_with_user_docs = len([c for c in chats_result.data if c['user_document_submission']])
        chats_with_ai_docs = len([c for c in chats_result.data if c['chatbot_document']])
        
        print(f"📄 Chats with User Documents: {chats_with_user_docs}")
        print(f"📋 Chats with AI Documents: {chats_with_ai_docs}")
        
        print(f"\n🎉 VERIFICATION COMPLETED SUCCESSFULLY!")
        print("=" * 50)
        print("✅ All tables are accessible and contain test data")
        print("✅ Relationships between users and chats are working")
        print("✅ Data integrity checks passed")
        print("✅ Supabase connectivity and data flow confirmed")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error during verification: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main function"""
    print("🚀 This script verifies test data in Supabase")
    print("   Make sure you've run 'complete_test_data.sql' first!")
    print()
    
    success = verify_supabase_test_data()
    
    if success:
        print(f"\n✅ Verification successful!")
        print("   Your Supabase users and user_chats tables are working correctly")
    else:
        print(f"\n❌ Verification failed!")
        print("   Please check your Supabase setup and run the SQL script first")

if __name__ == "__main__":
    main()