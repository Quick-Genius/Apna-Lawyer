from django.db import migrations, models
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)),
                ('name', models.TextField(null=False)),
                ('email', models.TextField(unique=True, null=False)),
                ('password', models.TextField(null=False)),
                ('residence', models.TextField(null=True, blank=True)),
                ('is_lawyer', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]