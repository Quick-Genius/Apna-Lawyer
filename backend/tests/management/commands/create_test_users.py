"""
Management command to create test users for authentication testing.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.supabase_service import supabase_user_service

User = get_user_model()


class Command(BaseCommand):
    help = 'Create test users for authentication testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing test users before creating new ones',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing test users...')
            User.objects.filter(email__contains='test').delete()
            self.stdout.write(self.style.SUCCESS('Test users cleared.'))

        # Test users data
        test_users = [
            {
                'name': 'Test User',
                'email': 'test@example.com',
                'password': 'testpassword123',
                'residence': 'Test City',
                'is_lawyer': False
            },
            {
                'name': 'Test Lawyer',
                'email': 'lawyer@example.com',
                'password': 'lawyerpassword123',
                'residence': 'Law City',
                'is_lawyer': True
            },
            {
                'name': 'John Doe',
                'email': 'john@example.com',
                'password': 'johnpassword123',
                'residence': 'New York',
                'is_lawyer': False
            },
            {
                'name': 'Jane Smith',
                'email': 'jane@example.com',
                'password': 'janepassword123',
                'residence': 'Los Angeles',
                'is_lawyer': True
            }
        ]

        self.stdout.write('Creating test users...')
        
        for user_data in test_users:
            try:
                # Check if user already exists
                if User.objects.filter(email=user_data['email']).exists():
                    self.stdout.write(
                        self.style.WARNING(f'User {user_data["email"]} already exists, skipping...')
                    )
                    continue

                # Create user
                user = User.objects.create_user(
                    username=user_data['email'],
                    email=user_data['email'],
                    name=user_data['name'],
                    password=user_data['password'],
                    residence=user_data['residence'],
                    is_lawyer=user_data['is_lawyer']
                )

                # Sync to Supabase
                try:
                    supabase_result = supabase_user_service.sync_user_to_supabase(user)
                    if supabase_result:
                        self.stdout.write(
                            self.style.SUCCESS(
                                f'Created user {user.email} and synced to Supabase'
                            )
                        )
                    else:
                        self.stdout.write(
                            self.style.WARNING(
                                f'Created user {user.email} but failed to sync to Supabase'
                            )
                        )
                except Exception as e:
                    self.stdout.write(
                        self.style.WARNING(
                            f'Created user {user.email} but Supabase sync failed: {str(e)}'
                        )
                    )

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Failed to create user {user_data["email"]}: {str(e)}')
                )

        self.stdout.write(self.style.SUCCESS('Test user creation completed!'))
        
        # Display login instructions
        self.stdout.write('\n' + '='*50)
        self.stdout.write('Test Users Created:')
        self.stdout.write('='*50)
        for user_data in test_users:
            user_type = 'Lawyer' if user_data['is_lawyer'] else 'User'
            self.stdout.write(f'{user_type}: {user_data["email"]} / {user_data["password"]}')
        
        self.stdout.write('\nYou can now test the authentication endpoints with these users.')
        self.stdout.write('Example API calls:')
        self.stdout.write('POST /api/login/ with email and password')
        self.stdout.write('GET /api/profile/ with Authorization: Bearer <token>')