# Backend Deployment Configuration

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
