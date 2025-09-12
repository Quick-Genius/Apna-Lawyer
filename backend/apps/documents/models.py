from django.db import models
from django.contrib.auth.models import User
from .validators import validate_pdf_file, validate_file_size

class Document(models.Model):
    DOCUMENT_TYPES = [
        ('contract', 'Contract'),
        ('agreement', 'Agreement'),
        ('legal_notice', 'Legal Notice'),
        ('court_document', 'Court Document'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=255)
    file = models.FileField(
        upload_to='documents/',
        validators=[validate_pdf_file, validate_file_size],
        help_text='Upload PDF file only. Maximum file size: 20MB'
    )
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPES)
    description = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    analysis = models.JSONField(null=True, blank=True)
    is_processed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.title
