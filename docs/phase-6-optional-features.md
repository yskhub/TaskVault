# Phase 6: Optional Features & Mock Plan Upgrades

## Goals
- Add optional, non-essential features that make TaskVault feel more like a SaaS product.
- Keep everything within free-tier constraints (no paid APIs or services).

## Features implemented

### 1. Mock plan upgrade & downgrade

Screen: `/account`

- "Mock upgrade to Pro" (existing from Phase 2) remains available for Free plan accounts.
- New: "Mock downgrade to Free" button for Pro accounts.
- Both actions:
  - Update the `subscription_plan` column in the Supabase `profiles` table for the current user.
  - Update local UI state so the plan pill and plan-based sections reflect the new plan immediately.

Files:
- `taskvault-frontend/app/account/page.tsx`

### 2. Usage limit alerts

Screen: `/team`

- The team page already enforces plan-based limits via the backend (Free: 2 members, Pro: 10 members).
- Phase 6 adds **visual alerts** as you approach or hit the limit:
  - If you have **exactly 1 slot left**:
    - Amber warning banner: you are near the plan limit and can add only one more member.
  - If you are **at the limit**:
    - Red banner: you are at the plan limit and must remove a member or upgrade to add more.
- This is purely a UX enhancement; the underlying limit enforcement still happens on the backend via Supabase/PostgREST.

Files:
- `taskvault-frontend/app/team/page.tsx`

### 3. Advanced analytics tweaks

Screen: `/dashboard`

- The analytics endpoint remains `GET /analytics/overview`.
- Phase 6 adds **frontend-only advanced metrics and interactivity**:
  - **Completion rate**:
    - Computed as `completed_steps / total_steps` (percentage of all workflow steps that are marked as `completed`).
    - Shown in a dedicated metric card.
  - **Refresh analytics**:
    - A small "Refresh analytics" button re-fetches `/analytics/overview` and re-renders the charts and metrics.
    - This keeps the dashboard feeling dynamic without requiring websockets or background jobs.

Files:
- `taskvault-frontend/app/dashboard/page.tsx`

## How this stays free-tier

- Plan changes are still **mock operations** that only toggle a column in the `profiles` table.
- Alerts are purely in the UI and based on counts already loaded from the backend.
- Advanced analytics use the existing `/analytics/overview` endpoint and client-side math.
- No new Supabase features or external paid services are introduced.
