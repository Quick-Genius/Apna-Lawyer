from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import UserChat
import requests

def chatbot(request):
    return render(request, 'chatbot.html')

class ChatbotAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user_message = request.data.get('message')
            if not user_message:
                return Response({'error': 'Message is required'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Placeholder for Gemini/LLaMA integration
            # For now, we'll just echo the user's message
            bot_response = f"Legal Assistant: I understand you're asking about '{user_message}'. This is a placeholder response. In production, this would connect to an AI legal assistant."
            
            # Save chat to database
            chat = UserChat.objects.create(
                user=request.user,
                user_text_input=user_message,
                ai_text_output=bot_response
            )
            
            return Response({
                'response': bot_response,
                'chat_id': str(chat.id),
                'timestamp': chat.created_at
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_history(request):
    try:
        chats = UserChat.objects.filter(user=request.user).order_by('-created_at')
        chat_data = []
        
        for chat in chats:
            chat_data.append({
                'id': str(chat.id),
                'user_message': chat.user_text_input,
                'ai_response': chat.ai_text_output,
                'timestamp': chat.created_at
            })
        
        return Response({
            'chats': chat_data,
            'total_count': len(chat_data)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)