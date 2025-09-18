from django.db import models
from users.models import User

class UserChat(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_message = models.TextField()
    bot_response = models.TextField()
    document = models.FileField(upload_to='documents/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)