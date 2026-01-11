import json
import os
from urllib import error as urlerror, request as urlrequest

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal, Optional
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

from .supabase_client import check_supabase_connection


app = FastAPI()

# Allow frontend (Next.js dev) to call this API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    ok, detail = check_supabase_connection()
    return {
        "status": "ok",
        "supabase": {
            "ok": ok,
            "detail": detail,
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
