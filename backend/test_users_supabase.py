#!/usr/bin/env python3
"""
Supabase Users and User_Chats Table Testing Script

This script tests connectivity and data flow for the users and user_chats tables
by inserting dummy data and verifying successful storage.
"""

import os
import uuid
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class UsersSupabaseTest:
    """Test class for users and user_chats table operations"""
    
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Supabase credentials not found in environment variables")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        self.test_user_id = None
        
        print("🔗 Supabase client initialized successfully")
        print(f"   URL: {self.supabase_url}")
        print(f"   Key: {self.supabase_key[:20]}...")

    def test_connection(self):
        """Test basic Supabase connection"""
        try:
            # Try a simple query to test connection
            result = self.supabase.table('users').select('*').limit(1).execute()
            print("✅ Supabase connection successful")
            return True
        except Exception as e:
            print(f"❌ Supabase connection failed: {e}")
            return False

    def insert_dummy_user(self):
        """Insert a dummy user into the users table"""
        print("\n📝 Inserting dummy user...")
        
        # Generate unique email to avoid conflicts
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        dummy_user = {
            "name": "Test User",
            "email": f"testuser_{timestamp}@example.com",
            "password": "dummy_password",
            "residence": "Sample City",
            "is_lawyer": False
        }
        
        try:
            result = self.supabase.table('users').insert(dummy_user).execute()
            
            if result.data and len(result.data) > 0:
                self.test_user_id = result.data[0]['id']
                print("✅ User inserted successfully!")
                print(f"   User ID: {self.test_user_id}")
                print(f"   Name: {result.data[0]['name']}")
                print(f"   Email: {result.data[0]['email']}")
                print(f"   Residence: {result.data[0]['residence']}")
                print(f"   Is Lawyer: {result.data[0]['is_lawyer']}")
                print(f"   Created At: {result.data[0]['created_at']}")
                return True
            else:
                print("❌ No data returned after user insertion")
                return False
                
        except Exception as e:
            print(f"❌ Error inserting user: {e}")
            return False

    def insert_dummy_chat(self):
        """Insert dummy chat data into user_chats table"""
        if not self.test_user_id:
            print("❌ No user ID available for chat insertion")
            return False
        
        print("\n💬 Inserting dummy chat...")
        
        dummy_chat = {
            "user_id": self.test_user_id,
            "user_text_input": "Hello AI, how are you?",
            "ai_text_output": "I am doing great, thank you!",
            "user_document_submission": "dummy_doc.pdf",
            "chatbot_document": "summary.txt"
        }
        
        try:
            result = self.supabase.table('user_chats').insert(dummy_chat).execute()
            
            if result.data and len(result.data) > 0:
                chat_data = result.data[0]
                print("✅ Chat inserted successfully!")
                print(f"   Chat ID: {chat_data['id']}")
                print(f"   User ID: {chat_data['user_id']}")
                print(f"   User Input: {chat_data['user_text_input']}")
                print(f"   AI Output: {chat_data['ai_text_output']}")
                print(f"   User Document: {chat_data['user_document_submission']}")
                print(f"   Chatbot Document: {chat_data['chatbot_document']}")
                print(f"   Created At: {chat_data['created_at']}")
                return True
            else:
                print("❌ No data returned after chat insertion")
                return False
                
        except Exception as e:
            print(f"❌ Error inserting chat: {e}")
            return False

    def insert_multiple_chats(self):
        """Insert multiple chat messages for the same user"""
        if not self.test_user_id:
            print("❌ No user ID available for multiple chat insertion")
            return False
        
        print("\n💬💬 Inserting multiple chat messages...")
        
        chat_conversations = [
            {
                "user_id": self.test_user_id,
                "user_text_input": "What are my rights as a tenant?",
                "ai_text_output": "As a tenant in India, you have several rights including the right to peaceful enjoyment of the property, protection against arbitrary eviction, and the right to basic amenities as agreed in the lease.",
                "user_document_submission": "lease_agreement.pdf",
                "chatbot_document": "tenant_rights_summary.txt"
            },
            {
                "user_id": self.test_user_id,
                "user_text_input": "Can my landlord increase rent without notice?",
                "ai_text_output": "Rent increases typically require proper notice as per your lease agreement and local rent control laws. Most states require 30-90 days notice for rent increases.",
                "user_document_submission": None,
                "chatbot_document": "rent_increase_guidelines.txt"
            },
            {
                "user_id": self.test_user_id,
                "user_text_input": "Thank you for the information!",
                "ai_text_output": "You're welcome! Feel free to ask if you have any more legal questions.",
                "user_document_submission": None,
                "chatbot_document": None
            }
        ]
        
        try:
            result = self.supabase.table('user_chats').insert(chat_conversations).execute()
            
            if result.data and len(result.data) > 0:
                print(f"✅ {len(result.data)} chat messages inserted successfully!")
                for i, chat in enumerate(result.data, 1):
                    print(f"   Message {i}: {chat['user_text_input'][:50]}...")
                return True
            else:
                print("❌ No data returned after multiple chat insertion")
                return False
                
        except Exception as e:
            print(f"❌ Error inserting multiple chats: {e}")
            return False

    def verify_user_data(self):
        """Verify user data by fetching it back from the database"""
        print("\n🔍 Verifying user data...")
        
        try:
            # Fetch all users (limit to recent ones)
            result = self.supabase.table('users').select('*').order('created_at', desc=True).limit(5).execute()
            
            if result.data:
                print(f"✅ Found {len(result.data)} users in database:")
                for user in result.data:
                    print(f"   👤 {user['name']} ({user['email']})")
                    print(f"      ID: {user['id']}")
                    print(f"      Residence: {user['residence']}")
                    print(f"      Is Lawyer: {user['is_lawyer']}")
                    print(f"      Created: {user['created_at']}")
                    print()
                return True
            else:
                print("❌ No users found in database")
                return False
                
        except Exception as e:
            print(f"❌ Error fetching users: {e}")
            return False

    def verify_chat_data(self):
        """Verify chat data by fetching it back from the database"""
        print("\n🔍 Verifying chat data...")
        
        try:
            # Fetch chats for our test user
            if self.test_user_id:
                result = self.supabase.table('user_chats').select('*').eq('user_id', self.test_user_id).order('created_at', desc=False).execute()
            else:
                # Fetch recent chats
                result = self.supabase.table('user_chats').select('*').order('created_at', desc=True).limit(10).execute()
            
            if result.data:
                print(f"✅ Found {len(result.data)} chat messages:")
                for i, chat in enumerate(result.data, 1):
                    print(f"   💬 Message {i}:")
                    print(f"      Chat ID: {chat['id']}")
                    print(f"      User ID: {chat['user_id']}")
                    print(f"      User: {chat['user_text_input']}")
                    print(f"      AI: {chat['ai_text_output']}")
                    if chat['user_document_submission']:
                        print(f"      User Doc: {chat['user_document_submission']}")
                    if chat['chatbot_document']:
                        print(f"      AI Doc: {chat['chatbot_document']}")
                    print(f"      Created: {chat['created_at']}")
                    print()
                return True
            else:
                print("❌ No chats found in database")
                return False
                
        except Exception as e:
            print(f"❌ Error fetching chats: {e}")
            return False

    def verify_relationship(self):
        """Verify the relationship between users and user_chats tables"""
        print("\n🔗 Verifying user-chat relationships...")
        
        try:
            # Fetch users with their chat counts
            result = self.supabase.table('users').select('id, name, email').execute()
            
            if result.data:
                print("✅ User-Chat relationship verification:")
                for user in result.data:
                    # Count chats for each user
                    chat_result = self.supabase.table('user_chats').select('id', count='exact').eq('user_id', user['id']).execute()
                    chat_count = len(chat_result.data) if chat_result.data else 0
                    
                    print(f"   👤 {user['name']} ({user['email']})")
                    print(f"      User ID: {user['id']}")
                    print(f"      Chat Messages: {chat_count}")
                    print()
                return True
            else:
                print("❌ No users found for relationship verification")
                return False
                
        except Exception as e:
            print(f"❌ Error verifying relationships: {e}")
            return False

    def cleanup_test_data(self):
        """Clean up test data (optional)"""
        print("\n🧹 Cleaning up test data...")
        
        try:
            if self.test_user_id:
                # Delete chats first (due to foreign key constraint)
                chat_result = self.supabase.table('user_chats').delete().eq('user_id', self.test_user_id).execute()
                print(f"   Deleted {len(chat_result.data) if chat_result.data else 0} chat messages")
                
                # Delete user
                user_result = self.supabase.table('users').delete().eq('id', self.test_user_id).execute()
                print(f"   Deleted {len(user_result.data) if user_result.data else 0} user record")
                
                print("✅ Test data cleaned up successfully")
                return True
            else:
                print("   No test user ID to clean up")
                return True
                
        except Exception as e:
            print(f"❌ Error cleaning up test data: {e}")
            return False

    def run_complete_test(self, cleanup=False):
        """Run the complete test suite"""
        print("🚀 Starting Users and User_Chats Supabase Test")
        print("=" * 60)
        
        test_results = []
        
        # Test connection
        test_results.append(("Connection Test", self.test_connection()))
        
        # Insert dummy user
        test_results.append(("User Insertion", self.insert_dummy_user()))
        
        # Insert dummy chat
        test_results.append(("Chat Insertion", self.insert_dummy_chat()))
        
        # Insert multiple chats
        test_results.append(("Multiple Chats", self.insert_multiple_chats()))
        
        # Verify data
        test_results.append(("User Verification", self.verify_user_data()))
        test_results.append(("Chat Verification", self.verify_chat_data()))
        test_results.append(("Relationship Verification", self.verify_relationship()))
        
        # Optional cleanup
        if cleanup:
            test_results.append(("Cleanup", self.cleanup_test_data()))
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = 0
        total = len(test_results)
        
        for test_name, result in test_results:
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{test_name:.<30} {status}")
            if result:
                passed += 1
        
        print(f"\nOverall Result: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Supabase users and user_chats tables are working correctly.")
        else:
            print("⚠️  Some tests failed. Please check the error messages above.")
        
        return passed == total

def main():
    """Main function to run the test"""
    try:
        tester = UsersSupabaseTest()
        
        # Ask user if they want to clean up test data
        cleanup_choice = input("\nDo you want to clean up test data after testing? (y/n): ").lower().strip()
        cleanup = cleanup_choice in ['y', 'yes']
        
        # Run the complete test
        success = tester.run_complete_test(cleanup=cleanup)
        
        if not cleanup and success:
            print(f"\n💡 Test user ID for manual inspection: {tester.test_user_id}")
            print("   You can manually check this data in your Supabase dashboard")
        
    except KeyboardInterrupt:
        print("\n\n👋 Test cancelled by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()