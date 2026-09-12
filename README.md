# CIC Convocation Ceremony — Check-In App

A real, working QR check-in system: one QR code, a name search, and instant
verified check-in against your 16 authorized participants. Built with React,
TypeScript, Vite, Tailwind CSS, and Supabase.

This guide assumes no prior developer experience. Follow the steps in order —
don't skip any.

---

## What you're setting up

- **`/`** — the check-in screen the Leader uses after scanning the QR code.
- **`/qr`** — the page showing the one QR code, with a print button.
- **`/login`** and **`/dashboard`** — the password-protected Leader Dashboard.

---

## Step 1 — Place the real CIC logo

The project ships with a **placeholder** logo at `src/assets/cic-logo.jpg` so
it builds and runs immediately. Replace it with your real file:

1. Rename your official logo file to exactly `cic-logo.jpg`.
2. Copy it into `src/assets/`, overwriting the placeholder.
3. That's it — no code changes needed. Every screen references this one file,
   so dropping in a higher-resolution version later is just as simple.

The logo is always displayed uncropped and undistorted (`object-contain`
inside a fixed frame), so use whatever aspect ratio your real logo has.

---

## Step 2 — Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in (or create a free
   account).
2. Click **New Project**.
3. Give it a name, e.g. `cic-convocation`.
4. Choose a strong database password and **save it somewhere safe**.
5. Pick the region closest to your event.
6. Click **Create new project** and wait ~2 minutes for it to finish
   provisioning.

---

## Step 3 — Run the database schema

1. In your Supabase project, open the left sidebar and click **SQL Editor**.
2. Click **New query**.
3. Open the file `supabase/schema.sql` from this project, copy its entire
   contents, and paste it into the SQL editor.
4. Click **Run**.
5. You should see a success message. This creates:
   - the `participants` table, pre-filled with your 16 authorized names,
   - the `check_ins` table, with a database-level rule that makes a second
     check-in for the same person impossible,
   - the security rules (RLS) described below,
   - realtime updates for the dashboard.

To confirm it worked: click **Table Editor** in the sidebar — you should see
`participants` with 16 rows, and an empty `check_ins` table.

---

## Step 4 — Get your Supabase API keys

1. In Supabase, click the gear icon → **Project Settings** → **API**.
2. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`).
3. Copy the **anon public** key (a long string starting with `eyJ...`).

You'll paste both of these into your environment variables next.

---

## Step 5 — Set your environment variables

1. In the project folder, copy `.env.example` to a new file named `.env`.
2. Open `.env` and fill in the two values from Step 4:

   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

3. Leave `VITE_CHECKIN_URL` blank for now — you'll set it in Step 11 once you
   have a production URL.

`.env` is already in `.gitignore`, so your keys won't be committed to Git.

---

## Step 6 — Run the project on your computer

You'll need [Node.js](https://nodejs.org) (the LTS version) installed first.

1. Open a terminal in the project folder.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the app:
   ```
   npm run dev
   ```
4. Open the URL it prints (usually `http://localhost:5173`) in your browser.

You should see the check-in screen with your logo and "Convocation Ceremony."

---

## Step 7 — Create the Leader account

The dashboard is protected by a real login, using Supabase's built-in
authentication.

1. In Supabase, go to **Authentication** → **Users**.
2. Click **Add user** → **Create new user**.
3. Enter an email and password for yourself (the Leader).
4. Leave "Auto Confirm User" checked, then click **Create user**.
5. Go to `http://localhost:5173/login` in your running app and sign in with
   that email and password. You should land on `/dashboard`.

You can add more Leader accounts later the same way, if others need dashboard
access.

---

## Step 8 — Test the check-in system locally

1. Go to `http://localhost:5173/`.
2. Type part of a real name, e.g. `ze` — you should see **Zeina Ibrahim** and
   **Zeina Sokkary** appear.
3. Select one and tap **Check In** — you should see the success screen with
   the check-in time.
4. Try checking the same person in again — you should see **Already Checked
   In** with the original time, unchanged.
5. Type a name that isn't on the list, e.g. `Test Person` — you should see
   **Name Not Found**.
6. Go to `http://localhost:5173/dashboard` (signed in) and confirm the
   participant now shows as checked in, and the stats updated.

---

## Step 9 — Deploy to Vercel

1. Push this project to a GitHub repository (create one at
   [github.com/new](https://github.com/new) if needed, then follow GitHub's
   instructions to push this folder to it).
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New** → **Project**, and import your repository.
4. Vercel will auto-detect Vite — leave the build settings as default.
5. Before deploying, click **Environment Variables** and add:
   - `VITE_SUPABASE_URL` → your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key
   - `VITE_CHECKIN_URL` → leave this out for now; you'll add it in Step 10
     and redeploy.
6. Click **Deploy** and wait for it to finish.

---

## Step 10 — Get your production URL

Once deployed, Vercel shows you a URL like `https://cic-convocation.vercel.app`.

1. Copy that URL.
2. Go back to Vercel → your project → **Settings** → **Environment
   Variables**, and add/update:
   ```
   VITE_CHECKIN_URL=https://cic-convocation.vercel.app
   ```
3. Go to the **Deployments** tab and click **Redeploy** so the QR page picks
   up the URL.

---

## Step 11 — Create the ONE QR code

You don't need any external QR generator — it's built in.

1. Visit `https://your-production-url.vercel.app/qr`.
2. This page shows the single QR code, generated from your
   `VITE_CHECKIN_URL`. It encodes only that URL — nothing per-participant.
3. Click **Print this page** for a clean, print-friendly version to place at
   your event's entrance.

---

## Step 12 — Test the QR code from a phone

1. On your phone, open the camera app and point it at the printed or
   on-screen QR code.
2. Tap the notification/link that appears — it should open your check-in
   page (`/`).
3. Run through a real check-in exactly as in Step 8, on your phone, to
   confirm the whole flow works end to end before the event.

---

## How the app prevents duplicate or unauthorized check-ins

- The **participant list** in the database is the single source of truth —
  the app only lets you check in a name that exists in `participants`.
- The **`check_ins` table has a database-level unique constraint** on
  `participant_id`. Even if two devices tried to check the same person in at
  the exact same moment, Postgres itself rejects the second insert — this
  isn't just a frontend check.
- Once a check-in is recorded, there is intentionally no update/delete
  permission from the app, so the original timestamp can never be
  overwritten by a later attempt.

---

## Security notes

- The Supabase **anon public key** is safe to use in frontend code — it's
  designed for that, and Row Level Security (RLS) policies (in
  `supabase/schema.sql`) define exactly what it's allowed to do: read the
  roster, read check-ins, and insert a new check-in. It cannot edit the
  roster or modify an existing check-in.
- Never use your Supabase **service role key** in this app — it's not
  referenced anywhere in the code, and you should never paste it into a
  frontend environment variable.
- The Leader Dashboard route is gated by a real Supabase Auth session
  (Step 7). Only accounts you create in Supabase Authentication can sign in.

---

## Project structure

```
src/
  assets/
    cic-logo.jpg          ← replace this with your real logo
  components/
    Logo.tsx
    NameAutocomplete.tsx
    StatusScreens.tsx      (Success / Not Found / Already Checked In)
    DashboardStats.tsx     (StatCard, ProgressRing)
    ParticipantRow.tsx
    ProtectedRoute.tsx
  pages/
    CheckInPage.tsx        → "/"
    LoginPage.tsx          → "/login"
    DashboardPage.tsx      → "/dashboard" (protected)
    QRPage.tsx             → "/qr"
  hooks/
    useCheckIn.ts
    useDashboard.ts
    useAuth.ts
  lib/
    supabase.ts
  types/
    index.ts
supabase/
  schema.sql               ← run this once in the Supabase SQL editor
```

---

## Testing checklist before the event

- [ ] Real `cic-logo.jpg` is in place and displays sharp and undistorted
- [ ] `.env` (local) and Vercel environment variables are both set correctly
- [ ] All 16 names appear correctly in the Supabase `participants` table
- [ ] Searching partial names (e.g. "ze", "ma") returns the right matches
- [ ] A successful check-in shows the correct name and time
- [ ] Checking the same person in twice shows "Already Checked In" with the
      original time
- [ ] An unlisted name shows "Name Not Found" and is not recorded
- [ ] The Leader Dashboard totals, progress ring, and list update
      immediately after each check-in
- [ ] Dashboard search and filters (All / Checked In / Not Checked In) work
- [ ] The `/qr` page's QR code, scanned from a real phone, opens the
      production check-in page
- [ ] The printed QR page looks clean on paper
