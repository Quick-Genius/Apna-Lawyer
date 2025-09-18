from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import requests

def chatbot(request):
    return render(request, 'chatbot.html')

class ChatbotAPI(APIView):
    def post(self, request):
        # Placeholder for Gemini/LLaMA integration
        # For now, we'll just echo the user's message
        user_message = request.data.get('message')
        bot_response = f"Echo: {user_message}"
        return Response({'response': bot_response})