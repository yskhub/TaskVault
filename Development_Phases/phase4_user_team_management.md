# Phase 4: User & Team Management

## Objective
Add team members, assign roles, and restrict access based on subscription plan.

## Backend
```python
users = []

from pydantic import BaseModel
class TeamMember(BaseModel):
    email: str
    role: str  # admin/member

@app.post("/team/add")
def add_member(member: TeamMember):
    users.append(member)
    return {"message": "Member added", "member": member}

@app.get("/team")
def list_team():
    return users
```

## Subscription Restrictions
- Free plan: max 2 members
- Pro plan: max 10 members

### Deliverables
- Team CRUD
- Role-based access
- Subscription limits enforced