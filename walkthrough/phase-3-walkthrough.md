# Phase 3 Walkthrough – Workflow Management (In-Memory)

This walkthrough captures what we actually implemented in Phase 3 for TaskVault: backend workflow APIs, the `/workflows` UI, issues we hit (CORS, fetch), and how we fixed them.

## 1. Phase 3 Scope
- Add a minimal workflow management layer:
  - Create workflows with a title.
  - Add steps with assignees.
  - Track a simple step status (`pending | in_progress | completed`).
- Keep storage **in-memory only** in this phase (no database writes yet).
- Expose REST endpoints from FastAPI and a matching UI in the Next.js app.

## 2. Backend – FastAPI Workflow APIs

### 2.1. Extending `backend/main.py`

**Original state**
- `backend/main.py` only contained:
  - FastAPI app.
  - `/health` endpoint calling `check_supabase_connection()`.

**Changes for Phase 3**
- Imported extra types and middleware:
  - `HTTPException` from FastAPI.
  - `BaseModel` from Pydantic.
  - `List`, `Literal`, `Optional` from `typing`.
  - `CORSMiddleware` from `fastapi.middleware.cors`.
- Added CORS middleware so the frontend (localhost:3000) can call the API directly:
  ```python
  app = FastAPI()

  app.add_middleware(
      CORSMiddleware,
      allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

### 2.2. Workflow Models

Defined just below the existing `/health` endpoint in `backend/main.py`:

```python
class Step(BaseModel):
    title: str
    assigned_to: str
    status: Literal["pending", "in_progress", "completed"] = "pending"


class WorkflowCreate(BaseModel):
    title: str
    steps: List[Step] = []


class Workflow(WorkflowCreate):
    id: int
```

**Design notes**
- `WorkflowCreate` models input; `Workflow` adds `id` for responses.
- `status` is constrained to three allowed values; default is `pending`.

### 2.3. In-Memory Storage

Added simple module-level storage in `backend/main.py`:

```python
workflows: List[Workflow] = []
next_workflow_id: int = 1
```

- These are **not** persisted – restarting the backend clears them (acceptable for this phase).

### 2.4. Endpoints

**Create workflow**
```python
@app.post("/workflows", response_model=Workflow)
def create_workflow(payload: WorkflowCreate) -> Workflow:
    global next_workflow_id

    workflow = Workflow(id=next_workflow_id, **payload.model_dump())
    next_workflow_id += 1
    workflows.append(workflow)
    return workflow
```

**List workflows**
```python
@app.get("/workflows", response_model=List[Workflow])
def list_workflows() -> List[Workflow]:
    return workflows
```

**Update a single step** (for later use)
```python
class StepUpdate(BaseModel):
    title: Optional[str] = None
    assigned_to: Optional[str] = None
    status: Optional[Literal["pending", "in_progress", "completed"]] = None


@app.patch("/workflows/{workflow_id}/steps/{step_index}", response_model=Workflow)
def update_step(workflow_id: int, step_index: int, update: StepUpdate) -> Workflow:
    try:
        workflow = next(w for w in workflows if w.id == workflow_id)
    except StopIteration:
        raise HTTPException(status_code=404, detail="Workflow not found")

    if step_index < 0 or step_index >= len(workflow.steps):
        raise HTTPException(status_code=404, detail="Step not found")

    step = workflow.steps[step_index]

    if update.title is not None:
        step.title = update.title
    if update.assigned_to is not None:
        step.assigned_to = update.assigned_to
    if update.status is not None:
        step.status = update.status

    return workflow
```

## 3. Frontend – `/workflows` Page

### 3.1. New Route

- File created: `taskvault-frontend/app/workflows/page.tsx`.
- Marked as a client component with `"use client"`.

### 3.2. API Base URL

At the top of the file:
```ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
```
- Allows overriding with an env var in future deployments.
- Defaults to `http://localhost:8000` for local dev.

### 3.3. Types & State

```ts
type Step = {
  title: string;
  assigned_to: string;
  status?: "pending" | "in_progress" | "completed";
};

type Workflow = {
  id: number;
  title: string;
  steps: Step[];
};
```

React state:
- `title` – workflow title input.
- `steps` – array of step drafts (title + assigned_to).
- `workflows` – list fetched from the backend.
- `loading` – submission state for the Create button.

### 3.4. Loading Workflows

```ts
async function fetchWorkflows() {
  try {
    const res = await fetch(`${API_BASE_URL}/workflows`);
    if (!res.ok) return;
    const data: Workflow[] = await res.json();
    setWorkflows(data);
  } catch (err) {
    console.error("Failed to load workflows", err);
  }
}

useEffect(() => {
  fetchWorkflows();
}, []);
```

### 3.5. Creating a Workflow

- Keeps a list of editable step rows.
- Filters out empty rows before sending to the backend.

```ts
const filteredSteps = steps.filter((s) => s.title.trim() && s.assigned_to.trim());

const res = await fetch(`${API_BASE_URL}/workflows`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title, steps: filteredSteps }),
});
```

On success, the form is reset and `fetchWorkflows()` is called again to refresh the list.

### 3.6. UI

- Top section: explanations + form for creating workflows.
- Step editor: each step row captures title and assignee with an "+ Add step" button.
- Existing workflows: cards showing
  - Title.
  - Step count.
  - An ordered list of steps with status badges.

The styling matches the dark SaaS look used on `/auth` and `/account`.

## 4. Issues & Fixes

### 4.1. Browser Error – `TypeError: Failed to fetch`

**Symptom**
- On first load of `/workflows`, the browser console showed:
  - `TypeError: Failed to fetch` at `fetchWorkflows`.
- Backend worked when called directly via curl or Python, so the problem was specific to browser requests.

**Root cause**
- CORS (Cross-Origin Resource Sharing) was not configured.
- Browser requests from `http://localhost:3000` to `http://localhost:8000` were blocked.

**Fix**
- Added `CORSMiddleware` to the FastAPI app with:
  - `allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"]`.
  - `allow_methods=["*"], allow_headers=["*"], allow_credentials=True`.
- Restarted the backend (`python -m uvicorn backend.main:app --reload`).
- After this, fetches from the Next.js frontend succeeded.

### 4.2. Build & TypeScript Validation

- Ran `npm run build` in `taskvault-frontend` after adding the new page.
- Next.js created an optimized production build with no TypeScript errors.
- New static route: `/workflows` appeared alongside `/`, `/auth`, `/account`.

## 5. Validation Steps

- Backend:
  - `GET http://localhost:8000/health` → 200 OK with Supabase health info.
  - `GET http://localhost:8000/workflows` → `[]` initially.
  - `POST http://localhost:8000/workflows` with a JSON payload created a workflow and returned it with `id` and `pending` statuses.
  - Subsequent `GET /workflows` returned the created workflow.

- Frontend:
  - Visited `http://localhost:3000/workflows`.
  - Created a workflow with:
    - Title: e.g., `New hire onboarding`.
    - Steps: e.g., `Manager approval`, `IT setup` with assignees.
  - Verified the workflow appeared under "Existing workflows" with the correct step count and data.
  - Confirmed that restarting the backend cleared workflows (expected for in-memory Phase 3).

## 6. Phase 3 Outcome

Phase 3 successfully adds a thin but functional workflow layer:
- Clear backend API for workflows and steps.
- A polished `/workflows` UI that talks to those APIs.
- Correct browser-to-API communication via CORS.

This sets us up to move to future phases where workflows can be persisted in Supabase and enriched with team context and analytics.
