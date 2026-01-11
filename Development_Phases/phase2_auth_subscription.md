# Phase 2: Authentication & Subscription Plans

## Objective
Enable user signup/login and mock subscription-based access.

## Backend (Python + Supabase)
```python
from supabase import create_client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def sign_up(email, password):
    return supabase.auth.sign_up({"email": email, "password": password})

def sign_in(email, password):
    return supabase.auth.sign_in_with_password({"email": email, "password": password})

# Mock subscription plans
PLANS = {
    "free": {"workflow_limit": 5, "team_limit": 2},
    "pro": {"workflow_limit": 50, "team_limit": 10}
}

def get_plan_features(user_plan):
    return PLANS.get(user_plan, PLANS["free"])
```

## Frontend
- Signup/Login page
- Plan selection page
- Restrict features based on `user_plan`

### Deliverables
- User authentication setup
- Mock subscription plans
- Plan-based feature access