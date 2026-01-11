# Test 3 – Dashboard & Analytics with Supabase

Goal: confirm `/dashboard` correctly combines in-memory workflows with Supabase-backed team stats.

## Prerequisites

- Tests 1 and 2 completed successfully.
- Backend and frontend running.

## Steps

1. Create workflows
   - Go to `/workflows`.
   - Create at least 2 workflows:
     - One with 3+ steps, with a mix of `pending`, `in_progress`, and `completed`.
     - One with no steps (to exercise the `without_steps` metric).

2. Ensure team data
   - From `/team`, ensure you have at least:
     - 1 admin
     - 2+ members
   - Confirm these exist in Supabase `team_members`.

3. Open dashboard
   - Go to `/dashboard`.
   - You should see:
     - Total workflows and counts with/without steps.
     - Step counts by status.
     - Team member totals, admins vs members.
     - Completion rate %.
   - Click **Refresh analytics** to confirm `/analytics/overview` responds reliably.

4. Cross-check with Supabase
   - Compare:
     - Team counts on the dashboard with the number of rows in `team_members`.
   - They should match what you see in Supabase.

If numbers align, the analytics endpoint and dashboard UI are working with real Supabase data.
