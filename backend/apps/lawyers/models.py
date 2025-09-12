from django.db import models
from django.contrib.auth.models import User

class Language(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Lawyer(models.Model):
    PRICING_TYPES = [
        ('free_consultation', 'Free Consultation'),
        ('paid', 'Paid'),
        ('hourly', 'Hourly Rate'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=100)
    experience_years = models.IntegerField()
    languages = models.ManyToManyField(Language)
    location = models.CharField(max_length=100)
    pricing_type = models.CharField(max_length=50, choices=PRICING_TYPES)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    rating = models.FloatField(default=0.0)
    total_reviews = models.IntegerField(default=0)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='lawyers/', null=True, blank=True)
    is_verified = models.BooleanField(default=False)

    class Meta:
        ordering = ['-rating', '-experience_years']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.specialization}"

class Review(models.Model):
    lawyer = models.ForeignKey(Lawyer, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['lawyer', 'user']  # One review per user per lawyer

    def __str__(self):
        return f"Review for {self.lawyer} by {self.user}"
