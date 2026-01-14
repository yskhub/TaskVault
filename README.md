TaskVault

Subscription-Aware Workflow & Team Management SaaS (Portfolio-Grade Project)

TaskVault is a realistic, production-style SaaS application designed to demonstrate how a modern subscription-aware business tool is built end-to-end.
It covers authentication, role-based access, workflow management, team collaboration, analytics dashboards, and admin audit concepts. All implemented with a strong focus on security, structure, and real-world engineering trade-offs.

This project is intentionally free-tier only, with mock plans and limits, to showcase SaaS architecture without relying on paid services.

🚀 Live Demo

Frontend (Vercel):
https://task-vault-coral.vercel.app/

Key routes to explore:

/auth – Authentication

/account – Account & plan info

/workflows – Workflow management

/team – Team members & roles

/dashboard – Analytics & KPIs

/admin/audit – Admin audit log (admin-only)

No local setup required to evaluate core functionality.

🧠 What This Project Demonstrates

Subscription-aware UI and logic (free tier, mocked plans)

Auth-protected routes and role-based access

Workflow creation, step tracking, and progress visualization

Team management with plan-aware limits

Dashboard analytics and drill-downs

Admin-only audit concepts

Secure frontend-backend separation

Production-style repo organization and commit history

This is not a toy CRUD app.
It is intentionally scoped to look and behave like an internal SaaS tool used by real teams.

🛠️ Tech Stack

Frontend

Next.js (App Router)

TypeScript

Tailwind CSS

Framer Motion (micro-animations)

Deployed on Vercel

Backend

FastAPI

Python

REST APIs

Structured routing and validation

Auth & Data

Supabase Auth

Supabase Postgres

Row Level Security (RLS) guidance

Dev & Deployment

Environment-based config

Secure secret handling

CORS configuration

Git tags by implementation phase

📦 Repository Structure & Phases

This repository is organized and versioned by implementation phases that match the product and technical PRD.

Phase Overview

Phase 1
Project foundation, FastAPI backend, Next.js frontend, Supabase health wiring.

Phase 2
Supabase Auth, profiles table with subscription_plan, /auth and /account flows.

Phase 3
In-memory workflow management APIs and /workflows UI.

Phase 4
User & team management, Supabase-backed team_members table, /team UI.

Phase 5
Dashboard & analytics via /analytics/overview and /dashboard (charts).

Phase 6
Optional features. Mock plan upgrades/downgrades, usage limit alerts, enhanced analytics.

Phase 7
Deployment guidance for Vercel (frontend) and hosted FastAPI backend.

Phase 8
Security & best practices. Environment hygiene, CORS configuration, RLS guidance.

Each phase includes:

A design/spec document under Development_Phases/

Detailed implementation docs under docs/

Hands-on walkthroughs under walkthrough/

🏷️ Git History & Tags

The main branch contains a linear, clean commit history with tagged milestones.

Available tags:

phase-1 – Project foundation and scaffolding

phase-2 – Supabase Auth and profiles

phase-3 – Workflow management

phase-4 – Team management (in-memory)

phase-4-supabase – Supabase persistence for teams

phase-5 – Dashboard analytics

phase-6 – Optional features & mock plans

phase-7 – Deployment and backend config

You can inspect any phase using:

git checkout phase-3


Exact Git commands are documented in:

git-operations/phase-commits.md

🔐 Security & Best Practices

No secrets committed to the repository

Environment-based configuration for frontend and backend

Supabase Auth with protected routes

Role-aware UI locking

Backend-ready design for permission enforcement

RLS guidance for multi-tenant data protection

CORS configured explicitly for frontend origin

Audit-friendly architecture (admin audit view)

Security is treated as a first-class concern, not an afterthought.

🧪 How to Run Locally
Backend (FastAPI)
cd backend
../.venv/Scripts/python.exe -m uvicorn main:app --reload


Available endpoints:

Health: http://127.0.0.1:8000/health

API Docs: http://127.0.0.1:8000/docs

Frontend (Next.js)
cd taskvault-frontend
npm install
npm run dev


Frontend URL:

http://localhost:3000


Ensure .env.local contains:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

NEXT_PUBLIC_API_BASE_URL

🧭 Demo Walkthrough

Authentication

Visit /auth

Sign up or sign in using email and password

Account & Plan

Go to /account

View current plan, mock upgrade/downgrade options, session info

Workflows

Navigate to /workflows

Create workflows with multiple steps

Track progress via status pills and progress bars

Dashboard

Open /dashboard

Review KPIs and charts

Click KPIs to drill into related metrics

Team Management

Visit /team

Add team members with role assignment

Enforced plan-aware limits

Admin Audit

Access /admin/audit as admin

Review audit-style activity logs

🧩 Example Workflows
New Employee Onboarding

Offer letter & paperwork (HR)

IT account & laptop setup (IT)

Manager welcome & intro (Manager)

Benefits orientation (HR)

Customer Onboarding

Kickoff call scheduled (CSM)

Workspace configured (Implementation)

Training delivered (CSM)

First value milestone (Customer)

Invoice & Payment Collection

Invoice drafted (Finance)

Invoice sent (Account Manager)

Payment recorded (Finance)

🎯 Design Philosophy

Built like an internal SaaS tool, not a marketing demo

Free-tier only to avoid artificial paywalls

Mock plans to demonstrate subscription logic

Clean UI over flashy gimmicks

Clear separation of concerns

Extensible by design without premature over-engineering

✅ Project Status

Status: Feature-complete and portfolio-ready

This project is intentionally scoped, deployed, documented, and ready for:

Technical evaluation

Code review

System design discussion

Frontend, backend, or full-stack interviews
