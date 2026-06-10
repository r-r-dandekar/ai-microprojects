# Setup & Deployment Guide

## Prerequisites
- Node.js 18+ (for running tests only)
- A Supabase account (free tier is sufficient)
- A Netlify account (free tier is sufficient)

---

## 1. Supabase Database Setup

### 1.1 Create a project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**, choose a name and region, set a database password
3. Wait for the project to provision (~2 minutes)

### 1.2 Create the contacts table
In the Supabase dashboard, go to **SQL Editor** and run:

```sql
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

### 1.3 Enable Row Level Security
Still in the SQL Editor, run:

```sql
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts"
ON contacts
FOR INSERT
TO anon
WITH CHECK (true);
```

### 1.4 Copy your credentials
Go to **Project Settings → API** and copy:
- **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
- **anon / public** key

---

## 2. Configure the Website

1. Create a `.env` file in the `website/` folder (copy from `.env.example`):

```
SUPABASE_URL = https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY = your-anon-key-here
```

> ⚠️ The URL should be the base project URL only — no trailing `/rest/v1/`.

2. Run the config generator to produce `js/config.js`:

```
npm run build-config
```

Both `.env` and `js/config.js` are listed in `.gitignore` — neither will be committed to version control.

---

## 3. Run Locally

The site uses ES modules, so it must be served via HTTP (not opened as a file directly).

**Option A — npx serve (no install needed):**
```
npx serve .
```
Then open http://localhost:3000

**Option B — VS Code Live Server:**
Right-click `index.html` → Open with Live Server

---

## 4. Run Tests

```
npm install
npm test
```

All 8 tests should pass. Tests cover the Supabase client module only and do not require a live Supabase connection.

---

## 5. Deploy to Netlify

**Option A — Drag and drop (fastest):**
1. Go to [netlify.com](https://netlify.com) and log in
2. Go to **Sites → Add new site → Deploy manually**
3. Drag the entire `website/` folder onto the deploy area
4. Your site is live at a `*.netlify.app` URL immediately

**Option B — Git deploy (recommended for updates):**
1. Push the repo to GitHub
2. In Netlify: **Add new site → Import an existing project**
3. Connect your GitHub repo
4. Set **Base directory** to `website`
5. Leave Build command and Publish directory blank (static site)
6. Deploy

> To attach a custom domain later: **Site settings → Domain management → Add custom domain**
