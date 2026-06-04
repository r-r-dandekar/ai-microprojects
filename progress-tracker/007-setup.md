# Setup & Installation

## Prerequisites
- Node.js 18+
- A Supabase project with the schema applied (see Step 1)

---

## Step 1 — Apply the Database Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Paste and run the contents of `app/migration.sql`

This creates three tables (`departments`, `users`, `tasks`) with all constraints and indexes.

---

## Step 2 — Configure Environment Variables

The `.env` file is pre-populated at `app/.env`. If you need to change the Supabase project, update these two values:

```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

---

## Step 3 — Install Dependencies

```bash
cd app
npm install
```

---

## Step 4 — Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Step 5 — Run Tests

```bash
# Watch mode (re-runs on file changes)
npm test

# Single run
npm run test:run
```

---

## Step 6 — Build for Production

```bash
npm run build
```

Output is in `app/dist/`. Deploy this folder to Netlify or Vercel.

### Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Netlify dashboard

### Vercel
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Add env vars in Project Settings → Environment Variables

---

## Project Structure

```
app/
├── .env                         # Supabase credentials (gitignored)
├── migration.sql                # Run once in Supabase SQL Editor
├── src/
│   ├── modules/
│   │   ├── auth.ts              # Login, signup, session management
│   │   ├── departments.ts       # List and create departments
│   │   ├── tasks.ts             # Full task CRUD with permission checks
│   │   └── users.ts             # List employees by department
│   ├── contexts/
│   │   └── AuthContext.tsx      # Global auth state
│   ├── components/
│   │   ├── Layout.tsx           # Navbar + sidebar shell
│   │   ├── ProtectedRoute.tsx   # Auth guard for routes
│   │   ├── TaskModal.tsx        # Create / edit task modal
│   │   └── StatusModal.tsx      # Employee status update modal
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Tasks.tsx
│   │   └── Departments.tsx
│   └── test/
│       ├── auth.test.ts
│       ├── departments.test.ts
│       ├── tasks.test.ts
│       ├── AuthContext.test.tsx
│       ├── Dashboard.test.tsx
│       └── Tasks.test.tsx
```
