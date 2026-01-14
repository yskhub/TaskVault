# TaskVault – Manual Testing Guide on Vercel

URL: https://task-vault-coral.vercel.app

This guide explains how to manually test the live TaskVault deployment as:
- A **new user** (first‑time visitor)
- An **admin user** (able to manage team and Pro features)

Use a modern desktop browser (Chrome, Edge, or Firefox) for the best results.

---

## 1. First‑Time / New User Flow

### 1.1. Landing page (home)

1. Open the Vercel URL in your browser:
   - `https://task-vault-coral.vercel.app`
2. Verify the landing page:
   - Hero title and description are clearly readable on the dark background.
   - Top‑right header shows **“Sign in / Sign up”** and **“Go to dashboard”**.
   - Just under that, a toggle with **“Dots / Terrain”** selects the background.
   - Bottom‑right shows the **Quick actions** pill with the **K** key hint.
3. Test backgrounds:
   - Click **Terrain** → animated terrain background appears; content remains fully clickable.
   - Click **Dots** → returns to the dotted background.
4. Test Quick actions placement:
   - Click the **Quick actions** pill → a small popover appears just above it (bottom‑right), listing shortcuts like **Go to dashboard**, **Add team member**, etc.
   - Press `K` on the keyboard → the same popover opens.

### 1.2. Sign up as a new user

1. From the home page, click **“Sign in / Sign up”** in the header.
2. On `/auth`, confirm:
   - Left side shows marketing copy about secure workspace access.
   - Right side shows the **TaskVault Access** card.
3. In the access card:
   - Click the **Sign up** tab (if not already active).
   - Enter a **valid email** you control (e.g. a test mailbox).
   - Enter a **password with at least 6 characters**.
   - Click **Sign up**.
4. Expected behavior:
   - If input is invalid, a clear validation message appears under the field.
   - On success, a message bar at the bottom of the card says something like:
     - *“Check your inbox to confirm.”* or similar success text.
5. Switch to **Sign in** and verify you can log in with the same email/password:
   - Select the **Sign in** tab.
   - Enter the same email and password.
   - Click **Sign in**.
   - On success you should see: *“Signed in successfully”*.

> Tip: If you see an error message instead, note the exact text and which step you were on.

### 1.3. Confirm signed‑in header state

1. After signing in, refresh the home page or navigate there.
2. In the top‑right header:
   - You should now see **“Signed in as your@email”** instead of the auth button.
   - **“Go to dashboard”** remains available.
   - The **Dots / Terrain** toggle and **Quick actions** still work as before.

### 1.4. Test the Account page (Free user)

1. Go to the account page:
   - Either via a link inside the app, or by visiting `/account` directly.
2. Verify:
   - The page loads successfully (no error page from Vercel).
   - Your email is displayed.
   - Your current plan is **Free**.
   - There is a simple section that lets you **mock upgrade to Pro** and **mock downgrade to Free**.
3. As a new user, keep the default **Free** plan for now; we will upgrade later when testing admin behavior.

### 1.5. Test the Team page (Free user)

1. Navigate to `/team` (or use Quick actions → **Add team member**).
2. Confirm initial state:
   - Header explains this is for **User & team management**.
   - A card shows **Signed in as {your email}** and indicates **Free plan · 2 member limit**.
   - A usage banner shows how many seats are used/remaining.
3. Add team members as a Free user:
   - In **Member email**, enter a test email (e.g. `member1@example.com`).
   - Leave **Role** as **Member**.
   - Click **Add member**.
   - Repeat for a second email (e.g. `member2@example.com`).
4. Expected behavior:
   - Up to **2** members can be added on Free.
   - After adding 2 members, the banner and helper text mention you are near / at the limit.
   - When the limit is reached:
     - The remaining‑seats warning appears.
     - The **Add member** button is disabled and shows limit‑related text.
5. Verify the table at the bottom (**Current team**):
   - Shows each added email with role **Member**.
   - For Free plan, the **Make admin / Remove** controls are not available; instead you see a note like *“Upgrade to Pro to manage roles”*.

### 1.6. Test the Dashboard as a new user

1. Navigate to `/dashboard` (or use **Go to dashboard** from the header or Quick actions).
2. Behavior during load:
   - A skeleton loader appears (grey blocks and placeholder cards) while analytics is fetched.
   - If the backend is responsive, real charts and metrics appear.
   - If the backend is slow or unavailable for more than a few seconds, a **Dashboard unavailable** card with a clear message appears.
3. Verify text readability:
   - **Three metric cards** at the top show bright, readable labels, values, and helper text.
   - **Two insight boxes** (Completion insight, Team utilisation) have bright headings and body text.
   - Background remains dark, but all copy is easy to read.

---

## 2. Admin / Pro‑Plan Flow

In this prototype, the **admin** experience is simulated by:
- Upgrading your account to the **Pro** plan.
- Using the team page where the current user is treated as an admin.

### 2.1. Upgrade to Pro (mock)

1. Go to `/account` while signed in.
2. Locate the subscription section.
3. Click the **Upgrade to Pro** (or similarly labeled) button.
4. Expected behavior:
   - The current plan label changes to **Pro**.
   - Any text describing limits updates to **Pro** behavior.

> Note: This upgrade is **mocked** for demo purposes. It does not affect billing; it only changes what the UI allows.

### 2.2. Team page as Pro (admin capabilities)

1. Navigate back to `/team`.
2. Confirm the top of the team card now shows:
   - **Pro plan · 10 member limit**.
3. Add several members (e.g. 3–5 emails) as before:
   - You should now be able to add up to **10** members.
4. For existing members, verify admin‑level actions in the **Current team** table:
   - For **Member** rows, a **Make admin** button is visible.
   - For **Admin** rows, a **Make member** button is visible.
   - A **Remove** button is available for each member.
5. Test role changes and removal:
   - Click **Make admin** on a member → role chip changes to **Admin**.
   - Click **Make member** on an admin → role chip updates back to **Member**.
   - Click **Remove** on a member → the row disappears and the usage banner updates.
6. Error‑handling checks (optional):
   - If the backend rate‑limits or fails, a toast appears (e.g. *“Failed to add member”* or *“Too many requests”*) and the UI does not crash.

### 2.3. Dashboard as Pro user

1. While still on Pro, revisit `/dashboard`.
2. Confirm:
   - Metrics reflect any workflows/teams created so far (if analytics is wired to your backend data).
   - The **Refresh analytics** button at the bottom of the stats grid:
     - Briefly shows a loading state when clicked (page may flash skeleton or quickly re-render).
     - Either reloads data successfully or shows the **Dashboard unavailable** card if the API is still slow/unavailable.

---

## 3. Cross‑Cutting UX Checks

Run these checks both as a new user and as an admin/Pro user.

### 3.1. Backgrounds and layout

1. On any page (`/`, `/auth`, `/dashboard`, `/team`, `/account`):
   - Toggle **Dots / Terrain** and confirm the content layout never shifts unexpectedly.
2. Ensure:
   - The terrain background **never blocks clicks** (buttons and links always respond).
   - The back‑to‑home pill (top‑left) appears only on inner pages (not on the home page).

### 3.2. Quick actions behavior

1. Verify the Quick actions pill at bottom‑right:
   - Always visible on key pages.
   - Opens a small menu **adjacent to the pill** (not in the center of the screen).
2. Use each shortcut from the Quick actions popover:
   - **Go to dashboard** → navigates to `/dashboard`.
   - **Add team member** → navigates to `/team`.
   - **Upgrade plan** → navigates to `/account`.
   - **Create workflow** → navigates to `/workflows`.

### 3.3. Sign‑out and re‑sign‑in

1. Go to `/account` and use the **Sign out** control.
2. Expected behavior:
   - You are redirected back to the auth page or a similar screen.
   - Header on other pages reverts to **“Sign in / Sign up”**.
3. Sign in again via `/auth` and verify:
   - Header shows **Signed in as …**.
   - `/team`, `/dashboard`, and `/account` all load without client‑side errors.

---

## 4. What to Capture When Testing

When you test the Vercel URL, capture the following if you see issues:

- **Page URL** (e.g. `/dashboard`, `/team`).
- **Exact steps** you took just before the issue.
- **What you expected to see** vs **what you actually saw**.
- Any **error text** from the UI.
- Any **red errors in the browser console** (DevTools → Console).

Sharing that information makes it easy to reproduce and fix problems quickly.
