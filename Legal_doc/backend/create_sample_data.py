import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from apps.lawyers.models import Lawyer, Language, Review

def create_sample_data():
    # Create languages
    languages = ['English', 'Spanish', 'French', 'Hindi', 'Mandarin']
    for lang_name in languages:
        Language.objects.get_or_create(name=lang_name)

    # Create sample lawyers
    lawyer_data = [
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'specialization': 'Contract Law',
            'experience_years': 10,
            'location': 'New York',
            'pricing_type': 'hourly',
            'hourly_rate': 250.00,
            'bio': 'Experienced contract lawyer with expertise in business agreements.',
            'rating': 4.8
        },
        {
            'username': 'jane_smith',
            'email': 'jane@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'specialization': 'Corporate Law',
            'experience_years': 15,
            'location': 'California',
            'pricing_type': 'free_consultation',
            'bio': 'Corporate law specialist with 15 years of experience.',
            'rating': 4.9
        }
    ]

    for lawyer_info in lawyer_data:
        user, created = User.objects.get_or_create(
            username=lawyer_info['username'],
            defaults={
                'email': lawyer_info['email'],
                'first_name': lawyer_info['first_name'],
                'last_name': lawyer_info['last_name']
            }
        )
        
        if created:
            user.set_password('password123')
            user.save()

        lawyer, created = Lawyer.objects.get_or_create(
            user=user,
            defaults={
                'specialization': lawyer_info['specialization'],
                'experience_years': lawyer_info['experience_years'],
                'location': lawyer_info['location'],
                'pricing_type': lawyer_info['pricing_type'],
                'hourly_rate': lawyer_info.get('hourly_rate'),
                'bio': lawyer_info['bio'],
                'rating': lawyer_info['rating'],
                'is_verified': True
            }
        )

    print('Sample data created successfully!')

if __name__ == '__main__':
    create_sample_data()
