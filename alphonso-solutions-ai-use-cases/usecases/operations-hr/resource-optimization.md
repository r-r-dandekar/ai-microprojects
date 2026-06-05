# Resource Optimisation

**Phase:** Operations & HR
**Estimated Time Saved:** ~60%
**Software Solution:** ✅ Yes

---

## The Problem

At a 10–50 person agency running multiple projects simultaneously, resource allocation is managed with spreadsheets and Slack messages. The result is that developers are quietly overallocated (on paper 80% on two projects, in practice 110% on both), team members are pulled between projects at the wrong moment (mid-feature), and new project proposals are quoted with resources that aren't actually available at that point in time. No one has a live, accurate view of who is available, when, and for what. Leadership makes resourcing decisions based on gut feel and incomplete information.

---

## AI-Native Workflow

> **Pipeline:** Daily data sync → AI models capacity against pipeline → flags overallocation → suggests assignments → alerts when new project timing conflicts

**Steps:**

1. ⚡ **Trigger** — Daily at 9am, or immediately when a new project is added to the pipeline
2. 🔗 **Integration** — n8n pulls current data:
   - Linear: team member assignments, sprint loads, estimated hours remaining per project
   - CRM: pipeline projects with expected start dates and estimated team size
   - HR/leave calendar: planned leave, public holidays
3. 🤖 **AI** — GPT-4o models capacity: for each team member, calculates available hours per week over the next 12 weeks after accounting for current commitments and leave
4. 🤖 **AI** — Claude generates a Resource Brief: current allocation status per person (utilisation %), upcoming capacity windows, bottlenecks (who is the constraint?), and specific risks (e.g., "Developer A is the only person who knows Stripe integrations, and they are 100% allocated through Q3")
5. 🤖 **AI** — When a new project is being scoped: Claude recommends the optimal team composition and start date based on current capacity, skills required, and leave patterns
6. 👤 **Human Override Point** — Founder/lead reviews the Resource Brief weekly, makes assignment decisions, and confirms new project start dates. Any override is logged with a reason.
7. 🔗 **Integration** — Approved assignments are synced back to Linear as team member assignments

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **GPT-4o** | Capacity modelling and constraint optimisation |
| **Claude** | Resource narrative, risk identification, team composition recommendations |
| **n8n** | Daily data sync from Linear, CRM, and calendar |
| **Linear API** | Source of current project loads and assignments |

---

## Prompt Templates

### Generate Resource Brief
```
You are an operations analyst at Alphonso Solutions.

Analyse the following team capacity data and produce a Resource Brief.

Current date: [DATE]
Planning horizon: [12 weeks from today]

Team roster:
[LIST: Name | Role | Skills | Leave planned]

Current project assignments:
[LIST: Project | Team members assigned | Hours remaining | Expected completion]

Pipeline projects (not yet started):
[LIST: Project | Expected start | Estimated team size | Required skills | Contract value]

Produce a Resource Brief:

1. **Capacity Overview** — table: Name | Current utilisation % | Available hours/week next 4 weeks

2. **Overallocation Risks** — anyone above 90% utilisation for 2+ consecutive weeks

3. **Skill Bottlenecks** — skills with only 1 available person, and which upcoming projects need them

4. **Pipeline Feasibility** — for each pipeline project, can we staff it at the requested start date? If not, what is the earliest feasible start?

5. **Recommended Assignments** — for the next project to start, suggest the optimal team composition with reasoning

6. **Actions Required** — specific decisions that need to be made this week to avoid future bottlenecks
```

---

## 🛠 Software Solution

### What It Does
A capacity planning dashboard that gives leadership a live view of team utilisation, identifies allocation risks before they become problems, and recommends optimal team compositions for incoming projects.

### Suggested Stack
- **Frontend:** Next.js — capacity Gantt chart (per person, 12-week view), utilisation heatmap, pipeline view
- **Backend:** Supabase — team records, project assignments, capacity snapshots
- **AI Layer:** GPT-4o API (modelling) + Claude API (narrative/recommendations)
- **Automation:** n8n — daily sync from Linear + CRM
- **Integrations:** Linear API, CRM API (pipeline), Google Calendar API (leave)

### Key Features
- 12-week rolling Gantt view: who is working on what, when they free up
- Utilisation colour coding: green (<80%), amber (80–95%), red (>95%)
- "What if" simulator: add a new project to the pipeline and see the capacity impact before committing
- Skill matrix overlay: see which projects would be understaffed given current team skills
- Proactive Slack alert when a team member is projected to exceed 95% utilisation
