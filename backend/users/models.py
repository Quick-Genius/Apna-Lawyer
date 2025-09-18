from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    lawyer_or_not = models.BooleanField(default=False)
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']