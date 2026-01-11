# Git Operations: Phase-wise Commits

This document records the Git commands used to commit and push TaskVault code phase-wise.

## Assumptions
- You are on branch `main`.
- A remote named `origin` is already configured (e.g., GitHub).

If `origin` is not set yet, configure it first:

```bash
git remote add origin https://github.com/yskhub/TaskVault.git
```

---

## Phase 1 – Foundation

```bash
# From repo root
cd D:/onlyai/Assignment_2/TaskVault

# Add all Phase 1 files (initial project setup)
git add COPILOT_CONTEXT.md prd.md README.md docs/ Development_Phases/ backend/ frontend/ taskvault-frontend/ walkthrough/

# Commit with a clear message
git commit -m "Phase 1: project foundation, frontend+backend scaffolding, Supabase health"

# Push to remote (first push may need -u)
git push -u origin main
```

---

## Phase 2 – Auth & Mock Subscriptions

After Phase 2 changes (auth pages, Supabase profiles, UI polish) are complete and Phase 1 has already been committed:

```bash
# Ensure you are up to date
cd D:/onlyai/Assignment_2/TaskVault
git pull

# Stage files changed in Phase 2
git add taskvault-frontend/app/auth/ taskvault-frontend/app/account/ taskvault-frontend/lib/supabaseClient.ts docs/ walkthough/ backend/

# Commit with a Phase 2 message
git commit -m "Phase 2: Supabase Auth, profiles table, mock subscription flows"

# Push to remote
git push origin main
```

---

## Phase 3 – Workflow Management (In-Memory)

After Phase 3 changes (backend workflow APIs, /workflows UI, CORS fixes, docs + walkthrough) are complete and Phase 2 has already been committed:

```bash
# Ensure you are up to date
cd D:/onlyai/Assignment_2/TaskVault
git pull

# Stage files changed in Phase 3
git add backend/main.py \
	docs/phase-3-workflow-management.md \
	walkthrough/phase-3-walkthrough.md \
	taskvault-frontend/app/workflows/

# Commit with a Phase 3 message
git commit -m "Phase 3: in-memory workflow management backend+frontend"

# Push to remote
git push origin main
```

---

## Optional: Tags per phase

```bash
# Tag after each finished phase
git tag phase-1
git push origin phase-1

git tag phase-2
git push origin phase-2

# After pushing Phase 3
git tag phase-3
git push origin phase-3
```

---

## Phase 4 – User & Team Management (in-memory → Supabase)

After Phase 4 changes (team endpoints, `/team` UI, and later Supabase-backed persistence) are complete and Phase 3 has already been committed:

```bash
# Ensure you are up to date
cd D:/onlyai/Assignment_2/TaskVault
git pull

# Stage files for the in-memory team implementation
git add backend/main.py \
	docs/phase-4-user-team-management.md \
	walkthrough/phase-4-walkthrough.md \
	taskvault-frontend/app/team/

# Commit for the in-memory version
git commit -m "Phase 4: user & team management"

# Push to remote
git push origin main

# Tag the in-memory implementation
git tag phase-4
git push origin phase-4

# Later, after refactoring to Supabase-backed persistence
git add backend/main.py \
	docs/phase-4-user-team-management.md \
	walkthrough/phase-4-walkthrough.md \
	taskvault-frontend/app/team/page.tsx

git commit -m "Phase 4: Supabase team persistence"
git push origin main

git tag phase-4-supabase
git push origin phase-4-supabase
```

---

## Phase 5 – Dashboard & Analytics

After Phase 5 changes (analytics endpoint, `/dashboard` UI, docs, walkthrough) are complete and Phase 4 has already been committed:

```bash
# Ensure you are up to date
cd D:/onlyai/Assignment_2/TaskVault
git pull

# Stage files changed in Phase 5
git add backend/main.py \
	docs/phase-5-dashboard-analytics.md \
	walkthrough/phase-5-walkthrough.md \
	taskvault-frontend/app/dashboard/page.tsx \
	taskvault-frontend/package.json

# Commit with a Phase 5 message
git commit -m "Phase 5: dashboard analytics backend+frontend"

# Push to remote
git push origin main

# (Optional) tag for Phase 5
git tag phase-5
git push origin phase-5
```

Adjust paths or messages as needed based on your exact changes.
