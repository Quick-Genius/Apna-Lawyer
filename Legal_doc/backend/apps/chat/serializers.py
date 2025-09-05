from rest_framework import serializers
from .models import ChatSession, ChatMessage
from apps.documents.serializers import DocumentSerializer

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'content', 'role', 'timestamp', 'confidence']
        read_only_fields = ['timestamp']

class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    document_details = DocumentSerializer(source='document', read_only=True)
    
    class Meta:
        model = ChatSession
        fields = ['id', 'user', 'document', 'document_details', 'created_at', 'title', 'context', 'messages']
        read_only_fields = ['created_at', 'user']

class SendMessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=5000)
    
    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError("Message cannot be empty")
        return value.strip()
