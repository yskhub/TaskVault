# TaskVault Architecture Diagram

Below is a textual architecture diagram for TaskVault. For a visual diagram, you can use tools like draw.io, Lucidchart, or Excalidraw to recreate this structure.

---

```
+-------------------+        +-------------------+        +-------------------+
|   User Browser    | <----> |    Next.js Frontend| <----> |   FastAPI Backend |
+-------------------+        +-------------------+        +-------------------+
         |                          |                            |
         |                          |                            |
         v                          v                            v
+-------------------+        +-------------------+        +-------------------+
|   Auth (Supabase) | <----> |   Database (Postgres, Supabase) |                |
+-------------------+        +-------------------+        +-------------------+
         |                          |                            |
         v                          v                            v
+-------------------+        +-------------------+        +-------------------+
|   RBAC / RLS      |        |   Analytics       |        |   Audit Logging   |
+-------------------+        +-------------------+        +-------------------+
```

---

## Components
- **User Browser:** Accesses the app via web (Vercel hosted)
- **Next.js Frontend:** UI, SSR, API routes, authentication, role-based UI
- **FastAPI Backend:** REST API, business logic, validation
- **Supabase:**
  - Auth (sign up/in, JWT, session)
  - Database (Postgres)
  - Row Level Security (RLS)
  - Analytics (dashboard KPIs)
  - Audit Logging (admin)

---

## Data Flow
1. User interacts with Next.js frontend
2. Frontend communicates with FastAPI backend and Supabase (auth, data)
3. Backend processes requests, applies business logic, and interacts with Supabase
4. Supabase enforces RLS, stores data, provides analytics and audit logs

---

## Security
- JWT-based authentication
- Role-based access control (RBAC)
- Row Level Security (RLS) for multi-tenancy
- No secrets in repo
- CORS and environment hygiene

---

## Deployment
- **Frontend:** Vercel
- **Backend:** Supabase (and optionally other cloud providers)
- **Database/Auth:** Supabase

---

# For a visual diagram, copy this structure into draw.io or Lucidchart and style as needed for presentations.
