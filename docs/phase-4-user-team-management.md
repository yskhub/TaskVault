# Phase 4: User & Team Management

## Overview

Phase 4 introduces basic, in-memory user & team management on top of the existing TaskVault foundation.

The goal is to:
- Maintain a simple team roster (email + role) for the current workspace.
- Enforce subscription-based limits (Free vs Pro plans).
- Demonstrate elementary role-based access control around team operations.

This phase is intentionally implemented **in-memory** for clarity and speed; later phases could move this into Supabase tables.

---

## Backend: FastAPI API

Implemented in `backend/main.py` under the "Phase 4: User & team management" section.

### Data Models

- `TeamMember` – base model for a team member.
  - `email: str`
  - `role: Literal["admin", "member"] = "member"`

- `TeamMemberOut(TeamMember)` – extends `TeamMember` with an `id` used client-side.
  - `id: int`

- `TeamAddRequest` – payload for adding a member.
  - `email: str`
  - `role: Literal["admin", "member"] = "member"`
  - `plan: Literal["free", "pro"]`

- `TeamRoleUpdate` – payload for changing a member's role.
  - `role: Literal["admin", "member"]`

### In-memory Storage

The API keeps everything in memory:

- `team_members: List[TeamMemberOut] = []`
- `next_member_id: int = 1`

This keeps the example focused on the HTTP and validation logic rather than persistence.

### Endpoints

All endpoints are rooted at the existing FastAPI app.

#### `GET /team`

List all team members.

- **Response:** `List[TeamMemberOut]`
- No authentication is enforced at the backend layer for this prototype.

#### `POST /team/add`

Add a new team member and enforce subscription-based limits.

- **Request body:** `TeamAddRequest`
- **Subscription limits:**
  - Free plan: max **2** members.
  - Pro plan: max **10** members.
- **Rules:**
  - If a member with the same email already exists (case-insensitive), return `400`.
  - If the team already has `limit` members for the given `plan`, return `403` with a helpful error message.

#### `PATCH /team/{member_id}/role`

Update a member's role.

- **Query parameter:** `actor_role: Literal["admin", "member"] = "member"`
- **Body:** `TeamRoleUpdate`
- **Rules:**
  - Only allowed if `actor_role == "admin"`; otherwise, returns `403`.
  - If the member id is not found, returns `404`.

This simulates role-based access control in a lightweight way, using the `actor_role` query parameter as a stand-in for real authentication/authorization.

#### `DELETE /team/{member_id}`

Remove a member from the team.

- **Query parameter:** `actor_role: Literal["admin", "member"] = "member"`
- **Rules:**
  - Only allowed if `actor_role == "admin"`; otherwise, returns `403`.
  - If the member id is not found, returns `404`.

---

## Frontend: `/team` Page (Next.js)

Implemented in `taskvault-frontend/app/team/page.tsx`.

### Responsibilities

- Fetch the signed-in user and their subscription plan from Supabase (`profiles` table).
- Ensure a `profiles` row exists (creating one if missing, similar to `/account`).
- Load and display the team from the FastAPI backend.
- Allow admins to add, update, and remove members while respecting subscription limits.

### Integration with Supabase

The page uses the shared Supabase client:

- Reads the current user via `supabase.auth.getUser()`.
- Loads `subscription_plan` and `email` from the `profiles` table.
- If no profile row exists for the user, inserts a default one with plan `free`.

This mirrors the behavior of the `/account` page, keeping plan logic in one place.

### UI Behavior

- If **loading**, shows a centered "Loading team..." state.
- If **signed out**, shows a card prompting the user to go to `/auth`.
- If **ready**:
  - Shows "Signed in as" + email.
  - Indicates plan and computed member limit (`Free · 2 member limit` or `Pro · 10 member limit`).
  - Provides a form to add a member:
    - Email input.
    - Role select (Member/Admin).
    - Submits to `POST /team/add` with `{ email, role, plan }`.
    - Displays backend error messages (e.g., hitting the plan limit or duplicate emails).
  - Renders a table of team members with actions:
    - Promote/demote Admin/Member via `PATCH /team/{id}/role?actor_role=admin`.
    - Remove member via `DELETE /team/{id}?actor_role=admin`.

### Subscription & Role Enforcement

- **Subscription limits** are enforced on the backend and surfaced in the UI via error messages.
- **Role-based access** is simulated by always calling admin-only endpoints with `actor_role=admin` for this prototype. In a production system, this would be derived from the authenticated user and enforced server-side.

---

## Detailed Walkthrough

For a step-by-step account of how Phase 4 was implemented and verified (including commands, issues, and reasoning), see:

- `walkthrough/phase-4-walkthrough.md`
