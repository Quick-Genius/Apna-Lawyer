from django.core.management.base import BaseCommand
from users.models import User
from lawyers.models import Lawyer
from chats.models import UserChat
import uuid

class Command(BaseCommand):
    help = 'Creates dummy data for testing'

    def handle(self, *args, **kwargs):
        # Create dummy users
        users_data = [
            {
                'name': 'John Doe',
                'email': 'john@example.com',
                'password': 'test123',
                'residence': 'New Delhi',
                'is_lawyer': False
            },
            {
                'name': 'Jane Smith',
                'email': 'jane@example.com',
                'password': 'test123',
                'residence': 'Mumbai',
                'is_lawyer': False
            }
        ]

        created_users = []
        for user_data in users_data:
            user = User.objects.create_user(
                username=user_data['email'],
                email=user_data['email'],
                password=user_data['password'],
                name=user_data['name'],
                residence=user_data['residence'],
                is_lawyer=user_data['is_lawyer']
            )
            created_users.append(user)
            self.stdout.write(f'Created user: {user.email}')

        # Create dummy lawyers
        lawyers_data = [
            {
                'name': 'Adv. Rajesh Kumar',
                'email': 'rajesh@example.com',
                'phone_number': '+91 9876543210',
                'license_number': 'BAR123456',
                'professional_information': 'Experienced in criminal law',
                'years_of_experience': 10,
                'primary_practice_area': 'Criminal Law',
                'practice_location': 'Delhi High Court',
                'working_court': 'High Court',
                'specialization_document': 'criminal_law_cert.pdf',
                'education_document': 'llb_degree.pdf'
            },
            {
                'name': 'Adv. Priya Singh',
                'email': 'priya@example.com',
                'phone_number': '+91 9876543211',
                'license_number': 'BAR123457',
                'professional_information': 'Expert in corporate law',
                'years_of_experience': 8,
                'primary_practice_area': 'Corporate Law',
                'practice_location': 'Mumbai High Court',
                'working_court': 'High Court',
                'specialization_document': 'corporate_law_cert.pdf',
                'education_document': 'llm_degree.pdf'
            }
        ]

        for lawyer_data in lawyers_data:
            lawyer = Lawyer.objects.create(**lawyer_data)
            self.stdout.write(f'Created lawyer: {lawyer.email}')

        # Create dummy chats
        chats_data = [
            {
                'user': created_users[0],
                'user_text_input': 'I need help with a property dispute.',
                'ai_text_output': 'I understand you're dealing with a property dispute. Could you please provide more details about the situation?',
                'user_document_submission': 'property_papers.pdf',
                'chatbot_document': 'property_law_guide.pdf'
            },
            {
                'user': created_users[1],
                'user_text_input': 'What are my rights as a tenant?',
                'ai_text_output': 'As a tenant, you have several rights under the law. Let me explain the key points...',
                'user_document_submission': 'rental_agreement.pdf',
                'chatbot_document': 'tenant_rights_guide.pdf'
            }
        ]

        for chat_data in chats_data:
            chat = UserChat.objects.create(**chat_data)
            self.stdout.write(f'Created chat for user: {chat.user.email}')