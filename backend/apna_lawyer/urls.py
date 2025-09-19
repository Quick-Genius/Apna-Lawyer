from django.contrib import admin
from django.urls import path, include
from chats import views as chat_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('chats/', include('chats.urls')),
    path('lawyers/', include('lawyers.urls')),
    # New API endpoints for file processing
    path('api/ocr-image/', chat_views.ocr_image_api, name='ocr_image_api'),
    path('api/extract-doc/', chat_views.extract_document_api, name='extract_document_api'),
]