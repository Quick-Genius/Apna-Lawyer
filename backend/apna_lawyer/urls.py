from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from chats import views as chat_views
import psutil
import os

def health_check(request):
    """Simple health check endpoint with memory info"""
    try:
        process = psutil.Process(os.getpid())
        memory_info = process.memory_info()
        return JsonResponse({
            'status': 'healthy',
            'memory_mb': round(memory_info.rss / 1024 / 1024, 2),
            'memory_percent': round(process.memory_percent(), 2)
        })
    except:
        return JsonResponse({'status': 'healthy', 'memory_info': 'unavailable'})

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Health check endpoint
    path('health/', health_check, name='health_check'),
    
    # API authentication endpoints
    path('api/', include('users.urls')),
    
    # Legacy user endpoints
    path('users/', include('users.urls')),
    
    # Other app endpoints
    path('chats/', include('chats.urls')),
    path('lawyers/', include('lawyers.urls')),
    
    # File processing endpoints
    path('api/ocr-image/', chat_views.ocr_image_api, name='ocr_image_api'),
    path('api/extract-doc/', chat_views.extract_document_api, name='extract_document_api'),
]