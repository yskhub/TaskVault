

<div align="center">
  
	<a href="https://task-vault-coral.vercel.app" target="_blank">
		<img src="https://raw.githubusercontent.com/yskhub/TaskVault/main/taskvault-frontend/public/logo.svg" alt="TaskVault Logo" width="120" />
	</a>

</div>

<div align="center">


	<h1 align="center">🚀 TaskVault – Subscription-Aware Workflow & Team SaaS</h1>

	<p align="center">
		<b>Production-style, portfolio-grade SaaS for workflow, team, and analytics management.</b><br>
		<a href="https://task-vault-coral.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-Vercel-38bdf8?logo=vercel"></a>
		<a href="https://github.com/yskhub/TaskVault"><img src="https://img.shields.io/github/stars/yskhub/TaskVault?style=social"></a>
	</p>

</div>

---

## ✨ Overview

**TaskVault** is a realistic, production-style SaaS app demonstrating modern subscription-aware business tooling:

- 🔒 Auth, role-based access, and secure workflow management
- 👥 Team collaboration with plan-aware limits
- 📊 Analytics dashboards and admin audit
- 🏗️ Real-world engineering trade-offs and security
- 🆓 Free-tier only, with mock plans and usage limits

---

## 🚀 Live Demo

**Frontend (Vercel):** [https://task-vault-coral.vercel.app/](https://task-vault-coral.vercel.app/)

**Key routes:**
- `/auth` – Authentication
- `/account` – Account & plan info
- `/workflows` – Workflow management
- `/team` – Team members & roles
- `/dashboard` – Analytics & KPIs
- `/admin/audit` – Admin audit log (admin-only)

No local setup required to evaluate core functionality.

---

## 🛠️ Tech Stack

**Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion  
**Backend:** FastAPI (Python), REST APIs  
**Auth & Data:** Supabase Auth, Supabase Postgres, RLS  
**Deployment:** Vercel (frontend), Supabase (backend & DB)  
**DevOps:** Env-based config, secure secrets, CORS, phase tags

---

## 📦 Repository Structure & Phases

<details>
<summary><b>Click to expand phase-by-phase breakdown</b></summary>

**Phase 1:** Project foundation, FastAPI backend, Next.js frontend, Supabase health wiring
**Phase 2:** Supabase Auth, profiles table, /auth & /account flows
**Phase 3:** In-memory workflow APIs, /workflows UI
**Phase 4:** Team management, Supabase-backed team_members, /team UI
**Phase 5:** Dashboard & analytics, charts
**Phase 6:** Optional features, mock plan upgrades, usage alerts
**Phase 7:** Deployment guidance (Vercel, hosted FastAPI)
**Phase 8:** Security & best practices (env, CORS, RLS)

Each phase includes:
- Design/spec in `Development_Phases/`
- Implementation docs in `docs/`
- Hands-on walkthroughs in `walkthrough/`
</details>

---

## 🏷️ Git History & Tags

Linear, clean commit history with tagged milestones for each phase.  
See `git-operations/phase-commits.md` for exact commands.

---

## 🔐 Security & Best Practices

- No secrets in repo; env-based config
- Supabase Auth, protected routes, RLS
- Role-aware UI locking, backend permission enforcement
- CORS configured for frontend origin
- Admin audit architecture

---

## 🧪 Local Development

**Backend (FastAPI):**
```sh
cd backend
../.venv/Scripts/python.exe -m uvicorn main:app --reload
```
Endpoints: [Health](http://127.0.0.1:8000/health), [API Docs](http://127.0.0.1:8000/docs)

**Frontend (Next.js):**
```sh
cd taskvault-frontend
npm install
npm run dev
```
URL: [http://localhost:3000](http://localhost:3000)

**.env.local** must contain:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_API_BASE_URL

---

## 🧭 Demo Walkthrough

<details>
<summary><b>Click to expand walkthrough steps</b></summary>

**Authentication:** `/auth` – Sign up/in with email & password
**Account & Plan:** `/account` – View plan, mock upgrade/downgrade
**Workflows:** `/workflows` – Create workflows, track progress
**Dashboard:** `/dashboard` – KPIs, charts, drill-downs
**Team:** `/team` – Add members, assign roles, enforce limits
**Admin Audit:** `/admin/audit` (admin only) – Review activity logs

**Example Workflows:**
- New Employee Onboarding: HR, IT, Manager, Benefits
- Customer Onboarding: CSM, Implementation, Training
- Invoice & Payment: Finance, Account Manager
</details>

---

## 🎯 Design Philosophy

- Built like a real internal SaaS tool, not a toy CRUD app
- Free-tier only, no artificial paywalls
- Mock plans to demo subscription logic
- Clean, minimal UI; clear separation of concerns
- Extensible, maintainable, and ready for code review

---

## ✅ Project Status

**Status:** Feature-complete & portfolio-ready

Ready for:
- Technical evaluation
- Code review
- System design discussion
- Frontend, backend, or full-stack interviews

---

## 📖 Documentation & Testing

- See phase docs in `/docs` for technical details
- **Manual Testing Guide:** [`docs/vercel-testing-guide.md`](docs/vercel-testing-guide.md)

---

<div align="center">
	<sub>Made with ❤️ by the TaskVault team. Contributions welcome!</sub>
</div>
