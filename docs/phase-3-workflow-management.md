# Phase 3 – Workflow Management

## Purpose
Phase 3 introduces a basic workflow management layer so teams can:
- Create workflows with a title.
- Add ordered steps.
- Assign each step to a person.
- Track simple status for each step.

Implementation in this phase uses in-memory storage on the backend (no database writes yet). Later phases can replace this with Supabase-backed tables without breaking the public API.

## Backend – FastAPI

### Models
- Defined in `backend/main.py`:
  - `Step` (Pydantic model)
    - `title: str`
    - `assigned_to: str`
    - `status: Literal["pending", "in_progress", "completed"] = "pending"`
  - `WorkflowCreate` (input)
    - `title: str`
    - `steps: List[Step] = []`
  - `Workflow` (output)
    - Inherits from `WorkflowCreate` and adds `id: int`.

### Storage
- Simple in-memory list (per process):
  - `workflows: List[Workflow] = []`
  - `next_workflow_id: int = 1`
- This keeps Phase 3 light and focused on API design and frontend wiring.

### Endpoints
- `POST /workflows`
  - Body: `WorkflowCreate` JSON.
  - Behavior:
    - Assigns an auto-incrementing `id`.
    - Appends to the in-memory `workflows` list.
    - Returns the created `Workflow`.

- `GET /workflows`
  - Returns the current list of in-memory workflows (`List[Workflow]`).

- `PATCH /workflows/{workflow_id}/steps/{step_index}`
  - Body: `StepUpdate` with any of `title`, `assigned_to`, `status`.
  - Behavior:
    - Finds the workflow by `id`.
    - Updates the specified step by index.
    - Returns the updated `Workflow`.

## Frontend – Next.js /workflows

### Page
- File: `taskvault-frontend/app/workflows/page.tsx`.
- Client component that:
  - Fetches the list of workflows from `GET /workflows` on load.
  - Provides a form to create a new workflow and steps.
  - Displays all workflows and their steps.

### API Base URL
- Uses `NEXT_PUBLIC_API_BASE_URL` if defined; falls back to `http://localhost:8000`:
  ```ts
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
  ```

### Create Workflow Form
- Inputs:
  - Workflow title.
  - One or more step rows (title + assigned_to).
- Only non-empty steps are sent.
- On submit:
  - `POST ${API_BASE_URL}/workflows` with `{ title, steps }`.
  - On success, resets the form and re-fetches workflows.

### Workflow List
- Renders each workflow in a card with:
  - Title.
  - Step count.
  - Ordered list of steps (title, assignee, and status badge).
- Status comes from the backend; default is `pending`.

## How to Run & Test

1. **Backend**
   - From repo root, in your Python venv:
     ```bash
     python -m uvicorn backend.main:app --reload
     ```
   - Verify:
     - `GET http://localhost:8000/health` still works.
     - `GET http://localhost:8000/workflows` returns `[]` initially.

2. **Frontend**
   - From `taskvault-frontend/`:
     ```bash
     npm run dev
     ```
   - Visit `http://localhost:3000/workflows`.

3. **Manual Flow**
   - Create a workflow with a title and a few steps.
   - Confirm it appears under "Existing workflows" with the correct step count.
   - Refresh the page; note that data is in-memory, so workflows reset when the backend restarts (expected in Phase 3).

## Detailed Walkthrough

For a concrete, chronological log of the actual implementation work in this phase, including issues (like CORS / `Failed to fetch`) and how they were resolved, see:

- [walkthrough/phase-3-walkthrough.md](../walkthrough/phase-3-walkthrough.md)

This completes the lightweight, in-memory implementation of workflow management for Phase 3, setting the stage for Supabase-backed persistence and richer tracking in later phases.
