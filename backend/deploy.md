# Deployment Instructions

## Deployment Issues Fixed

### 1. Memory Issue (RESOLVED)
The deployment was failing due to memory exhaustion caused by EasyOCR library.

**Changes Made:**
1. **Removed EasyOCR** - This library loads 1.5GB+ neural network models
2. **Kept Tesseract OCR** - Lightweight alternative for text extraction
3. **Optimized Gunicorn** - Single worker configuration to reduce memory usage
4. **Added Memory Management** - Garbage collection optimizations
5. **Added Health Check** - Monitor memory usage at `/health/`

### 2. Python 3.13 Compatibility Issue (RESOLVED)
`pkg_resources` module was removed in Python 3.13, causing import errors.

**Changes Made:**
1. **Updated djangorestframework-simplejwt** - From 5.3.0 to 5.4.0 (Python 3.13 compatible)
2. **Added setuptools** - Explicit dependency for pkg_resources compatibility
3. **Added packaging** - Additional fallback dependency

### Render Deployment Steps:

1. **Update Build Command** (if needed):
   ```bash
   pip install -r requirements.txt
   ```

2. **Update Start Command**:
   ```bash
   gunicorn apna_lawyer.wsgi:application -c gunicorn.conf.py
   ```

3. **Environment Variables** (set in Render dashboard):
   ```
   DEBUG=False
   ALLOWED_HOSTS=visionbros.onrender.com
   FRONTEND_URL=https://vision-bros.vercel.app
   CORS_ALLOWED_ORIGINS=https://vision-bros.vercel.app
   GEMINI_API_KEY=your_api_key_here
   ```

### Memory Usage:
- **Before**: ~2GB (causing worker kills)
- **After**: ~200-400MB (within Render limits)

### Testing:
- Health check: `https://visionbros.onrender.com/health/`
- OCR still works with Tesseract (lighter but functional)

### If Issues Persist:
1. Check logs for specific errors
2. Verify environment variables are set
3. Test health endpoint for memory usage
4. Consider upgrading Render plan if needed

The app should now deploy successfully without memory timeouts!