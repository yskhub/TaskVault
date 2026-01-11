# Phase 2 Walkthrough – Authentication & Mock Subscriptions

This walkthrough documents what we actually did in Phase 2: Supabase Auth integration, the `profiles` subscription model, UI work, issues we hit, and how we fixed them.

## 1. Phase 2 Goals
- Connect the frontend to Supabase Auth using the public anon key.
- Model basic subscription state (`free` vs `pro`) using a `profiles` table.
- Build two pages:
  - `/auth` – sign in / sign up.
  - `/account` – show plan, mock upgrade to Pro, and gated content.
- Keep everything within Supabase free tier and **mock** any billing logic.

## 2. Supabase Schema & RLS

> The actual SQL is stored in `docs/phase-2-auth-subscriptions.md`. Here we capture how it was used.

### 2.1. `profiles` Table
- In Supabase SQL editor, we executed SQL to create `public.profiles`:
  - Columns:
    - `id uuid primary key references auth.users(id)` on delete cascade.
    - `email text`.
    - `subscription_plan text not null default 'free'`.
    - Timestamps (`created_at`, `updated_at`).
- Rationale:
  - Keep subscription state separate from `auth.users` but tied by `id`.
  - Make it easy to gate features later by checking `subscription_plan`.

### 2.2. RLS Policies
- Enabled Row Level Security on `profiles`.
- Added policies so each logged-in user can only see and modify their own row:
  - `select`: `auth.uid() = id`.
  - `insert`: allow insert where `auth.uid() = id`.
  - `update`: allow update where `auth.uid() = id`.
- This matches the “secure by design” requirement from the PRD.

## 3. Frontend Supabase Client & Env

### 3.1. Installing Supabase JS
- From the frontend app folder:
  - `cd taskvault-frontend`
  - `npm install @supabase/supabase-js`

### 3.2. Environment Variables
- Created `.env.local` (based on `.env.local.example`) in `taskvault-frontend/` with:
  - `NEXT_PUBLIC_SUPABASE_URL=...` (project URL from Supabase settings).
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...` (the anon public key).
- These are **public** values; private service keys remain only in `backend/.env`.

### 3.3. Supabase Client Module
- File: `taskvault-frontend/lib/supabaseClient.ts`.
- Implementation:
  - Imports `createClient` from `@supabase/supabase-js`.
  - Reads env vars at module load:
    ```ts
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local"
      );
    }
    
    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
    ```
- **Reasoning**:
  - Fails fast if env is misconfigured instead of silently breaking auth.

## 4. `/auth` Page – Sign In / Sign Up

### 4.1. Basic Auth Logic
- File: `taskvault-frontend/app/auth/page.tsx`.
- Client component (`"use client"`) using React state for:
  - `email`, `password`.
  - `mode` (`"signin" | "signup"`).
  - `message` for success/error feedback.
  - `loading` flag while the request is in flight.
- On submit:
  - Chooses Supabase function based on mode:
    - `supabase.auth.signInWithPassword({ email, password })`.
    - `supabase.auth.signUp({ email, password })`.
  - Handles `error` and sets a user-friendly `message`:
    - For sign-in: `"Signed in successfully"`.
    - For sign-up: `"Check your inbox to confirm."`.
  - Catches unexpected errors and shows a generic fallback message.

### 4.2. UI & Layout
- Built a two-column layout:
  - Left: brand copy, gradient heading, three value cards (Free tier, Secure by design, Phase-based build).
  - Right: animated auth card with tabs for Sign in / Sign up.
- Styling details:
  - Dark gradient background using Tailwind (`bg-gradient-to-b from-slate-950 ...`).
  - Card with accent strip (`bg-gradient-to-r from-accent via-blue-400 to-fuchsia-500`).
  - Clean form controls with focus rings on the accent color.
  - Used `framer-motion` for subtle entrance animations on both columns.
- Later tuning:
  - Increased font sizes and spacing so the page feels more "full" on desktop.
  - Added a responsive scale transform (`md:scale-[1.5]`) on the main grid to match the visual density you wanted.

## 5. `/account` Page – Plan View & Mock Upgrade

### 5.1. State Model
- File: `taskvault-frontend/app/account/page.tsx`.
- Defined a small state machine:
  ```ts
  type Plan = "free" | "pro";

  type State =
    | { status: "loading" }
    | { status: "signed_out" }
    | { status: "ready"; email: string | null; plan: Plan };
  ```
- React state:
  - `state` for the account view.
  - `updating` for the Mock upgrade button.
  - `signingOut` for the Sign out button.

### 5.2. Loading User & Profile
- On mount, `useEffect`:
  1. Calls `supabase.auth.getUser()`.
     - If `user` is null → sets `state = { status: "signed_out" }`.
  2. If signed in:
     - Queries `profiles`:
       ```ts
       const { data, error } = await supabase
         .from("profiles")
         .select("subscription_plan, email")
         .eq("id", user.id)
         .maybeSingle();
       ```
     - Logs any `error` to console but keeps going.
     - Computes:
       ```ts
       const plan = (data?.subscription_plan as Plan) ?? "free";
       const email = ((data?.email as string | null) ?? user.email) ?? null;
       ```
     - If `data` is missing, inserts a new profile row with `free` plan:
       ```ts
       if (!data) {
         await supabase
           .from("profiles")
           .insert({ id: user.id, email, subscription_plan: plan });
       }
       ```
     - Finally sets `state = { status: "ready", email, plan }`.

### 5.3. Mock Upgrade to Pro
- `mockUpgradeToPro` handler:
  - Only runs if `state.status === "ready"`.
  - Sets `updating = true`, then:
    ```ts
    const { error } = await supabase
      .from("profiles")
      .update({ subscription_plan: "pro" })
      .eq("email", state.email ?? "");
    ```
  - On success, updates local state so the UI immediately switches to Pro.
  - Finally sets `updating = false`.
- UI:
  - Side-by-side Free and Pro cards, with the Pro card visually highlighted when active.
  - A "Pro-only preview" section that changes copy depending on `plan`.

### 5.4. Sign-out Flow
- Added after initial implementation to close the auth loop.
- Uses Next.js router + Supabase sign-out:
  ```ts
  const router = useRouter();

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      setState({ status: "signed_out" });
      router.push("/auth");
    } finally {
      setSigningOut(false);
    }
  }
  ```
- Exposed as a `Sign out` button in the account header.
- When signed out and visiting `/account`, the page shows a friendly message and a link back to `/auth`.

## 6. Tailwind & Styling Issues (and Fixes)

### 6.1. Symptom – Auth Page Looked "Unstyled"
- Problem:
  - `/auth` rendered the correct HTML but looked almost like plain HTML with tiny fonts and no background.
  - This suggested Tailwind utilities were not being applied correctly in the running app.

### 6.2. Root Causes
- Two main contributors:
  1. **Tailwind v4 + `@tailwindcss/postcss` plugin combo** from earlier experiments.
  2. **Workspace root confusion**:
     - There is a root-level `package.json` and `package-lock.json` as well as ones inside `taskvault-frontend/`.
     - Next.js 16 warned that it was inferring the workspace root from the top-level lockfile.

### 6.3. Final Fix – Migrate to Tailwind v3 Setup in the App
- We simplified and stabilized the setup by treating `taskvault-frontend` as the real app and using standard Tailwind v3 tooling there:
  - `taskvault-frontend/package.json` dependencies now include:
    - `tailwindcss@^3.4.15`
    - `postcss@^8.4.47`
    - `autoprefixer@^10.4.20`
  - `taskvault-frontend/postcss.config.js` was updated to:
    ```js
    module.exports = {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    };
    ```
- After `npm install` and `npm run dev`, Tailwind styles applied correctly on `/auth` and `/account`.
- The root-level lockfile still produces a **warning**, but it does not block builds or styling anymore.

## 7. TypeScript & Build Validation

### 7.1. Type Error in `/account`
- Running `npm run build` initially failed with:
  - `Type 'string | undefined' is not assignable to type 'string | null'.`
- Cause:
  - The computed `email` variable could be `undefined` but the `State` type expected `string | null`.
- Fix:
  - Normalized `email` to always be `string | null`:
    ```ts
    const email = ((data?.email as string | null) ?? user.email) ?? null;
    ```
  - This satisfied the type checker and clarified the possible states.

### 7.2. Final Production Build
- From `taskvault-frontend/` we ran:
  - `npm run build`
- Result:
  - Next.js compiled successfully.
  - TypeScript checks passed.
  - Routes `/`, `/auth`, `/account`, and `_not-found` were prerendered as static pages.

## 8. Manual Validation Checklist (What We Tested)

- **Backend**
  - Re-ran the Python snippet using `check_supabase_connection()` and confirmed:
    - `SUPABASE_OK = True` and a 200 response from Supabase Auth.

- **Auth flows**
  - Visited `/auth` and:
    - Created a new user via **Sign up**.
    - Signed in using **Sign in** with email/password.

- **Account & profiles**
  - Went to `/account` while signed in:
    - Verified that "Signed in as" showed the correct email.
    - Confirmed a `profiles` row exists in Supabase with matching `id` and `email`.
  - Clicked **Mock upgrade to Pro**:
    - The plan badge updated to **Pro plan**.
    - After refresh, the plan remained **Pro**, confirming DB persistence.

- **Sign out**
  - On `/account`, clicked **Sign out**:
    - User was redirected back to `/auth`.
    - Visiting `/account` again showed the "You are not signed in" message with a link back to `/auth`.

## 9. Phase 2 Summary

By the end of Phase 2, TaskVault has:
- A fully wired Supabase Auth integration on the frontend using public env vars.
- A `profiles` table with RLS enforcing per-user access.
- A polished `/auth` experience with sign in, sign up, and institute-style UI.
- An `/account` screen that:
  - Shows the signed-in user.
  - Models `free` vs `pro` plan state in Supabase.
  - Includes a mock upgrade flow and pro-gated content area.
  - Provides a clean **Sign out** action.
- A passing production build (`npm run build`) and manual validation of all critical flows.

This completes Phase 2 in a way that is secure, testable, and ready for future phases like workflow management, team management, and analytics.
