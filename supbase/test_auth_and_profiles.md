# Test 1 – Auth and Profiles

Goal: verify Supabase Auth + profiles table + /auth and /account pages.

## Steps

1. Start backend
   - From repo root: `D:/onlyai/Assignment_2/TaskVault/.venv/Scripts/python.exe -m uvicorn backend.main:app --reload`

2. Start frontend
   - From taskvault-frontend: `npm run dev`
   - Open `http://localhost:3000/` → click **Sign in / Sign up** (or go to `/auth`).

3. Sign up a new user
   - Use email like `owner@example.com` and any password.
   - In Supabase dashboard → Authentication → Users, confirm the new user exists.

4. Create or check profile row
   - Go to `/account` while logged in.
   - The app will ensure a profiles row exists for this user.
   - In Supabase → Table editor → profiles, confirm a row with this user id/email and `subscription_plan = 'free'`.

5. Toggle plan
   - On `/account`, use the UI to switch between **Free** and **Pro`.
   - Each click updates `profiles.subscription_plan`.
   - Verify in Supabase that the value changes between `free` and `pro`.

If all these steps pass, Auth + profiles are wired correctly.
