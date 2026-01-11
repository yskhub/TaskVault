# Phase 5: Dashboard & Analytics

## Goal
Expose a simple analytics view for TaskVault that summarizes workflow activity and team usage, without leaving the free tier.

## Backend: `/analytics/overview`

The FastAPI backend now exposes a single read-only analytics endpoint:

- `GET /analytics/overview`
  - Response shape:
    - `workflows` (derived from in-memory Phase 3 workflows)
      - `total`
      - `with_steps`
      - `without_steps`
      - `total_steps`
      - `pending_steps`
      - `in_progress_steps`
      - `completed_steps`
    - `team` (derived from the Supabase-backed `team_members` table)
      - `total_members`
      - `admins`
      - `members`

Notes:
- Workflow stats reflect whatever is currently in memory on the API instance.
- Team stats are fetched via Supabase PostgREST and remain within the free tier.

## Frontend: `/dashboard` page

The Next.js app now includes a new `app/dashboard/page.tsx` route:

- Calls `GET /analytics/overview` using the same `NEXT_PUBLIC_API_BASE_URL` convention as other pages.
- Shows three top-level metric cards:
  - Total workflows, with/without steps.
  - Total workflow steps, broken down by status.
  - Team size, broken down by admins vs members.
- Renders two small charts using Chart.js via `react-chartjs-2`:
  - Doughnut chart for workflow step status distribution.
  - Bar chart for team composition (admins vs members).
- Keeps the existing dark, card-based visual style from earlier phases and adds subtle animated transitions via chart rendering.

## Dependencies

New frontend dependencies (installed inside the `taskvault-frontend` app):

- `chart.js`
- `react-chartjs-2`

Both libraries are open source and free to use.

## How this stays free-tier

- No new Supabase features beyond PostgREST and the existing `team_members` table are used.
- Workflow stats are computed in-memory on the backend.
- Charts are entirely client-side and rely on free, open-source libraries.
