# Phase 5 Walkthrough – Dashboard & Analytics

This walkthrough shows how to use the new analytics dashboard for TaskVault.

## 1. Start backend and frontend

From the project root:

1. Backend (FastAPI):
   - Ensure your Supabase `.env` is configured in `backend/.env`.
   - Start the API from the repo root so `backend` is a package:
     - `python -m uvicorn backend.main:app --reload`

2. Frontend (Next.js):
   - Ensure `NEXT_PUBLIC_API_BASE_URL` in `taskvault-frontend/.env.local` points to your backend (for example, `http://localhost:8000`).
   - In a second terminal:
     - `cd taskvault-frontend`
     - `npm run dev`

## 2. Seed some data

To see meaningful analytics:

1. Sign in via `/auth` and ensure you have a profile set up in `/account`.
2. Create a few workflows on `/workflows`:
   - Use multiple steps with different assignees.
3. Add a few team members on `/team`:
   - Mix roles (some `admin`, some `member`).
   - Hit the free/pro plan limits if you want to test boundaries.

## 3. Open the dashboard

1. In the browser, navigate to `/dashboard`.
2. You should see:
   - Metric cards summarizing:
     - Total workflows and how many have steps.
     - Total steps across all workflows, broken down by status.
     - Total team members, broken down by admins vs members.
   - A doughnut chart for workflow step status.
   - A bar chart for team composition.

If there is no data yet, the page shows a friendly message telling you to create workflows and team members first.

## 4. How it works (at a glance)

- The dashboard page calls `GET /analytics/overview` on the FastAPI backend.
- The backend:
  - Computes workflow stats from the in-memory workflows list used in Phase 3.
  - Computes team stats by reading from Supabase's `team_members` table using PostgREST.
- The frontend turns this payload into metric cards and Chart.js visualizations.

This completes Phase 5: a lightweight, free-tier-friendly analytics dashboard for TaskVault.
