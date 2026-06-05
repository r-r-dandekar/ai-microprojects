# Client Acceptance Package

**Phase:** QA & Delivery
**Estimated Time Saved:** ~85%
**Software Solution:** ❌ No

---

## The Problem

At project handoff, Alphonso needs to deliver more than just working software. Clients need documentation: how to use the application, how to manage it as an admin, how to maintain it technically, and what to do when something goes wrong. Writing this documentation currently falls to the developer who built the project — who has no interest in writing it, does it reluctantly at the end of a long project, and produces output that's either too technical for the client or too thin to be useful. Handoff documentation is consistently the last thing done and the most frequently complained about by clients post-delivery.

---

## AI-Native Workflow

> **Pipeline:** Project complete → AI ingests PRD + codebase + deployment config → full acceptance package generated → developer reviews for accuracy → delivered to client

**Steps:**

1. ⚡ **Trigger** — Project is marked as complete / entering client acceptance phase
2. 🔗 **Integration** — n8n collects: the approved PRD, the git log (last 30 commits), the deployment configuration (environment variables, infrastructure), and the status report history
3. 🤖 **AI** — Claude generates the End-User Manual: feature-by-feature walkthroughs written for a non-technical user, with screenshots placeholders and step-by-step instructions
4. 🤖 **AI** — Claude generates the Admin Guide: how to manage users, configure settings, interpret the dashboard, and perform common admin tasks
5. 🤖 **AI** — Claude generates the Technical Handover document: architecture overview, environment setup instructions, deployment process, third-party service accounts required, and a runbook for common operational issues
6. 🤖 **AI** — Claude generates the Deployment Checklist: every step required to go live, with environment-specific notes
7. 👤 **Human Override Point** — Lead developer reviews all documents for technical accuracy. Adds any project-specific nuances that the AI could not derive from the artifacts. Approves the package.
8. 🔗 **Integration** — Approved documents are published to Mintlify/GitBook/Notion and a link is shared with the client

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude** | Long-form documentation generation from project artifacts |
| **n8n** | Artifact collection and document delivery pipeline |
| **Mintlify / GitBook** | Hosting the documentation with a professional, searchable UI |
| **Loom** | Optional: record short walkthrough videos to accompany written docs |

---

## Prompt Templates

### Generate End-User Manual
```
You are a technical writer at Alphonso Solutions. Write an end-user manual for a client's new software application.

Application name: [APP NAME]
Client: [CLIENT NAME]
Target reader: [DESCRIBE USER — e.g., "non-technical marketing manager, 30–50 years old, comfortable with web apps"]

PRD (Functional Specifications):
[PASTE RELEVANT PRD SECTIONS]

Write a user manual with:
1. Introduction: what the application does and who it is for (1 page)
2. Getting Started: account creation, first login, and initial setup
3. Core Features: one section per major feature from the PRD
   - What the feature does
   - Step-by-step instructions with numbered steps
   - [Screenshot placeholder: describe what the screenshot should show]
   - Common mistakes and how to avoid them
4. FAQ: 8 questions a non-technical user would ask

Tone: clear, friendly, jargon-free. Use "you" not "the user".
```

### Generate Technical Handover Document
```
You are a senior developer at Alphonso Solutions writing a technical handover document for a client who will be responsible for maintaining their application after delivery.

Application: [APP NAME]
Tech stack: [FULL STACK]
Hosting: [e.g., Vercel + Supabase]

Git log summary (last 30 commits):
[PASTE GIT LOG]

Environment variables (.env.example):
[PASTE ENV EXAMPLE]

Write a Technical Handover document covering:
1. Architecture Overview — diagram description and key components
2. Tech Stack Reference — each technology used and its role
3. Local Development Setup — step-by-step instructions to run the project locally
4. Environment Variables — what each variable does and where to find the value
5. Deployment Process — how to deploy to production (step by step)
6. Third-Party Services — list of all external services, their purpose, and where to find the credentials
7. Operational Runbook — what to do if: the site goes down, the database is unreachable, a third-party service is unavailable
8. Monitoring & Alerts — what monitoring is set up and how to interpret alerts

Assume the reader is a competent developer but not familiar with this specific codebase.
```
