# Phase 4 Walkthrough – User & Team Management

This walkthrough documents how Phase 4 was implemented and validated in the TaskVault codebase.

## 1. Starting Point

At the beginning of Phase 4:
- Phases 1–3 were already implemented and stable.
- The backend exposed `/health` and in-memory `/workflows` endpoints.
- The frontend had `/auth`, `/account`, and `/workflows` pages.
- Supabase Auth and the `profiles` table (with `subscription_plan`) were already wired up.

The goal of Phase 4 was to layer **basic team management** on top of this foundation and connect it to the subscription plan.

---

## 2. Backend: In-memory Team API

### 2.1. Adding Models

In `backend/main.py`, after the Phase 3 workflow management section, new Pydantic models were added:

- `TeamMember` – represents a logical member with `email` and `role`.
- `TeamMemberOut` – extends `TeamMember` with an `id` field used by the frontend.
- `TeamAddRequest` – request body for creating a member, including the current plan (`free` or `pro`).
- `TeamRoleUpdate` – request body for updating a member's role.

An in-memory store was added:

- `team_members: List[TeamMemberOut] = []`
- `next_member_id: int = 1`

### 2.2. Implementing Endpoints

The following endpoints were implemented on the same FastAPI app:

1. `GET /team`
   - Returns the full `team_members` list.

2. `POST /team/add`
   - Accepts `TeamAddRequest`.
   - Rejects duplicate emails (case-insensitive) with `400`.
   - Enforces subscription limits:
     - Free: max 2 members.
     - Pro: max 10 members.
   - Returns `403` with a clear message if the plan limit is exceeded.
   - On success, creates a `TeamMemberOut` with a new `id` and appends it to `team_members`.

3. `PATCH /team/{member_id}/role`
   - Accepts `TeamRoleUpdate` and `actor_role` query param.
   - If `actor_role != "admin"`, returns `403`.
   - If `member_id` is not found, returns `404`.
   - Otherwise, updates the member's role.

4. `DELETE /team/{member_id}`
   - Accepts `actor_role` query param.
   - If `actor_role != "admin"`, returns `403`.
   - If `member_id` is not found, returns `404`.
   - Otherwise, removes the member from `team_members`.

These endpoints provide a minimal but complete example of CRUD + role-based access and subscription-aware limits.

### 2.3. Backend Validation

- The backend was started from the project root with:
  - `.venv\Scripts\python.exe -m uvicorn backend.main:app --reload`
- Uvicorn logs confirmed successful startup.
- The existing CORS configuration (allowing `http://localhost:3000`) remained valid for the new `/team` routes.

---

## 3. Frontend: `/team` Page

### 3.1. Page Creation

A new App Router page was added at:

- `taskvault-frontend/app/team/page.tsx`

This page is a client component that:
- Uses the shared Supabase client to detect the current user and plan.
- Talks to the FastAPI backend via `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8000`).

### 3.2. State & Flow

The page maintains a small state machine:

- `loading` – while fetching the current user/profile.
- `signed_out` – if `supabase.auth.getUser()` returns no user.
- `ready` – when the user is present and the plan is known.

In the `ready` state it stores:
- `email` – from the `profiles` table or the Supabase user.
- `plan` – `free` or `pro`.
- `members` – the list returned from `GET /team`.

The effect sequence is:

1. Call `supabase.auth.getUser()`.
2. If no user → switch to `signed_out` and render a prompt linking to `/auth`.
3. If user exists:
   - Load `subscription_plan` and `email` from `profiles`.
   - Insert a default profile row if missing.
   - Initialize state to `ready` and then fetch the team from the backend.

### 3.3. Team Operations

- **Add member**
  - Form with email + role (Member/Admin).
  - Submits to `POST /team/add` with `{ email, role, plan: state.plan }`.
  - On non-200 responses, attempts to parse a JSON `detail` field and surface the message.
  - On success, clears the input and refreshes the team list.

- **Update role**
  - Uses `PATCH /team/{id}/role?actor_role=admin`.
  - Buttons allow toggling between Admin and Member.

- **Remove member**
  - Uses `DELETE /team/{id}?actor_role=admin`.
  - A red "Remove" button is shown per row.

### 3.4. UI Checks

- If `state.status === "loading"`, a full-screen loading state is shown.
- If `state.status === "signed_out"`, a centered card invites the user to go to `/auth`.
- In the ready state:
  - The header clearly labels this as "Phase 4 · User & team management".
  - The plan pill shows `Free · 2 member limit` or `Pro · 10 member limit`.
  - The team table is responsive and scrollable.

A full Next.js production build was run via `npm run build` and completed successfully, confirming that the new page compiles without TypeScript or runtime build errors.

---

## 4. Final Validation

- **Backend**
  - Uvicorn starts cleanly with `backend.main:app`.
  - The `/team` routes are registered alongside existing `/health` and `/workflows` routes.

- **Frontend**
  - `npm run build` passes with `/team` listed as a static route.
  - The `/team` page correctly reacts to auth state (signed in vs signed out).
  - The plan indicators and limits align with the backend rules (2 members for Free, 10 for Pro).

No known Phase 4-specific errors or TODOs remain in the codebase.

---

## 5. Next Steps

- If desired in a future phase, migrate the in-memory `team_members` into a Supabase `team_members` table keyed by user/project.
- Tighten role-based access by deriving `actor_role` from the authenticated user rather than a query parameter.
- Extend the UI to associate workflows with specific team members.
