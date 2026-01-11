from supabase import create_client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Simple test: list tables (will fail if credentials are not set)
try:
    response = supabase.table("test").select("*").execute()
    print("Supabase connection successful.")
except Exception as e:
    print(f"Supabase connection failed: {e}")
