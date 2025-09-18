from django.db import models
import uuid

class Lawyer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.TextField(null=False)
    email = models.TextField(unique=True, null=False)
    phone_number = models.TextField(null=False)
    license_number = models.TextField(unique=True, null=False)
    professional_information = models.TextField(null=True, blank=True)
    years_of_experience = models.IntegerField(null=True)
    primary_practice_area = models.TextField(null=True, blank=True)
    practice_location = models.TextField(null=True, blank=True)
    working_court = models.TextField(null=True, blank=True)
    specialization_document = models.TextField(null=True, blank=True)
    education_document = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.license_number}"