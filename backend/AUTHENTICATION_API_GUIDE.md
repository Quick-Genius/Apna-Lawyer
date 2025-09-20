# Authentication API Guide

This guide covers the complete Django authentication system with Supabase integration, including JWT token-based authentication.

## Overview

The authentication system provides:
- User registration (signup)
- User login with JWT tokens
- User logout with token blacklisting
- Profile management
- Password change functionality
- Supabase synchronization
- Protected route middleware

## API Endpoints

### 1. User Registration (Signup)

**Endpoint:** `POST /api/signup/`

**Description:** Register a new user account

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "residence": "New York",
    "is_lawyer": false
}
```

**Response (201 Created):**
```json
{
    "message": "User registered successfully",
    "user": {
        "id": "uuid-here",
        "name": "John Doe",
        "email": "john@example.com",
        "is_lawyer": false,
        "residence": "New York"
    },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
}
```

**Error Response (400 Bad Request):**
```json
{
    "email": ["A user with this email already exists."],
    "password": ["This password is too short."]
}
```

### 2. User Login

**Endpoint:** `POST /api/login/`

**Description:** Authenticate user and receive JWT tokens

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
    "message": "Login successful",
    "user": {
        "id": "uuid-here",
        "name": "John Doe",
        "email": "john@example.com",
        "is_lawyer": false,
        "residence": "New York"
    },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
}
```

**Error Response (400 Bad Request):**
```json
{
    "non_field_errors": ["Invalid email or password."]
}
```

### 3. User Logout

**Endpoint:** `POST /api/logout/`

**Description:** Logout user and blacklist refresh token

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):**
```json
{
    "message": "Logout successful"
}
```

### 4. Get User Profile

**Endpoint:** `GET /api/profile/`

**Description:** Get current user's profile information

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "residence": "New York",
    "is_lawyer": false,
    "created_at": "2024-01-01T00:00:00Z"
}
```

### 5. Update User Profile

**Endpoint:** `PUT /api/profile/`

**Description:** Update current user's profile information

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "name": "John Updated",
    "residence": "Los Angeles"
}
```

**Response (200 OK):**
```json
{
    "id": "uuid-here",
    "name": "John Updated",
    "email": "john@example.com",
    "residence": "Los Angeles",
    "is_lawyer": false,
    "created_at": "2024-01-01T00:00:00Z"
}
```

### 6. Change Password

**Endpoint:** `POST /api/change-password/`

**Description:** Change user's password

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
    "old_password": "currentpassword",
    "new_password": "newpassword123",
    "new_password_confirm": "newpassword123"
}
```

**Response (200 OK):**
```json
{
    "message": "Password changed successfully"
}
```

### 7. Refresh Token

**Endpoint:** `POST /api/token/refresh/`

**Description:** Get new access token using refresh token

**Request Body:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## Authentication Flow

### 1. Registration Flow
1. User submits registration form
2. Server validates input data
3. User created in Django database
4. User data synced to Supabase
5. JWT tokens generated and returned

### 2. Login Flow
1. User submits email/password
2. Server validates credentials
3. JWT tokens generated and returned
4. Client stores tokens for future requests

### 3. Protected Request Flow
1. Client includes `Authorization: Bearer <access_token>` header
2. Server validates JWT token
3. User information extracted from token
4. Request processed with authenticated user

### 4. Token Refresh Flow
1. When access token expires, client uses refresh token
2. Server validates refresh token
3. New access token generated and returned
4. Client updates stored access token

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
    "error": "Authentication required",
    "message": "Authorization header is missing"
}
```

**400 Bad Request:**
```json
{
    "field_name": ["Error message for this field"]
}
```

**500 Internal Server Error:**
```json
{
    "error": "Registration failed. Please try again."
}
```

## Testing the API

### Using curl

**Register a new user:**
```bash
curl -X POST http://localhost:8000/api/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpassword123",
    "password_confirm": "testpassword123",
    "residence": "Test City",
    "is_lawyer": false
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

**Get profile (replace TOKEN with actual access token):**
```bash
curl -X GET http://localhost:8000/api/profile/ \
  -H "Authorization: Bearer TOKEN"
```

### Using Python requests

```python
import requests

# Register
response = requests.post('http://localhost:8000/api/signup/', json={
    'name': 'Test User',
    'email': 'test@example.com',
    'password': 'testpassword123',
    'password_confirm': 'testpassword123',
    'residence': 'Test City',
    'is_lawyer': False
})

if response.status_code == 201:
    data = response.json()
    access_token = data['tokens']['access']
    
    # Get profile
    profile_response = requests.get(
        'http://localhost:8000/api/profile/',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    print(profile_response.json())
```

### Using Django Management Commands

**Create test users:**
```bash
python manage.py create_test_users
```

**Clear and recreate test users:**
```bash
python manage.py create_test_users --clear
```

## Supabase Integration

The system automatically syncs user data to Supabase:

- **On Registration:** User data is created in both Django and Supabase
- **On Profile Update:** Changes are synced to Supabase
- **Error Handling:** If Supabase sync fails, the operation continues (logged as warning)

### Supabase Table Structure

The `users` table in Supabase should have:
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    residence TEXT,
    is_lawyer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security Features

1. **Password Validation:** Uses Django's built-in password validators
2. **JWT Tokens:** Secure token-based authentication
3. **Token Blacklisting:** Refresh tokens are blacklisted on logout
4. **CORS Support:** Configured for frontend integration
5. **Input Validation:** Comprehensive input validation using serializers
6. **Error Logging:** Security events are logged for monitoring

## Configuration

### JWT Settings (in settings.py)
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    # ... other settings
}
```

### Environment Variables
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SECRET_KEY=your_django_secret_key
```

## Troubleshooting

### Common Issues

1. **Token Expired:** Use refresh token to get new access token
2. **Supabase Sync Failed:** Check environment variables and network connectivity
3. **CORS Errors:** Ensure CORS is properly configured for your frontend domain
4. **Password Validation:** Check Django's password validation settings

### Debug Mode

Enable debug logging in settings.py:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'users': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

This comprehensive authentication system provides secure, scalable user management with modern JWT-based authentication and Supabase integration.