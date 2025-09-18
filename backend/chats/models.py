from django.db import models
import uuid

class UserChat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    user_text_input = models.TextField(null=True, blank=True)
    ai_text_output = models.TextField(null=True, blank=True)
    user_document_submission = models.TextField(null=True, blank=True)
    chatbot_document = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat {self.id} - User: {self.user.name}"

    class Meta:
        ordering = ['-created_at']