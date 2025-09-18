from django.http import JsonResponse
from .models import User
from apna_lawyer.utils import get_supabase_client

def example_view(request):
    # Using Django ORM
    users = User.objects.all()
    
    # Using Supabase client
    supabase = get_supabase_client()
    supabase_users = supabase.table('users').select("*").execute()
    
    return JsonResponse({
        'django_users': list(users.values()),
        'supabase_users': supabase_users.data
    })