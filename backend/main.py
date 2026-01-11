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


team_members: List[TeamMemberOut] = []
next_member_id: int = 1


@app.get("/team", response_model=List[TeamMemberOut])
def list_team() -> List[TeamMemberOut]:
    return team_members


@app.post("/team/add", response_model=TeamMemberOut)
def add_member(payload: TeamAddRequest) -> TeamMemberOut:
    """Add a team member while enforcing subscription limits.

    - Free plan: max 2 members
    - Pro plan: max 10 members
    """

    global next_member_id

    if any(m.email.lower() == payload.email.lower() for m in team_members):
        raise HTTPException(status_code=400, detail="Member with this email already exists")

    limit = 2 if payload.plan == "free" else 10
    if len(team_members) >= limit:
        raise HTTPException(
            status_code=403,
            detail=f"{payload.plan.capitalize()} plan is limited to {limit} team members.",
        )

    member = TeamMemberOut(id=next_member_id, email=payload.email, role=payload.role)
    next_member_id += 1
    team_members.append(member)
    return member


@app.patch("/team/{member_id}/role", response_model=TeamMemberOut)
def update_member_role(
    member_id: int,
    update: TeamRoleUpdate,
    actor_role: Literal["admin", "member"] = "member",
) -> TeamMemberOut:
    """Update a member's role.

    Only callers acting as an admin are allowed to change roles.
    This is a simple role-based access example for the in-memory API.
    """

    if actor_role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update roles")

    member = next((m for m in team_members if m.id == member_id), None)
    if member is None:
        raise HTTPException(status_code=404, detail="Member not found")

    member.role = update.role
    return member


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

    for idx, member in enumerate(team_members):
        if member.id == member_id:
            del team_members[idx]
            return

    raise HTTPException(status_code=404, detail="Member not found")
