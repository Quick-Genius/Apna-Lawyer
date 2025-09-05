from django.db import models
from django.contrib.auth.models import User
from apps.documents.models import Document

class ChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255, blank=True)
    context = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s chat - {self.created_at}"

class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    role = models.CharField(max_length=20, choices=[
        ('user', 'User'),
        ('assistant', 'Assistant'),
        ('system', 'System'),
    ])
    timestamp = models.DateTimeField(auto_now_add=True)
    confidence = models.FloatField(null=True, blank=True)
    
    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.role} message in {self.session}"
