import json
import os
import time
from urllib import error as urlerror, request as urlrequest

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal, Optional
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

try:
    # When imported as a package module (e.g. `backend.main`).
    from .supabase_client import check_supabase_connection  # type: ignore[import]
except ImportError:
    # Fallback for running `main.py` directly or via `uvicorn main:app` from the backend folder.
    from supabase_client import check_supabase_connection


app = FastAPI()

# Allow frontend (Next.js dev / deployed) to call this API from the browser.
# In production, set FRONTEND_ORIGINS in the environment (comma-separated list).
frontend_origins_env = os.getenv("FRONTEND_ORIGINS")
if frontend_origins_env:
    allowed_origins = [origin.strip() for origin in frontend_origins_env.split(",") if origin.strip()]
else:
    allowed_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    """Lightweight health check for the backend and Supabase.

    This uses only free capabilities:

    - A simple FastAPI handler in this backend
    - Supabase's public `/auth/v1/health` endpoint

    No paid services or add-ons are required.
    """
    start = time.perf_counter()
    ok, detail = check_supabase_connection()
    total_latency_ms = round((time.perf_counter() - start) * 1000, 1)

    # detail is provided by `check_supabase_connection` and should already be a
    # dictionary with optional `latency_ms`, but we keep this defensive in case
    # the implementation changes.
    if isinstance(detail, dict):
        supabase_latency_ms = detail.get("latency_ms")
        parsed_detail: object = detail
    else:
        supabase_latency_ms = None
        try:
            parsed_detail = json.loads(detail)
        except Exception:  # pragma: no cover - defensive only
            parsed_detail = detail

    return {
        "status": "ok" if ok else "degraded",
        "backend": {
            "ok": True,
            "latency_ms": total_latency_ms,
        },
        "supabase": {
            "ok": ok,
            "latency_ms": supabase_latency_ms,
            "detail": parsed_detail,
        },
    }


# -----------------------------
# Phase 3: Workflow management
# -----------------------------


class Step(BaseModel):
    title: str
    assigned_to: str
    status: Literal["pending", "in_progress", "completed"] = "pending"


class WorkflowCreate(BaseModel):
    title: str
    steps: List[Step] = []


class Workflow(WorkflowCreate):
    id: int


workflows: List[Workflow] = []
next_workflow_id: int = 1


@app.post("/workflows", response_model=Workflow)
def create_workflow(payload: WorkflowCreate) -> Workflow:
    global next_workflow_id

    workflow = Workflow(id=next_workflow_id, **payload.model_dump())
    next_workflow_id += 1
    workflows.append(workflow)
    return workflow


@app.get("/workflows", response_model=List[Workflow])
def list_workflows() -> List[Workflow]:
    return workflows


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


# -----------------------------
# Phase 4: User & team management
# -----------------------------


class TeamMember(BaseModel):
    email: str
    role: Literal["admin", "member"] = "member"


class TeamMemberOut(TeamMember):
    id: int


class TeamAddRequest(BaseModel):
    email: str
    role: Literal["admin", "member"] = "member"
    plan: Literal["free", "pro"]


class TeamRoleUpdate(BaseModel):
    role: Literal["admin", "member"]


def _get_supabase_rest_base() -> tuple[str, str]:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise HTTPException(status_code=500, detail="Supabase is not configured for team API")
    return url.rstrip("/"), key


def _supabase_rest_request(
    method: str,
    path: str,
    *,
    query: str | None = None,
    body: dict | None = None,
    extra_headers: dict | None = None,
) -> tuple[int, object | None]:
    base_url, key = _get_supabase_rest_base()
    url = f"{base_url}/rest/v1/{path}"
    if query:
        url = f"{url}?{query}"

    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Accept": "application/json",
    }
    if body is not None:
        headers["Content-Type"] = "application/json"
    if extra_headers:
        headers.update(extra_headers)

    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urlrequest.Request(url, headers=headers, method=method, data=data)

    try:
        with urlrequest.urlopen(req, timeout=10) as resp:
            status = resp.getcode()
            raw = resp.read().decode("utf-8").strip()
            if not raw:
                return status, None
            try:
                parsed = json.loads(raw)
            except json.JSONDecodeError:
                parsed = {"raw": raw}
            return status, parsed
    except urlerror.HTTPError as e:
        detail = e.read().decode("utf-8").strip() or e.reason
        raise HTTPException(status_code=e.code, detail=detail)
    except urlerror.URLError as e:
        raise HTTPException(status_code=502, detail=f"Supabase unreachable: {e.reason}")
    except Exception as e:  # pragma: no cover - safety net
        raise HTTPException(status_code=500, detail=f"Supabase error: {e}")


@app.get("/team", response_model=List[TeamMemberOut])
def list_team() -> List[TeamMemberOut]:
    """List team members stored in the Supabase `team_members` table.

    This uses Supabase's free PostgREST API; no paid features are required.
    """

    status, data = _supabase_rest_request(
        "GET",
        "team_members",
        query="select=id,email,role",
    )
    if status != 200:
        raise HTTPException(status_code=502, detail="Failed to load team members from Supabase")

    rows = data or []
    return [TeamMemberOut(id=row["id"], email=row["email"], role=row["role"]) for row in rows]


@app.post("/team/add", response_model=TeamMemberOut)
def add_member(payload: TeamAddRequest) -> TeamMemberOut:
    """Add a team member while enforcing subscription limits using Supabase storage.

    - Free plan: max 2 members
    - Pro plan: max 10 members
    """

    # Load existing members to enforce limits and uniqueness.
    existing = list_team()

    if any(m.email.lower() == payload.email.lower() for m in existing):
        raise HTTPException(status_code=400, detail="Member with this email already exists")

    limit = 2 if payload.plan == "free" else 10
    if len(existing) >= limit:
        raise HTTPException(
            status_code=403,
            detail=f"{payload.plan.capitalize()} plan is limited to {limit} team members.",
        )

    status, data = _supabase_rest_request(
        "POST",
        "team_members",
        body={"email": payload.email, "role": payload.role},
        extra_headers={"Prefer": "return=representation"},
    )

    if status not in (200, 201):
        raise HTTPException(status_code=502, detail="Failed to add member in Supabase")

    rows = data or []
    if not rows:
        raise HTTPException(status_code=502, detail="Supabase did not return the created member")

    row = rows[0]
    return TeamMemberOut(id=row["id"], email=row["email"], role=row["role"])


@app.patch("/team/{member_id}/role", response_model=TeamMemberOut)
def update_member_role(
    member_id: int,
    update: TeamRoleUpdate,
    actor_role: Literal["admin", "member"] = "member",
) -> TeamMemberOut:
    """Update a member's role.

    Only callers acting as an admin are allowed to change roles.
    """

    if actor_role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update roles")

    status, data = _supabase_rest_request(
        "PATCH",
        "team_members",
        query=f"id=eq.{member_id}&select=id,email,role",
        body={"role": update.role},
        extra_headers={"Prefer": "return=representation"},
    )

    if status not in (200, 204):
        raise HTTPException(status_code=502, detail="Failed to update member role in Supabase")

    rows = data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Member not found")

    row = rows[0]
    return TeamMemberOut(id=row["id"], email=row["email"], role=row["role"])


@app.delete("/team/{member_id}", status_code=204)
def remove_member(
    member_id: int,
    actor_role: Literal["admin", "member"] = "member",
) -> None:
    """Remove a team member.

    Only callers acting as an admin are allowed to remove members.
    """

    if actor_role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can remove members")

    status, _ = _supabase_rest_request(
        "DELETE",
        "team_members",
        query=f"id=eq.{member_id}",
    )

    if status == 204:
        return

    if status == 200:
        # Some PostgREST configs may return 200 with a body, treat as success.
        return

    raise HTTPException(status_code=404, detail="Member not found")


# -----------------------------
# Phase 5: Dashboard & analytics
# -----------------------------


class WorkflowStats(BaseModel):
    total: int
    with_steps: int
    without_steps: int
    total_steps: int
    pending_steps: int
    in_progress_steps: int
    completed_steps: int


class TeamStats(BaseModel):
    total_members: int
    admins: int
    members: int


class AnalyticsOverview(BaseModel):
    workflows: WorkflowStats
    team: TeamStats


@app.get("/analytics/overview", response_model=AnalyticsOverview)
def analytics_overview() -> AnalyticsOverview:
    """Return high-level workflow and team usage metrics.

    - Workflow stats are computed from the in-memory Phase 3 workflows list.
    - Team stats are computed from the Supabase-backed team_members table.
    """

    # Workflow statistics (in-memory)
    total_workflows = len(workflows)
    with_steps = sum(1 for w in workflows if w.steps)
    without_steps = total_workflows - with_steps

    pending_steps = 0
    in_progress_steps = 0
    completed_steps = 0

    for w in workflows:
        for s in w.steps:
            status = s.status or "pending"
            if status == "pending":
                pending_steps += 1
            elif status == "in_progress":
                in_progress_steps += 1
            elif status == "completed":
                completed_steps += 1

    total_steps = pending_steps + in_progress_steps + completed_steps

    workflow_stats = WorkflowStats(
        total=total_workflows,
        with_steps=with_steps,
        without_steps=without_steps,
        total_steps=total_steps,
        pending_steps=pending_steps,
        in_progress_steps=in_progress_steps,
        completed_steps=completed_steps,
    )

    # Team statistics (Supabase-backed via PostgREST).
    # If Supabase/team storage is not yet fully configured, degrade gracefully
    # by treating team metrics as zero instead of failing the entire endpoint.
    try:
        members_list = list_team()
    except HTTPException:
        members_list = []
    total_members = len(members_list)
    admins = sum(1 for m in members_list if m.role == "admin")
    members = sum(1 for m in members_list if m.role == "member")

    team_stats = TeamStats(
        total_members=total_members,
        admins=admins,
        members=members,
    )

    return AnalyticsOverview(workflows=workflow_stats, team=team_stats)
