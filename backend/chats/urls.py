from django.urls import path
from . import views

urlpatterns = [
    path('', views.chatbot, name='chatbot'),
    path('chat/history/', views.chat_history, name='chat_history'),
    path('api/', views.ChatbotAPI.as_view(), name='chatbot_api'),
    path('extract-text/', views.extract_text_from_image, name='extract_text'),
    path('test-ai/', views.test_ai_service, name='test_ai'),
    path('test-ocr/', views.test_ocr_service, name='test_ocr'),
]