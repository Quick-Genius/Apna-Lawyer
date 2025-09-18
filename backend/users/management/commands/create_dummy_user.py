from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Creates a dummy user'

    def handle(self, *args, **options):
        if not User.objects.filter(email='dummy@example.com').exists():
            User.objects.create_user(
                email='dummy@example.com',
                password='dummy123',
                username='dummyuser',
                name='Dummy User'
            )
            self.stdout.write(self.style.SUCCESS('Successfully created dummy user'))
        else:
            self.stdout.write(self.style.WARNING('Dummy user already exists'))