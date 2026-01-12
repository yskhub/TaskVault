# TaskVault
SUBSCRIPTION-BASED BUSINESS TOOL (SAAS PRODUCT)

## Repository Structure & Phases

This repo is organized and versioned by implementation phases that match the product/technical PRD.

- **Phase 1** – Project foundation, FastAPI backend, Next.js frontend, Supabase health wiring.
- **Phase 2** – Supabase Auth, `profiles` table with `subscription_plan`, `/auth` and `/account` flows.
- **Phase 3** – In-memory workflow management APIs and `/workflows` UI.
- **Phase 4** – User & team management, Supabase-backed `team_members` table, `/team` UI.
- **Phase 5** – Dashboard & analytics via `/analytics/overview` and `/dashboard` (charts).
 - **Phase 6** – Optional features: mock plan upgrades/downgrades, usage limit alerts, and enhanced analytics.
 - **Phase 7** – Deployment guidance for Vercel (frontend) and a hosted FastAPI backend.
 - **Phase 8** – Security and best practices: env/secret hygiene, CORS configuration, and RLS guidance.

Each phase has:
- A design/spec document under `Development_Phases/`.
- A detailed implementation doc under `docs/`.
- A hands-on walkthrough under `walkthrough/`.

## Git History & Tags

The `main` branch contains a linear set of phase commits plus the initial GitHub scaffold. For quick navigation:

- Tag **phase-1** → Commit "Phase 1: project foundation, frontend+backend scaffolding, Supabase health"
- Tag **phase-2** → Commit "Phase 2: Supabase Auth, profiles table, mock subscription flows"
- Tag **phase-3** → Commit "Phase 3: in-memory workflow management backend+frontend"
- Tag **phase-4** → Commit "Phase 4: user & team management (in-memory)"
- Tag **phase-4-supabase** → Commit "Phase 4: Supabase team persistence"
 - Tag **phase-5** → Commit "Phase 5: dashboard analytics backend+frontend"
 - Tag **phase-6** → Commit "Phase 6: optional features and mock plan upgrades"
 - Tag **phase-7** → Commit "Phase 7: deployment docs and backend CORS config"

You can check out any phase with:

```bash
git checkout phase-1   # or phase-2, phase-3, phase-4, phase-4-supabase, phase-5, phase-6, phase-7
```

The actual Git commands used to create these commits and tags are documented in git-operations/phase-commits.md.

## How to Run Locally

### Backend (FastAPI)

- From the project root:

	```bash
	cd backend
	../.venv/Scripts/python.exe -m uvicorn main:app --reload
	```

- The API will be available at:
	- Health: http://127.0.0.1:8000/health
	- API docs: http://127.0.0.1:8000/docs

### Frontend (Next.js)

- From the project root:

	```bash
	cd taskvault-frontend
	npm install
	npm run dev
	```

- The app will be available at:
	- http://localhost:3000

Make sure your Supabase and backend URLs in `taskvault-frontend/.env.local` match your environment.

## Deployed URLs

This repository is also deployed for easier testing (no local setup required):

- **Frontend (Vercel)** – TaskVault Next.js app
	- URL: _add your Vercel deployment URL here_

- **Backend (Render / other host)** – FastAPI backend
	- URL: _add your backend deployment URL here_

The frontend expects the backend base URL to be configured via environment variables (for example `NEXT_PUBLIC_API_BASE_URL`). Ensure this matches the deployed backend URL.

## How to Use (Demo Walkthrough)

Assuming your frontend is deployed (or running locally on http://localhost:3000):

1. **Sign up / sign in**
	- Go to `/auth`.
	- Create an account with email + password, then sign in.

2. **Account & subscription**
	- Navigate to `/account`.
	- See current plan, mock upgrade/downgrade actions, last sign-in time, and active session info.

3. **Workflows & progress**
	- Go to `/workflows`.
	- Create a workflow with a few steps (title + assignee).
	- For each step, use the status pills (Pending / In progress / Done) and watch the per-workflow progress bar update.

4. **Dashboard & analytics**
	- Visit `/dashboard`.
	- Review KPIs and charts for workflows, steps, and team.
	- Click a KPI card to drill down and highlight the related chart and details.

5. **Team management**
	- Open `/team`.
	- Add team members (email + role) within plan limits; existing members are loaded from Supabase.

This flow demonstrates authentication, subscription-aware limits, workflow tracking, analytics, and team management end-to-end.

## Example Workflows You Can Create

1. **New Employee Onboarding**

	Steps:
	- "Offer letter & paperwork" – assigned to HR
	- "IT account & laptop setup" – assigned to IT
	- "Manager welcome & intro" – assigned to Hiring Manager
	- "Benefits orientation" – assigned to HR

2. **Customer Onboarding**

	Steps:
	- "Kickoff call scheduled" – assigned to CSM
	- "Workspace/project configured" – assigned to Implementation
	- "Training session delivered" – assigned to CSM
	- "First value milestone achieved" – assigned to Customer

3. **Invoice & Payment Collection**

	Steps:
	- "Invoice drafted" – assigned to Finance
	- "Invoice sent to client" – assigned to Account Manager
	- "Payment received & recorded" – assigned to Finance
