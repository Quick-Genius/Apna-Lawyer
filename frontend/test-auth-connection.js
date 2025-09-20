/**
 * Simple test script to verify frontend-backend authentication connection
 */

const API_BASE_URL = 'http://localhost:8000';

async function testAuthConnection() {
  console.log('🔗 Testing Frontend-Backend Authentication Connection');
  console.log('=' * 60);

  try {
    // Test 1: Backend Health Check
    console.log('\n1️⃣  Testing Backend Connection...');
    const healthResponse = await fetch(`${API_BASE_URL}/api/signup/`, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (healthResponse.ok || healthResponse.status === 405) {
      console.log('   ✅ Backend is accessible');
    } else {
      console.log('   ❌ Backend connection failed');
      return;
    }

    // Test 2: Test Signup
    console.log('\n2️⃣  Testing User Signup...');
    const timestamp = Date.now();
    const signupData = {
      name: 'Frontend Test User',
      email: `frontend-test-${timestamp}@example.com`,
      password: 'frontendtest123',
      password_confirm: 'frontendtest123',
      residence: 'Frontend City',
      is_lawyer: false
    };

    const signupResponse = await fetch(`${API_BASE_URL}/api/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData)
    });

    if (signupResponse.ok) {
      const signupResult = await signupResponse.json();
      console.log('   ✅ Signup successful');
      console.log(`   👤 User: ${signupResult.user.name}`);
      console.log(`   📧 Email: ${signupResult.user.email}`);
      console.log(`   🔑 Access Token: ${signupResult.tokens.access.substring(0, 50)}...`);
      
      // Test 3: Test Login
      console.log('\n3️⃣  Testing User Login...');
      const loginResponse = await fetch(`${API_BASE_URL}/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password
        })
      });

      if (loginResponse.ok) {
        const loginResult = await loginResponse.json();
        console.log('   ✅ Login successful');
        console.log(`   👤 User: ${loginResult.user.name}`);
        
        // Test 4: Test Authenticated Request
        console.log('\n4️⃣  Testing Authenticated Request...');
        const profileResponse = await fetch(`${API_BASE_URL}/api/profile/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginResult.tokens.access}`,
            'Content-Type': 'application/json',
          }
        });

        if (profileResponse.ok) {
          const profileResult = await profileResponse.json();
          console.log('   ✅ Authenticated request successful');
          console.log(`   👤 Profile: ${profileResult.name}`);
          console.log(`   📧 Email: ${profileResult.email}`);
        } else {
          console.log('   ❌ Authenticated request failed');
        }
      } else {
        console.log('   ❌ Login failed');
      }
    } else {
      const error = await signupResponse.json();
      console.log('   ❌ Signup failed:', error);
    }

    console.log('\n' + '=' * 60);
    console.log('🎉 Frontend-Backend Connection Test Complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Open http://localhost:5173 in your browser');
    console.log('2. Try signing up with a new account');
    console.log('3. Try signing in with existing test accounts:');
    console.log('   📧 test@example.com / testpassword123');
    console.log('   📧 lawyer@example.com / lawyerpassword123');

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Django backend is running: python manage.py runserver 8000');
    console.log('2. Make sure frontend is running: npm run dev');
    console.log('3. Check CORS settings in Django');
  }
}

// Run the test
testAuthConnection();