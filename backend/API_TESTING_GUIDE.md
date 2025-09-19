# Apna Lawyer API - Testing Guide

## Overview
This guide covers how to set up and test all API endpoints for the Apna Lawyer application.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Setup
Create a `.env` file in the backend directory with:
```
SUPABASE_DB_PASSWORD=your_supabase_password
SUPABASE_DB_HOST=your_supabase_host
```

### 3. Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Optional
```

### 4. Start Development Server
```bash
python manage.py runserver
```

## API Endpoints

### User Endpoints (`/users/`)
- `POST /users/signup/` - User registration
- `POST /users/login/` - User authentication
- `POST /users/logout/` - User logout (requires auth)
- `GET /users/profile/` - Get user profile (requires auth)

### Chat Endpoints (`/chats/`)
- `POST /chats/api/` - Send message to AI chatbot (requires auth)
- `GET /chats/chat/history/` - Get user's chat history (requires auth)

### Lawyer Endpoints (`/lawyers/`)
- `GET /lawyers/api/lawyers/` - List all lawyers
- `POST /lawyers/api/lawyers/create/` - Create new lawyer
- `GET /lawyers/lawyers/` - LawyerViewSet list
- `POST /lawyers/lawyers/` - LawyerViewSet create
- `GET /lawyers/lawyers/{id}/` - LawyerViewSet retrieve
- `PUT /lawyers/lawyers/{id}/` - LawyerViewSet update
- `PATCH /lawyers/lawyers/{id}/` - LawyerViewSet partial update
- `DELETE /lawyers/lawyers/{id}/` - LawyerViewSet delete

## Testing Methods

### Method 1: Automated Unit Tests
Run comprehensive unit tests for all endpoints:
```bash
python test_runner.py
```

This will test:
- User registration, login, logout, profile
- Chat API and history
- Lawyer CRUD operations
- Error handling and edge cases

### Method 2: Manual HTTP Testing
Test endpoints with actual HTTP requests:
```bash
python test_endpoints.py
```

This script makes real HTTP requests to test endpoint availability.

### Method 3: Django Test Framework
Run individual app tests:
```bash
python manage.py test users.test_api
python manage.py test chats.test_api
python manage.py test lawyers.test_api
```

### Method 4: Using curl or Postman

#### User Registration
```bash
curl -X POST http://localhost:8000/users/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123",
    "residence": "Test City"
  }'
```

#### User Login
```bash
curl -X POST http://localhost:8000/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

#### Chat with AI
```bash
curl -X POST http://localhost:8000/chats/api/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "What is contract law?"
  }'
```

#### Create Lawyer
```bash
curl -X POST http://localhost:8000/lawyers/api/lawyers/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@lawfirm.com",
    "phone_number": "+1234567890",
    "license_number": "LAW123456",
    "years_of_experience": 10,
    "primary_practice_area": "Criminal Law"
  }'
```

## Test Coverage

### User API Tests
- ✅ Successful user registration
- ✅ Duplicate email handling
- ✅ Missing field validation
- ✅ Successful login
- ✅ Invalid credentials handling
- ✅ Profile access (authenticated)
- ✅ Profile access (unauthenticated)
- ✅ Logout functionality

### Chat API Tests
- ✅ Chatbot message processing
- ✅ Chat history retrieval
- ✅ Authentication requirements
- ✅ Empty message handling
- ✅ Database persistence

### Lawyer API Tests
- ✅ Lawyer list retrieval
- ✅ Lawyer creation
- ✅ Duplicate email/license handling
- ✅ CRUD operations via ViewSet
- ✅ Field validation
- ✅ Not found handling

## Expected Responses

### Successful User Registration
```json
{
  "message": "User created successfully",
  "user_id": "uuid-here",
  "name": "Test User",
  "email": "test@example.com"
}
```

### Successful Login
```json
{
  "message": "Login successful",
  "user_id": "uuid-here",
  "name": "Test User",
  "email": "test@example.com",
  "is_lawyer": false
}
```

### Chat Response
```json
{
  "response": "Legal Assistant: I understand you're asking about...",
  "chat_id": "uuid-here",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Lawyer List
```json
[
  {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@lawfirm.com",
    "phone_number": "+1234567890",
    "license_number": "LAW123456",
    "years_of_experience": 10,
    "primary_practice_area": "Criminal Law",
    "created_at": "2024-01-01T12:00:00Z"
  }
]
```

## Troubleshooting

### Common Issues

1. **Server not running**: Make sure `python manage.py runserver` is running
2. **Database errors**: Run migrations with `python manage.py migrate`
3. **Authentication errors**: Check if user is logged in for protected endpoints
4. **CORS errors**: Ensure `django-cors-headers` is installed and configured

### Debug Mode
Set `DEBUG = True` in settings.py for detailed error messages.

### Database Reset
If you need to reset the database:
```bash
rm db.sqlite3  # If using SQLite
python manage.py migrate
```

## Next Steps

After successful testing:
1. Deploy to production environment
2. Set up proper authentication (JWT tokens)
3. Integrate real AI service (Gemini/LLaMA)
4. Add file upload capabilities
5. Implement proper logging and monitoring

## Support

If you encounter issues:
1. Check the Django server logs
2. Verify all dependencies are installed
3. Ensure database is properly configured
4. Check API endpoint URLs match your URL patterns
## 
NEW ENDPOINTS (Added for File Processing)

### OCR Image API
**POST** `/api/ocr-image/`

Extract text from uploaded image files.

**Request:** Multipart form data
- `image`: Image file (PNG, JPG, etc.)

**Response:**
```json
{
    "extracted_text": "Text extracted from image",
    "success": true
}
```

**Testing with curl:**
```bash
curl -X POST http://localhost:8000/api/ocr-image/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/your/image.jpg"
```

### Extract Document API
**POST** `/api/extract-doc/`

Extract text from uploaded PDF/DOC files.

**Request:** Multipart form data
- `file`: Document file (PDF, DOC, DOCX)

**Response:**
```json
{
    "extracted_text": "Text extracted from document",
    "success": true
}
```

**Testing with curl:**
```bash
curl -X POST http://localhost:8000/api/extract-doc/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/your/document.pdf"
```

## Frontend Integration Updates

The frontend now includes:

1. **Attach Image Button**: Uploads images and extracts text using OCR
2. **Upload File Button**: Uploads PDF/DOC files and extracts text
3. **Text Preview**: Shows extracted text in chat before sending to AI

### Frontend API Calls:
```typescript
// OCR Image
const ocrResponse = await apiService.ocrImage(imageFile);

// Extract Document Text
const docResponse = await apiService.extractTextFromDocument(documentFile);
```

## New Dependencies

Added to requirements.txt:
- `PyPDF2==3.0.1` - For PDF text extraction
- `python-docx==0.8.11` - For DOC/DOCX text extraction

Install with:
```bash
pip install PyPDF2==3.0.1 python-docx==0.8.11
```

## File Upload Testing

### Test Image OCR:
1. Prepare a test image with text
2. Use the frontend "Attach Image" button or curl command
3. Verify extracted text appears in chat

### Test Document Extraction:
1. Prepare a test PDF or DOC file
2. Use the frontend "Upload File" button or curl command
3. Verify extracted text appears in chat input

## Error Handling

New error responses:
- `400`: Invalid file type
- `400`: No file provided
- `500`: PDF/DOC processing library not installed
- `500`: Text extraction failed

## Production Deployment Notes

1. Ensure PyPDF2 and python-docx are installed on production server
2. Configure file upload limits in web server (nginx/apache)
3. Set appropriate CORS headers for file uploads
4. Monitor file upload storage and cleanup