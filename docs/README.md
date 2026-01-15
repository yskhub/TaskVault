
<div align="center">
  <img src="https://raw.githubusercontent.com/yskhub/TaskVault/main/taskvault-frontend/public/logo.svg" alt="TaskVault Logo" width="120" />
  
  <h1>🚀 <span style="color:#38bdf8">TaskVault</span> – Modern SaaS for Teams</h1>
  <p><b>Workflow, team, and analytics platform built with Next.js, FastAPI, and Supabase.</b></p>
  <p>
    <a href="https://task-vault-coral.vercel.app" target="_blank"><img src="https://img.shields.io/badge/Live%20Demo-Vercel-38bdf8?logo=vercel" alt="Live Demo" /></a>
    <a href="https://github.com/yskhub/TaskVault" target="_blank"><img src="https://img.shields.io/github/stars/yskhub/TaskVault?style=social" alt="GitHub stars" /></a>
  </p>
</div>

---

## ✨ Project Overview

**TaskVault** is a free-tier, secure-by-design SaaS app for business workflow and team management. Built with **Next.js**, **FastAPI**, and **Supabase**, it delivers a modern, minimal, institute-style UI and robust backend architecture.

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Python + FastAPI
- **Database & Auth:** Supabase (PostgreSQL, Supabase Auth, RLS)
- **Deployment:** Vercel (frontend), Supabase (backend & database)
- **Version Control:** GitHub (public repo)

## 🗂️ Development Phases

<details>
<summary><b>Click to expand phase-by-phase breakdown</b></summary>

1. <b>Project Foundation & Architecture</b>
   - Initialize repo, Next.js, FastAPI, Supabase, env vars
2. <b>Authentication & Subscription System (Mock)</b>
   - Supabase Auth, users table, plan middleware, protected routes
3. <b>User & Team Management</b>
   - Team members, roles, RLS, backend validation, team UI
4. <b>Workflow & Task Engine</b>
   - Workflows, steps, assignments, status tracking, real-time updates
5. <b>Dashboard & Analytics</b>
   - Workflow analytics, team usage, charts, optimized queries
6. <b>Advanced Features & Enhancements</b>
   - Usage limits, plan upgrades, file uploads, notifications
7. <b>Security & Performance Hardening</b>
   - RLS, rate limiting, validation, error handling, audit logging
8. <b>Deployment & Finalization</b>
   - Production deployment, environment separation, final testing, documentation

</details>

## 🔗 Phase Dependency Flow

Each phase builds on the previous, ensuring a logical, secure, and maintainable development process.

## 🚀 Deployment Instructions

- **Frontend:** Deploy to Vercel
- **Backend & Database:** Host via Supabase
- **Environment:** Configure environment variables as per documentation

## 📚 GitHub Rules

- Public repository
- Frequent, meaningful commits
- Documentation for every phase in `/docs`

---

## 📖 Documentation & Testing

- See individual phase docs in `/docs` for technical details.
- **Manual Testing Guide:** [docs/vercel-testing-guide.md](docs/vercel-testing-guide.md) – step-by-step walkthrough for new users and admins on Vercel.

---

<div align="center">
  <sub>Made with ❤️ by the TaskVault team. Contributions welcome!</sub>
</div>