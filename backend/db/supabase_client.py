from supabase import create_client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get environment variables
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')

if not supabase_url or not supabase_key:
    raise Exception("Missing Supabase credentials. Make sure SUPABASE_URL and SUPABASE_KEY are set in .env file")

supabase = create_client(supabase_url, supabase_key)