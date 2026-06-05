# Project Scaffolding

**Phase:** Build
**Estimated Time Saved:** ~90%
**Software Solution:** ✅ Yes

---

## The Problem

Every new Alphonso project starts the same way: a senior developer spends 4–8 hours setting up the project structure, configuring linting, setting up the database connection, wiring up authentication, configuring environment variables, and establishing the CI/CD pipeline. This work is pure overhead — it creates no value for the client and produces the same output every time. Worse, when done manually it introduces subtle configuration drift: different projects have slightly different folder structures, different linting rules, different auth patterns. This drift compounds into technical debt and makes it harder for developers to context-switch between projects.

---

## AI-Native Workflow

> **Pipeline:** Project approved → developer describes stack → scaffolding CLI generates Alphonso-standard project in under 5 minutes → first commit

**Steps:**

1. ⚡ **Trigger** — Project kicks off; developer opens the Alphonso Scaffolding CLI
2. 👤 **Human Override Point** — Developer fills in the project config: project name, tech stack, auth provider, database, external integrations, and any special requirements from the PRD
3. 🤖 **AI** — Claude API (or Cursor Composer) generates the complete project structure based on Alphonso's standard templates: folder hierarchy, `package.json`, `tsconfig.json`, `.env.example`, linting config, CI workflow file, and base components
4. 🤖 **AI** — Database schema is generated from the PRD's data model section: Supabase migration files, TypeScript types, and seed data
5. 🤖 **AI** — Authentication setup is generated for the selected provider (Supabase Auth, Clerk, Auth0): login/logout flows, protected routes, session management
6. 🔗 **Integration** — Generated project is initialised as a Git repo, initial commit is made, and a GitHub repository is created with branch protection rules applied
7. 👤 **Human Override Point** — Developer runs `npm install && npm run dev` to verify the scaffold boots cleanly, reviews the generated structure, and confirms it matches the PRD

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Cursor (Composer)** | Multi-file generation from a single description within the editor |
| **Claude API** | Generating config files and schema from PRD data model |
| **n8n / Custom CLI** | Orchestrating the full generation pipeline end-to-end |
| **GitHub API** | Repo creation, branch protection, initial commit |

---

## Prompt Templates

### Generate Project Structure
```
You are a senior full-stack developer at Alphonso Solutions, a software agency.

Generate a complete project scaffold for a new project.

Project: [PROJECT NAME]
Stack: [TECH STACK — e.g., Next.js 14 App Router, Supabase, Tailwind CSS, TypeScript]
Auth: [AUTH PROVIDER — e.g., Supabase Auth / Clerk]
Key integrations: [LIST — e.g., Stripe, Resend, Google Maps]
Special requirements from PRD: [ANY NOTES]

Generate:
1. Folder structure (annotated tree)
2. package.json dependencies
3. tsconfig.json
4. .env.example with all required variables and comments
5. ESLint + Prettier config following Alphonso's standards (no unused vars, consistent imports, Tailwind class sorting)
6. GitHub Actions CI workflow (lint, typecheck, test on every PR)
7. Base layout components: RootLayout, AuthLayout, DashboardLayout
8. Supabase client initialisation (server + client side)
9. Base auth hooks: useSession, useUser

Follow Next.js 14 App Router conventions. Use TypeScript throughout. No any types.
```

### Generate Database Schema from PRD
```
Based on the following PRD data model requirements, generate a Supabase migration file.

Project: [PROJECT NAME]
PRD data model section:
[PASTE DATA MODEL / ENTITY DESCRIPTIONS FROM PRD]

Generate:
1. SQL migration file (Supabase-compatible)
2. Row Level Security (RLS) policies for each table
3. TypeScript types matching the schema
4. A brief comment on any normalisation decisions made

Follow Postgres best practices. Use UUIDs as primary keys. Include created_at and updated_at on all tables.
```

---

## 🛠 Software Solution

### What It Does
An internal CLI + web-based configuration wizard that generates Alphonso-standard project scaffolds. Enforces consistent architecture, coding standards, and tooling across every new project.

### Suggested Stack
- **CLI:** Node.js CLI (published as an internal npm package or binary)
- **Config UI:** Simple Next.js form for non-CLI users
- **Templates:** Stored as versioned template files in a private repo
- **AI Layer:** Claude API for schema generation and dynamic config
- **Integrations:** GitHub API (repo creation), Supabase Management API (project creation)

### Key Features
- Stack presets: "Next.js + Supabase + Tailwind (standard)", "React Native + Expo + Supabase", etc.
- Template versioning — update the master template and all new projects get the latest standards
- Post-scaffold checklist — generated README with setup steps specific to the chosen stack
- Integration stubs — selected integrations (Stripe, Resend, etc.) are pre-wired with empty service files and correct environment variables
