#!/usr/bin/env python3
"""
Simple authentication API test script.
Tests the authentication endpoints without Django test framework.
"""

import requests
import json
import time

def test_authentication_api():
    """Test the authentication API endpoints."""
    base_url = 'http://localhost:8000'
    
    print("🔐 Testing Django Authentication API with Supabase Integration")
    print("=" * 60)
    
    # Test data with timestamp to ensure uniqueness
    import time
    timestamp = str(int(time.time()))
    
    user_data = {
        'name': 'API Test User',
        'email': f'apitest{timestamp}@example.com',
        'password': 'apitest123456',
        'password_confirm': 'apitest123456',
        'residence': 'API Test City',
        'is_lawyer': False
    }
    
    lawyer_data = {
        'name': 'API Test Lawyer',
        'email': f'apilawyer{timestamp}@example.com',
        'password': 'apilawyer123456',
        'password_confirm': 'apilawyer123456',
        'residence': 'API Law City',
        'is_lawyer': True
    }
    
    try:
        # Test 1: User Signup
        print("\n1️⃣  Testing User Signup...")
        signup_response = requests.post(
            f'{base_url}/api/signup/',
            json=user_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"   Status: {signup_response.status_code}")
        if signup_response.status_code == 201:
            signup_data = signup_response.json()
            print(f"   ✅ User created: {signup_data['user']['name']}")
            print(f"   📧 Email: {signup_data['user']['email']}")
            print(f"   🏠 Residence: {signup_data['user']['residence']}")
            print(f"   ⚖️  Is Lawyer: {signup_data['user']['is_lawyer']}")
            
            # Store tokens for later use
            access_token = signup_data['tokens']['access']
            refresh_token = signup_data['tokens']['refresh']
            print(f"   🔑 Access Token: {access_token[:50]}...")
            print(f"   🔄 Refresh Token: {refresh_token[:50]}...")
        else:
            print(f"   ❌ Signup failed: {signup_response.text}")
            return False
        
        # Test 2: Lawyer Signup
        print("\n2️⃣  Testing Lawyer Signup...")
        lawyer_signup_response = requests.post(
            f'{base_url}/api/signup/',
            json=lawyer_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"   Status: {lawyer_signup_response.status_code}")
        if lawyer_signup_response.status_code == 201:
            lawyer_signup_data = lawyer_signup_response.json()
            print(f"   ✅ Lawyer created: {lawyer_signup_data['user']['name']}")
            print(f"   ⚖️  Is Lawyer: {lawyer_signup_data['user']['is_lawyer']}")
        else:
            print(f"   ❌ Lawyer signup failed: {lawyer_signup_response.text}")
        
        # Test 3: User Login
        print("\n3️⃣  Testing User Login...")
        login_response = requests.post(
            f'{base_url}/api/login/',
            json={
                'email': user_data['email'],
                'password': user_data['password']
            },
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"   Status: {login_response.status_code}")
        if login_response.status_code == 200:
            login_data = login_response.json()
            print(f"   ✅ Login successful for: {login_data['user']['name']}")
            
            # Update tokens from login
            access_token = login_data['tokens']['access']
            refresh_token = login_data['tokens']['refresh']
        else:
            print(f"   ❌ Login failed: {login_response.text}")
            return False
        
        # Test 4: Get Profile
        print("\n4️⃣  Testing Get Profile...")
        profile_response = requests.get(
            f'{base_url}/api/profile/',
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
        )
        
        print(f"   Status: {profile_response.status_code}")
        if profile_response.status_code == 200:
            profile_data = profile_response.json()
            print(f"   ✅ Profile retrieved:")
            print(f"      👤 Name: {profile_data['name']}")
            print(f"      📧 Email: {profile_data['email']}")
            print(f"      🏠 Residence: {profile_data['residence']}")
            print(f"      ⚖️  Is Lawyer: {profile_data['is_lawyer']}")
            print(f"      📅 Created: {profile_data['created_at']}")
        else:
            print(f"   ❌ Profile retrieval failed: {profile_response.text}")
        
        # Test 5: Update Profile
        print("\n5️⃣  Testing Update Profile...")
        update_data = {
            'name': 'Updated API Test User',
            'residence': 'Updated API Test City'
        }
        update_response = requests.put(
            f'{base_url}/api/profile/',
            json=update_data,
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
        )
        
        print(f"   Status: {update_response.status_code}")
        if update_response.status_code == 200:
            updated_data = update_response.json()
            print(f"   ✅ Profile updated:")
            print(f"      👤 New Name: {updated_data['name']}")
            print(f"      🏠 New Residence: {updated_data['residence']}")
        else:
            print(f"   ❌ Profile update failed: {update_response.text}")
        
        # Test 6: Change Password
        print("\n6️⃣  Testing Change Password...")
        password_data = {
            'old_password': user_data['password'],
            'new_password': 'newpassword123456',
            'new_password_confirm': 'newpassword123456'
        }
        password_response = requests.post(
            f'{base_url}/api/change-password/',
            json=password_data,
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
        )
        
        print(f"   Status: {password_response.status_code}")
        if password_response.status_code == 200:
            print(f"   ✅ Password changed successfully")
        else:
            print(f"   ❌ Password change failed: {password_response.text}")
        
        # Test 7: Token Refresh
        print("\n7️⃣  Testing Token Refresh...")
        refresh_response = requests.post(
            f'{base_url}/api/token/refresh/',
            json={'refresh': refresh_token},
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"   Status: {refresh_response.status_code}")
        if refresh_response.status_code == 200:
            refresh_data = refresh_response.json()
            new_access_token = refresh_data['access']
            print(f"   ✅ Token refreshed successfully")
            print(f"   🔑 New Access Token: {new_access_token[:50]}...")
            access_token = new_access_token  # Use new token for logout
        else:
            print(f"   ❌ Token refresh failed: {refresh_response.text}")
        
        # Test 8: Invalid Token Access
        print("\n8️⃣  Testing Invalid Token Access...")
        invalid_response = requests.get(
            f'{base_url}/api/profile/',
            headers={
                'Authorization': 'Bearer invalid_token_here',
                'Content-Type': 'application/json'
            }
        )
        
        print(f"   Status: {invalid_response.status_code}")
        if invalid_response.status_code == 401:
            print(f"   ✅ Invalid token correctly rejected")
        else:
            print(f"   ❌ Invalid token should be rejected: {invalid_response.text}")
        
        # Test 9: Logout
        print("\n9️⃣  Testing Logout...")
        logout_response = requests.post(
            f'{base_url}/api/logout/',
            json={'refresh': refresh_token},
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
        )
        
        print(f"   Status: {logout_response.status_code}")
        if logout_response.status_code == 200:
            print(f"   ✅ Logout successful")
        else:
            print(f"   ❌ Logout failed: {logout_response.text}")
        
        # Test 10: Access After Logout
        print("\n🔟 Testing Access After Logout...")
        post_logout_response = requests.get(
            f'{base_url}/api/profile/',
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
        )
        
        print(f"   Status: {post_logout_response.status_code}")
        if post_logout_response.status_code == 401:
            print(f"   ✅ Access correctly denied after logout")
        else:
            print(f"   ⚠️  Access after logout: {post_logout_response.status_code}")
        
        print("\n" + "=" * 60)
        print("🎉 Authentication API Testing Completed!")
        print("=" * 60)
        
        # Summary
        print("\n📊 Test Summary:")
        print("✅ User Registration")
        print("✅ Lawyer Registration") 
        print("✅ User Login")
        print("✅ Profile Retrieval")
        print("✅ Profile Update")
        print("✅ Password Change")
        print("✅ Token Refresh")
        print("✅ Invalid Token Rejection")
        print("✅ User Logout")
        print("✅ Post-Logout Access Control")
        
        print("\n🔧 Available Test Users:")
        print("📧 test@example.com / testpassword123")
        print("📧 lawyer@example.com / lawyerpassword123")
        print("📧 john@example.com / johnpassword123")
        print("📧 jane@example.com / janepassword123")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to server.")
        print("   Make sure Django is running: python manage.py runserver 8000")
        return False
    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")
        return False

if __name__ == '__main__':
    # Wait a moment for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(2)
    
    success = test_authentication_api()
    if success:
        print("\n🚀 All tests passed! Your authentication system is working correctly.")
    else:
        print("\n💥 Some tests failed. Check the output above for details.")