# Delivery Risk Dashboard

**Phase:** Project Management
**Estimated Time Saved:** ~70%
**Software Solution:** ✅ Yes

---

## The Problem

In a fixed-price model, missing a delivery date is not just a relationship problem — it is a financial one. PMs currently identify delivery risks by gut feel: they notice the team seems busy, a milestone was quietly pushed, or a developer mentions a blocker in passing. By the time the risk is visible, it is often too late to take corrective action without a difficult client conversation. There is no systematic way to predict, weeks in advance, that a milestone is at risk based on the team's actual velocity versus the original estimates.

---

## AI-Native Workflow

> **Pipeline:** Daily data sync → AI calculates velocity and models delivery probability → PM receives proactive risk alerts → corrective action taken weeks ahead of the deadline

**Steps:**

1. ⚡ **Trigger** — Scheduled: daily at 8am
2. 🔗 **Integration** — n8n pulls current project data from Linear: tasks completed this week, tasks remaining, blockers, team assignments
3. 🤖 **AI** — GPT-4o compares actual velocity (tasks completed per day) against the original Feature Estimation breakdown. Calculates:
   - Current burn rate vs. required burn rate to hit the next milestone
   - Predicted completion date for each milestone at current velocity
   - Probability (%) of hitting each milestone on time
4. 🤖 **AI** — Claude produces a Risk Brief: which milestones are at risk, the specific bottlenecks driving the risk (e.g., "Backend tasks are running 30% over estimate"), and 3 re-prioritisation options with their trade-offs
5. 🔗 **Integration** — If a milestone has <70% on-time probability, a Slack alert is sent to the PM and project lead. The dashboard is updated.
6. 👤 **Human Override Point** — PM reviews the Risk Brief and decides on the response: re-prioritise tasks, adjust scope (change request), communicate proactively with the client, or add resource. This decision is logged.
7. 🔗 **Integration** — If a client communication is needed, the status report tool is triggered to draft an early update

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **GPT-4o** | Velocity calculation and probabilistic milestone modelling |
| **Claude** | Risk narrative and re-prioritisation recommendations |
| **Linear API** | Task completion data, velocity tracking |
| **n8n** | Daily data sync, Slack alerts |

---

## Prompt Templates

### Generate Milestone Risk Analysis
```
You are a project risk analyst at Alphonso Solutions, a fixed-price software agency.

Analyse the following project data and identify delivery risks.

Project: [PROJECT NAME]
Contract delivery date: [DATE]
Current date: [TODAY'S DATE]

Original feature estimates (from scoping):
[PASTE TASK BREAKDOWN WITH ESTIMATED HOURS — Feature | Estimated Hours | Discipline]

Actual progress to date:
[PASTE COMPLETED TASKS WITH ACTUAL HOURS — Task | Actual Hours | Completed Date]

Current remaining work:
[PASTE REMAINING TASKS — Task | Estimated Hours | Status | Assignee]

Current blockers:
[LIST ANY BLOCKED TASKS AND REASON]

Calculate and report:
1. Actual velocity: average hours of work completed per working day
2. Required velocity: hours per day needed to hit the delivery date
3. Velocity gap: are we ahead, on track, or behind?
4. Milestone breakdown: for each milestone, predicted completion date at current velocity and on-time probability (%)
5. Top 3 risk factors: what is driving the delay (e.g., specific features over-running, blockers, specific disciplines)
6. Re-prioritisation options: 3 ways to recover the timeline, each with the trade-off (what gets de-scoped or pushed)

Be specific. Use numbers.
```

---

## 🛠 Software Solution

### What It Does
A live project health dashboard that tracks velocity against estimates, calculates milestone delivery probabilities, and proactively alerts the PM to risks — not after a milestone is missed, but 2–3 weeks before it would be missed at the current rate.

### Suggested Stack
- **Frontend:** Next.js — dashboard with per-project milestone timeline, velocity chart, risk indicators (RAG), and blocker list
- **Backend:** Supabase — project records, daily velocity snapshots, risk alerts history
- **AI Layer:** GPT-4o API (velocity modelling) + Claude API (risk narrative)
- **Automation:** n8n — daily Linear sync + AI analysis + Slack alert
- **Integrations:** Linear API (task data), Slack API (alerts), Feature Estimation tool (original estimates)

### Key Features
- Timeline visualisation: planned vs. predicted completion dates per milestone
- Velocity burn chart: daily actual vs. required velocity
- Configurable alert thresholds (e.g., alert when milestone probability drops below 75%)
- Decision log — record every risk response and whether it worked
- Cross-project view — leadership can see all active projects' health at a glance
