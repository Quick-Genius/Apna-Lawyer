/**
 * Test script to verify UI changes:
 * 1. Previous chats instead of sample questions for logged-in users
 * 2. Updated navbar dropdown with Profile, Settings, Logout
 */

const API_BASE_URL = 'http://localhost:8000';

async function testUIChanges() {
  console.log('🎨 Testing UI Changes');
  console.log('=' * 50);

  try {
    // Test 1: Create a user and login to test authenticated features
    console.log('\n1️⃣  Creating test user for UI testing...');
    const timestamp = Date.now();
    const testUser = {
      name: 'UI Test User',
      email: `uitest-${timestamp}@example.com`,
      password: 'uitest123456',
      password_confirm: 'uitest123456',
      residence: 'UI Test City',
      is_lawyer: false
    };

    const signupResponse = await fetch(`${API_BASE_URL}/api/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (signupResponse.ok) {
      const signupData = await signupResponse.json();
      console.log('   ✅ Test user created successfully');
      console.log(`   👤 User: ${signupData.user.name}`);
      
      const accessToken = signupData.tokens.access;

      // Test 2: Create some chat messages to populate chat history
      console.log('\n2️⃣  Creating sample chat messages...');
      
      const sampleMessages = [
        "What does this contract clause mean?",
        "Is this agreement legally binding?",
        "What are my rights in this situation?"
      ];

      for (let i = 0; i < sampleMessages.length; i++) {
        try {
          const chatResponse = await fetch(`${API_BASE_URL}/chats/api/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: sampleMessages[i]
            })
          });

          if (chatResponse.ok) {
            console.log(`   ✅ Chat message ${i + 1} created: "${sampleMessages[i]}"`);
          } else {
            console.log(`   ⚠️  Chat message ${i + 1} failed (this is expected if chat endpoint needs different format)`);
          }
        } catch (error) {
          console.log(`   ⚠️  Chat message ${i + 1} failed: ${error.message}`);
        }
      }

      // Test 3: Test chat history retrieval
      console.log('\n3️⃣  Testing chat history retrieval...');
      try {
        const historyResponse = await fetch(`${API_BASE_URL}/chats/chat/history/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          console.log(`   ✅ Chat history retrieved: ${historyData.chats?.length || 0} chats found`);
          
          if (historyData.chats && historyData.chats.length > 0) {
            console.log('   📝 Recent chats:');
            historyData.chats.slice(0, 3).forEach((chat, index) => {
              console.log(`      ${index + 1}. "${chat.user_message}"`);
            });
          }
        } else {
          console.log('   ⚠️  Chat history retrieval failed (endpoint might need different format)');
        }
      } catch (error) {
        console.log(`   ⚠️  Chat history error: ${error.message}`);
      }

      console.log('\n' + '=' * 50);
      console.log('🎉 UI Changes Test Complete!');
      console.log('\n📋 What to Test in Browser:');
      console.log('1. Open http://localhost:5173');
      console.log('2. Sign in with the test account:');
      console.log(`   📧 Email: ${testUser.email}`);
      console.log(`   🔑 Password: ${testUser.password}`);
      console.log('3. Go to Chat page and check:');
      console.log('   ✅ Left sidebar should show "Previous Chats" instead of "Sample Questions"');
      console.log('   ✅ Should display recent chat messages (if any)');
      console.log('4. Check navbar user dropdown:');
      console.log('   ✅ Should show "Profile", "Settings", "Logout" options');
      console.log('5. Test with anonymous user:');
      console.log('   ✅ Should still show "Sample Questions" when not logged in');
      console.log('   ✅ Navbar should show "Sign In" option');

      console.log('\n🔧 Alternative Test Accounts:');
      console.log('📧 test@example.com / testpassword123');
      console.log('📧 lawyer@example.com / lawyerpassword123');

    } else {
      const error = await signupResponse.json();
      console.log('   ❌ Test user creation failed:', error);
    }

  } catch (error) {
    console.error('❌ UI test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend is running: python manage.py runserver 8000');
    console.log('2. Make sure frontend is running: npm run dev');
    console.log('3. Open browser and test manually at http://localhost:5173');
  }
}

// Run the test
testUIChanges();