# Test 2 – Team Management and Plan Limits

Goal: validate that Free vs Pro plans enforce different team size limits using Supabase `team_members`.

## Prerequisites

- `team_members` table created (see 01_schema.sql).
- Backend and frontend running.
- A logged-in user with a profiles row (see Test 1).

## Steps

1. Ensure the logged in user is on Free
   - Go to `/account` and set plan to **Free**.

2. Open Team page
   - Go to `/team`.
   - Confirm existing members (if any) match rows in Supabase `team_members`.

3. Add members up to Free limit
   - Use the form to add 2 members, e.g.:
     - `teammate1@example.com`
     - `teammate2@example.com`
   - Both should succeed.
   - Third attempt should show an error about Free plan limit (backend enforces this using current count from Supabase).

4. Upgrade to Pro and re-test
   - On `/account`, set plan to **Pro**.
   - Return to `/team` and add extra members, up to a total of 10.
   - The UI should show updated usage and only block when you reach the Pro limit.

5. Verify in Supabase
   - In `team_members`, confirm the same emails you added from the UI exist as rows.

If these behaviours match, team + plan gating with Supabase storage is working.
