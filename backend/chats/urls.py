from django.urls import path
from . import views

urlpatterns = [
    path('', views.chatbot, name='chatbot'),
    path('chat/history/', views.chat_history, name='chat_history'),
    path('api/', views.ChatbotAPI.as_view(), name='chatbot_api'),
    path('extract-text/', views.extract_text_from_image, name='extract_text'),
    # New image chat endpoints
    path('upload-image/', views.upload_chat_image, name='upload_chat_image'),
    path('chat-with-images/', views.process_chat_with_images, name='chat_with_images'),
]


