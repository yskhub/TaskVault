# TaskVault Documentation

## Project Overview
TaskVault is a free-tier, secure-by-design SaaS app for business workflow and team management. Built with Next.js, FastAPI, and Supabase, it delivers a modern, minimal, institute-style UI and robust backend architecture.

## Tech Stack Summary
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Python + FastAPI
- **Database & Auth:** Supabase (PostgreSQL, Supabase Auth, RLS)
- **Deployment:** Vercel (frontend), Supabase (backend & database)
- **Version Control:** GitHub (public repo)

## Phase-by-Phase Development
1. **Phase 1: Project Foundation & Architecture**
   - Initialize repo, Next.js, FastAPI, Supabase, env vars
2. **Phase 2: Authentication & Subscription System (Mock)**
   - Supabase Auth, users table, plan middleware, protected routes
3. **Phase 3: User & Team Management**
   - Team members, roles, RLS, backend validation, team UI
4. **Phase 4: Workflow & Task Engine**
   - Workflows, steps, assignments, status tracking, real-time updates
5. **Phase 5: Dashboard & Analytics**
   - Workflow analytics, team usage, charts, optimized queries
6. **Phase 6: Advanced Features & Enhancements**
   - Usage limits, plan upgrades, file uploads, notifications
7. **Phase 7: Security & Performance Hardening**
   - RLS, rate limiting, validation, error handling, audit logging
8. **Phase 8: Deployment & Finalization**
   - Production deployment, environment separation, final testing, documentation

## Phase Dependency Flow
Each phase builds on the previous, ensuring a logical, secure, and maintainable development process.

## Deployment Instructions
- Frontend: Deploy to Vercel
- Backend & Database: Host via Supabase
- Configure environment variables as per documentation

## GitHub Rules
- Public repository
- Frequent, meaningful commits
- Documentation for every phase in `/docs`

---
See individual phase docs for details.