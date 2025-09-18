from django.urls import path
from . import views

urlpatterns = [
    path('', views.chatbot, name='chatbot'),
    path('chat/history/', views.chat_history, name='chat_history'),
    path('api/', views.ChatbotAPI.as_view(), name='chatbot_api'),
]