# Copilot Context

This file is intended to provide context and guidance for GitHub Copilot and other AI coding assistants working in this repository. Add any relevant project details, coding standards, or instructions here to help AI tools generate better code and suggestions.

## Project Overview

(Describe your project, its purpose, and any important details here.)

## Folder Structure
- `frontend/`: Frontend application code
- `backend/`: Backend application code
- `.git/`: Git version control directory

## Coding Guidelines
(Add any coding standards, preferred libraries, or architectural patterns here.)

## Special Instructions
You are an expert full-stack engineer.

Project:
A subscription-based SaaS web app for business workflow and team management.

Tech stack (mandatory):
- Frontend: Next.js
- Backend API: Python (FastAPI)
- Auth + Database: Supabase (PostgreSQL, RLS enabled)
- No local database. Supabase ONLY.
- No real payments. Subscription plans are mock (Free, Pro).
- GitHub with frequent, meaningful commits.
- Deployment: Vercel (frontend), Supabase (backend + DB).

Core features:
- User authentication via Supabase Auth
- Subscription-based feature access
- Workflow creation with steps
- Team members with roles
- Dashboard analytics
- Secure, scalable, production-ready code

Rules:
- Always use Supabase client directly
- Use environment variables
- Follow security best practices
- Write clean, readable, maintainable code

