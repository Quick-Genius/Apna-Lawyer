# Backend Deployment Configuration

## Memory Optimization Updates

**IMPORTANT**: The app has been optimized to fix memory issues on Render:

1. **Removed EasyOCR**: Replaced with lightweight Tesseract OCR to reduce memory usage by ~1.5GB
2. **Optimized Gunicorn**: Single worker configuration to minimize memory footprint
3. **Memory Management**: Added garbage collection optimizations

## Environment Variables Setup

Your backend now uses environment variables for proper CORS configuration and deployment flexibility.

### Required Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```bash
# Development Configuration
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Production Configuration (for deployment)
FRONTEND_URL=https://vision-bros.vercel.app
CORS_ALLOWED_ORIGINS=https://vision-bros.vercel.app
DEBUG=False
ALLOWED_HOSTS=visionbros.onrender.com
```

## Render Deployment Command

Update your Render service to use the optimized gunicorn configuration:

```bash
gunicorn apna_lawyer.wsgi:application -c gunicorn.conf.py
```

### Your Deployment URLs
- **Frontend**: https://vision-bros.vercel.app (Vercel)
- **Backend**: https://visionbros.onrender.com (Render)

### CORS Configuration

The backend now properly handles CORS requests from your frontend:

- **Development**: Accepts requests from `localhost:5173` (Vite default port)
- **Production**: Uses environment variables for secure origin control
- **Security**: Removed `CORS_ALLOW_ALL_ORIGINS = True` for better security

### Key Changes Made

1. **CORS_ALLOWED_ORIGINS**: Now uses environment variable instead of allowing all origins
2. **FRONTEND_URL**: New variable for frontend URL configuration
3. **CSRF_TRUSTED_ORIGINS**: Dynamically configured based on environment variables

### Deployment Steps

1. Set environment variables in your deployment platform
2. Update `FRONTEND_URL` to your deployed frontend URL
3. Update `CORS_ALLOWED_ORIGINS` to match your frontend domain
4. Set `DEBUG=False` for production
5. Configure `ALLOWED_HOSTS` with your backend domain

### Local Development

For local development, the defaults will work with Vite's default port (5173). If your frontend runs on a different port, update the `.env` file accordingly.
