from rest_framework import serializers
from .models import Lawyer, Review, Language
from django.contrib.auth.models import User

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name']

class LawyerSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    languages = LanguageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Lawyer
        fields = ['id', 'user', 'user_name', 'specialization', 'experience_years', 
                 'languages', 'location', 'pricing_type', 'hourly_rate', 'rating', 
                 'total_reviews', 'bio', 'profile_image', 'is_verified']
        read_only_fields = ['user', 'rating', 'total_reviews']

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'lawyer', 'user', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']
