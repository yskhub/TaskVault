# Phase 6 Walkthrough – Optional Features & Mock Plan Upgrades

This walkthrough shows how to use the new optional features added in Phase 6.

## 1. Start backend and frontend

Same as previous phases:

1. Backend (FastAPI):
   - From the repo root:
     - `python -m uvicorn backend.main:app --reload`

2. Frontend (Next.js):
   - In another terminal:
     - `cd taskvault-frontend`
     - `npm run dev`

## 2. Try mock plan upgrade and downgrade

1. Go to `/auth` and sign in.
2. Visit `/account`:
   - If you are on the **Free** plan:
     - Use **"Mock upgrade to Pro"** to switch your plan.
   - Once on **Pro**:
     - Use **"Mock downgrade to Free"** to switch back.
3. Notice how:
   - The plan pill (Free/Pro) updates immediately.
   - Plan descriptions stay in sync with your current plan.

## 3. Observe usage limit alerts on the team page

1. Go to `/team` while signed in.
2. Add team members until you approach your plan limit:
   - Free plan: 2 members.
   - Pro plan: 10 members.
3. As you get close to the limit:
   - With **1 slot left**, you’ll see an amber warning banner.
   - When you **hit the limit**, you’ll see a red banner telling you you’re at the cap.
4. The backend still strictly enforces limits, but these alerts give you a heads-up before errors occur.

## 4. Use the enhanced analytics dashboard

1. Seed some workflows and team data if you haven’t already (see Phase 5 walkthrough).
2. Visit `/dashboard`:
   - You’ll see the existing workflow and team metrics and charts.
   - New in Phase 6:
     - A **Completion rate** card, showing what percentage of all steps are completed.
     - A **"Refresh analytics"** button that re-fetches data from `/analytics/overview`.
3. Change data elsewhere (e.g., add workflows, update step statuses via the backend, adjust team members), then use **Refresh analytics** to see updated charts and metrics.

## Summary

Phase 6 adds polish and optional SaaS-like behavior:
- Mock upgrade/downgrade between Free and Pro.
- Visual alerts when you approach or hit team usage limits.
- A more dynamic analytics dashboard with a completion rate metric and manual refresh.

All of this remains free-tier and builds directly on Phases 2, 4, and 5.
