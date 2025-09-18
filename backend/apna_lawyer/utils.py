from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

def get_supabase_client():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    return create_client(supabase_url, supabase_key)

# Example usage in a view:
"""
def some_view(request):
    supabase = get_supabase_client()
    
    # Query data
    response = supabase.table('users').select("*").execute()
    
    # Insert data
    data = {"name": "John Doe", "email": "john@example.com"}
    response = supabase.table('users').insert(data).execute()
    
    return JsonResponse(response.data)
"""