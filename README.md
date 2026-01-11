# TaskVault
SUBSCRIPTION-BASED BUSINESS TOOL (SAAS PRODUCT)

## Repository Structure & Phases

This repo is organized and versioned by implementation phases that match the product/technical PRD.

- **Phase 1** – Project foundation, FastAPI backend, Next.js frontend, Supabase health wiring.
- **Phase 2** – Supabase Auth, `profiles` table with `subscription_plan`, `/auth` and `/account` flows.
- **Phase 3** – In-memory workflow management APIs and `/workflows` UI.
- **Phase 4** – User & team management, Supabase-backed `team_members` table, `/team` UI.
- **Phase 5** – Dashboard & analytics via `/analytics/overview` and `/dashboard` (charts).

Each phase has:
- A design/spec document under `Development_Phases/`.
- A detailed implementation doc under `docs/`.
- A hands-on walkthrough under `walkthrough/`.

## Git History & Tags

The `main` branch contains a linear set of phase commits plus the initial GitHub scaffold. For quick navigation:

- Tag **phase-1** → Commit "Phase 1: project foundation, frontend+backend scaffolding, Supabase health"
- Tag **phase-2** → Commit "Phase 2: Supabase Auth, profiles table, mock subscription flows"
- Tag **phase-3** → Commit "Phase 3: in-memory workflow management backend+frontend"
- Tag **phase-4** → Commit "Phase 4: user & team management (in-memory)"
- Tag **phase-4-supabase** → Commit "Phase 4: Supabase team persistence"

You can check out any phase with:

```bash
git checkout phase-1   # or phase-2, phase-3, phase-4, phase-4-supabase
```

The actual Git commands used to create these commits and tags are documented in git-operations/phase-commits.md.
