# Phase 1 Walkthrough – Project Foundation & Architecture

This walkthrough documents everything we actually did in Phase 1 for TaskVault: setup steps, issues faced, and how we fixed them.

## 1. Repo & Folder Structure
- Confirmed project root: `D:/onlyai/Assignment_2/TaskVault`.
- Ensured base structure:
  - `frontend/`
  - `backend/`
  - `docs/`
  - Later added: `walkthrough/` for these logs.

## 2. Docs Setup
- Created `docs/phase-1-foundation.md` describing Phase 1 goals and scope.
- Created `docs/README.md` with:
  - Project overview and tech stack.
  - All 8 phases and dependency flow.

## 3. Frontend – Next.js + Tailwind + Framer Motion

### 3.1. Next.js Initialization
**Actions**
- Could not scaffold directly into `frontend/` due to `TaskVault` name restriction (uppercase not allowed by npm).
- Ran `npx create-next-app@latest taskvault-frontend --ts --app --no-eslint --no-src --no-tailwind` from the project root.
- Result: new app at `taskvault-frontend/` with App Router and TypeScript.

**Outcome**
- Next.js 16 app created and working.

### 3.2. Tailwind Installation Problems (npx issues)
**Actions**
- Installed Tailwind + PostCSS + Autoprefixer + Framer Motion:
  - `npm install tailwindcss postcss autoprefixer framer-motion`
- Tried to run `npx tailwindcss init -p`.

**Issues**
- `npx tailwindcss init -p` repeatedly failed with:
  - `npm error could not determine executable to run`.
- Cleanup attempts:
  - Deleted `node_modules` and `package-lock.json`, re-ran `npm install`.
  - Ran `npm cache clean --force`.
  - Updated npm globally via `npm install -g npm@latest`.
- Still failed: `npx` remained unreliable in this environment.

**Fix (Design Choice)**
- Avoided the flaky CLI entirely and manually scaffolded Tailwind config.

### 3.3. Manual Tailwind Configuration (Final State)
**Files**
- `taskvault-frontend/tailwind.config.js`
  - Content:
    - `content` includes `./app`, `./pages`, `./components`, `./src`.
    - `theme.extend.colors` defines:
      - `primary: #0F172A` (dark slate)
      - `accent: #2563EB` (blue CTA)
- `taskvault-frontend/postcss.config.js`
  - Initially used `tailwindcss` as a PostCSS plugin.
  - **Issue (Next.js 16 / Tailwind v4 change)**:
    - Build error: must use `@tailwindcss/postcss` instead.
  - **Fix**:
    - Installed plugin: `npm install @tailwindcss/postcss`.
    - Updated config to:
      - `plugins: { '@tailwindcss/postcss': {}, autoprefixer: {} }`.
- `taskvault-frontend/app/globals.css`
  - Replaced template CSS with Tailwind directives and minimal global defaults:
    - `@tailwind base;`
    - `@tailwind components;`
    - `@tailwind utilities;`
    - `html, body { height: 100%; }`
  - Fixed a typo that left an extra `}` and caused a `CssSyntaxError`.

### 3.4. Next.js Page Cleanup & Tailwind Verification
**Actions**
- `taskvault-frontend/app/page.tsx` initially contained the default template and broken edits (nested `<main>` inside `<Image>`, etc.).
- Replaced the entire component with a simple Tailwind test:
  ```tsx
  export default function Home() {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-4xl font-bold text-accent">
          Tailwind is working
        </h1>
      </main>
    );
  }
  ```

**Outcome**
- Run `npm run dev` inside `taskvault-frontend/`.
- Visit `http://localhost:3000`.
- Verified Tailwind integration when the blue "Tailwind is working" heading rendered.

## 4. Backend – FastAPI Scaffold

### 4.1. Initial FastAPI Setup
**Files**
- `backend/main.py`:
  ```python
  from fastapi import FastAPI

  app = FastAPI()

  @app.get("/health")
  def health_check():
      return {"status": "ok"}
  ```
- `backend/requirements.txt` with `fastapi` and `uvicorn`.
- `backend/README.md` documenting Phase 1 backend scope.

**Actions**
- Environment via `.venv` at project root (managed by VS Code tooling).
- Installed `fastapi` and `uvicorn` in the venv.
- Started dev server:
  - `D:/onlyai/Assignment_2/TaskVault/.venv/Scripts/python.exe -m uvicorn main:app --reload` from `backend/`.

**Outcome**
- Health endpoint `GET /health` responded with `{ "status": "ok" }`.

## 5. Python Version & Supabase Client Issues

### 5.1. Python 3.14 vs Supabase Client
**Issue**
- Global environment was Python 3.14.x.
- Attempted to install `supabase-py`:
  - `ERROR: No matching distribution found for supabase-py`.
- Root cause: `supabase-py` does not support Python 3.14 yet.

**Fix**
- Installed Python 3.11.
- Created/used a virtual environment tied to Python 3.11 for the backend.
- Installed compatible packages there:
  - `pip install fastapi uvicorn supabase` (but later moved away from direct supabase client use).

### 5.2. Final Design Choice for Supabase Integration
- To avoid version coupling and extra dependencies, we **did not** rely on the Supabase Python SDK in Phase 1.
- Instead, we implemented a small, explicit HTTP-based health check using the standard library.

## 6. Supabase Integration – Env, Client, and Health Check

### 6.1. Env Files
**Files**
- `backend/.env.example`:
  - Declares placeholders:
    - `SUPABASE_URL=`
    - `SUPABASE_SERVICE_ROLE_KEY=`
- `backend/.env` (local only, not to be committed):
  - Contains real values:
    - `SUPABASE_URL=https://mzzuzddlbdbwrednhpxf.supabase.co`
    - `SUPABASE_SERVICE_ROLE_KEY=sb_secret_...` (service role key)

### 6.2. Supabase Client (HTTP-based)
**File**
- `backend/supabase_client.py` (final version):
  - Uses `os.getenv` at **call time** (not at import time):
    - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` read inside the function.
  - Defines `check_supabase_connection()`:
    - Builds `health_url = "{SUPABASE_URL}/auth/v1/health"`.
    - Sets headers:
      - `apikey: <service role key>`
      - `Authorization: Bearer <service role key>`
    - Sends a GET request with `urllib.request`.
    - Returns `(True, detail)` for 2xx responses, `(False, detail)` otherwise.
    - Handles `HTTPError`, `URLError`, and generic `Exception` with descriptive messages.

**Key Issue & Fix**
- **Issue**: Initially, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` were read at import time; when `load_dotenv` had not yet run, the function always saw them as `None`.
- **Fix**: Reworked to read env values inside `check_supabase_connection()`, so it always reflects the current environment.

### 6.3. FastAPI main.py Integration
**File**
- `backend/main.py` (final version for Phase 1):
  - Loads `.env` relative to this file:
    ```python
    from fastapi import FastAPI
    from dotenv import load_dotenv
    from pathlib import Path

    BASE_DIR = Path(__file__).resolve().parent
    load_dotenv(BASE_DIR / ".env")

    from .supabase_client import check_supabase_connection

    app = FastAPI()


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
    ```

**Issues Encountered**
1. **Dotenv load order**
   - Initially, `load_dotenv()` was called **after** importing the client, and with no explicit path.
   - This caused `SUPABASE_*` to appear unset when accessed.
   - **Fix**: Call `load_dotenv(BASE_DIR / ".env")` **before** importing `check_supabase_connection`.

2. **Import Path / uvicorn Target**
   - Running `uvicorn main:app` from the project root failed (`Could not import module "main"`).
   - **Fix**: Use a fully qualified module path:
     - `uvicorn backend.main:app --reload` from project root, or
     - `uvicorn main:app --reload` from inside `backend/`.

3. **Supabase Key / Permissions**
   - Early tests returned `HTTPError: 401 Unauthorized` when using an invalid or anon key.
   - After setting the correct `sb_secret_...` service role key, the health check returned 200.

### 6.4. Final Verification
**Command**
- Start server from project root:
  - `D:/onlyai/Assignment_2/TaskVault/.venv/Scripts/python.exe -m uvicorn backend.main:app --reload`

**Result**
- `GET /health` returns:
  ```json
  {
    "status": "ok",
    "supabase": {
      "ok": true,
      "detail": "{\"status\": 200, \"data\": {\"version\": \"v2.184.1\", \"name\": \"GoTrue\", \"description\": \"GoTrue is a user registration and authentication API\"}}"
    }
  }
  ```
- This confirms both:
  - FastAPI is running correctly.
  - Supabase Auth health endpoint is reachable with valid credentials.

## 7. Summary of Phase 1 Outcomes
- **Frontend**
  - Next.js 16 (App Router) + TypeScript app created in `taskvault-frontend/`.
  - Tailwind CSS integrated via manual config (no reliance on fragile `npx`), matching the institute-style SaaS design foundations.
  - Framer Motion installed and ready (to be used lightly in later phases).

- **Backend**
  - FastAPI app scaffolded with a `/health` endpoint.
  - Python 3.11-compatible environment set up, avoiding `supabase-py` version issues.
  - Supabase wired via a simple, robust HTTP health check with secure `.env`-based config.

- **Stability & Design Choices**
  - Avoided brittle CLI behaviors (`npx tailwindcss`, incompatible SDKs).
  - Centralized secrets in `.env`, never hardcoded in code.
  - Health checks provide a clear, observable signal that both API and Supabase are ready for later phases (Auth, subscriptions, workflows).

This completes the Phase 1 foundation in a way that is production-conscious and aligned with the PRD: no paid services, clean architecture, and a solid base for Phase 2 (Authentication & Subscription System).
