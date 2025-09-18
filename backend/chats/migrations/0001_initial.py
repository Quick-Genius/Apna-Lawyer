from django.db import migrations, models
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserChat',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)),
                ('user_text_input', models.TextField(null=True, blank=True)),
                ('ai_text_output', models.TextField(null=True, blank=True)),
                ('user_document_submission', models.TextField(null=True, blank=True)),
                ('chatbot_document', models.TextField(null=True, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey('users.User', on_delete=models.CASCADE)),
            ],
        ),
    ]