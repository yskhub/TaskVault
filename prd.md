Project Name: Subscription-Based Business Tool (SaaS)

Description: A SaaS tool for business workflow and team management with subscription-based feature access (mock plans: Free & Pro).

Project Objectives:

Allow businesses to manage workflows and team tasks.

Control features based on subscription plans.

Provide analytics and usage tracking.

Secure authentication and data storage.

Eye-catching frontend with animations.

Tech Stack:

Frontend: Next.js (React-based)

Backend & DB: Supabase (PostgreSQL + Auth) + Python API layer

Version Control: GitHub

Deployment: Frontend on Vercel, Backend & DB on Supabase

Phase 1: Project Setup & GitHub Integration

Objective: Initialize project, configure version control, and basic structure.

Steps:

Initialize GitHub Repository:

git init
git remote add origin <your-repo-url>
git branch -M main
git commit --allow-empty -m "Initial commit"
git push -u origin main


Setup Frontend:

npx create-next-app@latest frontend
cd frontend
git add .
git commit -m "Setup Next.js frontend"


Setup Backend:

mkdir backend
cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn supabase
git add .
git commit -m "Setup Python backend with FastAPI"


Directory Structure:

project-root/
├── frontend/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── auth.py
│   │   ├── workflows.py
│   │   └── users.py
│   ├── requirements.txt
├── README.md
└── prd.md


Security Setup:

.env for API keys

.gitignore for secrets

HTTPS via Vercel & Supabase

Deliverables for Phase 1: GitHub repo, project scaffold, initial commit.

Phase 2: Authentication & Subscription Plans

Objective: Allow user signup, login, and plan-based feature access.

Steps:

Supabase Auth Integration:

from supabase import create_client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def sign_up(email, password):
    user = supabase.auth.sign_up({"email": email, "password": password})
    return user

def sign_in(email, password):
    user = supabase.auth.sign_in_with_password({"email": email, "password": password})
    return user


Subscription Plan Mock Implementation:

PLANS = {
    "free": {"workflow_limit": 6, "team_limit": 5},
    "pro": {"workflow_limit": 50, "team_limit": 10}
}

def get_plan_features(user_plan):
    return PLANS.get(user_plan, PLANS["free"])


Frontend Pages:

Signup/Login page

Plan selection page (mock)

Restrict features based on user_plan

Deliverables for Phase 2: User authentication, mock plans, plan-based feature flags.

Phase 3: Workflow Management

Objective: Users can create workflows, steps, assign tasks, and track status.

Backend Example (Python FastAPI):

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

workflows = []

class Step(BaseModel):
    title: str
    assigned_to: str
    status: str = "pending"

class Workflow(BaseModel):
    title: str
    steps: List[Step] = []

@app.post("/workflow")
def create_workflow(workflow: Workflow):
    workflows.append(workflow)
    return {"message": "Workflow created", "workflow": workflow}

@app.get("/workflow")
def list_workflows():
    return workflows


Frontend Features:

Create workflow

Add steps to workflow

Assign steps to team members

Track progress

Deliverables for Phase 3: Complete workflow CRUD system with step assignment.

Phase 4: User & Team Management

Objective: Add team members, roles, and control access based on subscription.

Backend Example:

users = []

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


Subscription Restriction: Free plan max 2 members, Pro max 10.

Phase 5: Dashboard & Analytics

Objective: Show overview of workflows, team usage, and analytics.

Frontend Features:

Active & completed workflows

Team usage charts

Optional: Graphs with Chart.js or D3.js

Animations for smooth UX

Backend Example: Aggregate workflow stats for dashboard.

Phase 6: Optional Features & Mock Plan Upgrades

Features:

Usage limits alerts

Mock plan upgrade/downgrade

Additional analytics (time per workflow, completion rate)

Phase 7: Deployment

Frontend:

Push to Vercel

Connect to GitHub repo

Ensure HTTPS

Backend & DB:

Supabase deployment

Store all tables: users, workflows, steps, subscriptions

Phase 8: Security & Best Practices

Environment variables for secrets

HTTPS

Role-based access control

Regular GitHub commits with meaningful messages

Validate all inputs in backend

Deliverables:

GitHub URL with commits

Deployed app URL

Do this order. Don’t improvise:

Supabase project + tables

Backend auth + RLS

Workflow APIs

Frontend auth flow

Dashboard

Polish animations
