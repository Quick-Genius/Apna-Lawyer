from django.contrib import admin
from django.urls import path, include
from chats import views as chat_views

urlpatterns = [
    path('admin/', admin.site.urls),
    
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