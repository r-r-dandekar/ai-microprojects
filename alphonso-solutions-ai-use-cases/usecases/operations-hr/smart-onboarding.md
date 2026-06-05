# Smart Onboarding

**Phase:** Operations & HR
**Estimated Time Saved:** ~70%
**Software Solution:** ❌ No

---

## The Problem

When a new team member joins Alphonso, their onboarding is an informal, improvised experience that depends on who happens to have time. A senior developer spends several hours explaining the same tools, processes, and codebase conventions they've explained to every previous hire. Documentation for "how things work here" either doesn't exist or is scattered across Notion pages that haven't been updated in a year. New hires take 2–4 weeks to become productive, and they frequently ask the same questions repeatedly because there's no structured way to find answers on their own.

---

## AI-Native Workflow

> **Pipeline:** New hire confirmed → AI generates personalised onboarding plan → 30-day structured ramp → AI answers day-to-day questions → check-in at day 30

**Steps:**

1. ⚡ **Trigger** — Offer letter accepted; new hire record created in HR system
2. 🤖 **AI** — Claude generates a personalised 30-day onboarding plan based on the hire's role, seniority, and the current tech stack being used. Plan includes: daily goals for week 1, weekly milestones for weeks 2–4, first tasks to complete independently, and key people to meet.
3. 🔗 **Integration** — Onboarding plan is shared with the new hire and their manager. Calendar invites are automatically created for key check-ins and introductory calls.
4. 🤖 **AI** — During the onboarding period, the new hire has access to an AI onboarding assistant (powered by the Living Knowledge Base) that can answer questions about processes, tools, codebase patterns, and team norms — without interrupting a senior colleague
5. 🤖 **AI** — At day 15 and day 30, Claude generates a check-in questionnaire for the new hire and their manager. Responses are synthesised into a progress summary.
6. 👤 **Human Override Point** — Manager reviews the onboarding plan before sharing it, and reviews the day-30 progress summary to identify gaps or concerns
7. 🤖 **AI** — If knowledge gaps are identified in check-ins (questions that the AI couldn't answer), Claude flags these to the team lead as documentation tasks for the Knowledge Base

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude** | Onboarding plan generation, check-in questionnaires, progress summaries |
| **n8n** | New hire trigger → plan generation → calendar creation → check-in scheduling |
| **Notion** | Onboarding plan delivery and day-to-day reference |
| **Living Knowledge Base** | AI Q&A assistant for the new hire's day-to-day questions |
| **Google Calendar API** | Automated check-in and intro call scheduling |

---

## Prompt Templates

### Generate 30-Day Onboarding Plan
```
You are creating a personalised onboarding plan for a new team member at Alphonso Solutions, a software agency.

New hire: [NAME]
Role: [JOB TITLE]
Seniority: [Junior / Mid / Senior]
Start date: [DATE]
Manager: [MANAGER NAME]
Current active projects they will join: [PROJECT NAMES AND BRIEF DESCRIPTIONS]
Tech stack in use: [LIST]

Generate a 30-day onboarding plan with:

**Week 1 — Orientation (Daily Goals)**
Day 1: ...
Day 2: ...
Day 3: ...
Day 4: ...
Day 5: ...

**Week 2 — Immersion**
Goals for the week (3-4 bullet points). First independent task to complete.

**Week 3 — Contribution**
Goals for the week. First PR to raise.

**Week 4 — Independence**
Goals for the week. By end of week 4, they should be able to [specific capability].

**Key People to Meet** — list of names, roles, and what to discuss with each

**Tools to Set Up** — complete list of accounts, access, and configurations required

**First Solo Task** — a real, bounded task appropriate for their role and seniority that they should complete independently by end of week 2

**30-Day Success Criteria** — 3 specific, observable outcomes that indicate a successful onboarding
```

---

## Notes

- The single biggest time saver is a well-maintained Living Knowledge Base. The onboarding AI assistant is only as good as the documentation it can access — invest in the Knowledge Base first.
- Record a Loom walkthrough of the dev environment setup and the first deployment process. This eliminates the most time-consuming part of week 1 for both the new hire and the senior dev.
- Collect questions that the new hire's AI assistant couldn't answer. These are the most valuable documentation gaps to fill — they're the exact things the next hire will also ask.
