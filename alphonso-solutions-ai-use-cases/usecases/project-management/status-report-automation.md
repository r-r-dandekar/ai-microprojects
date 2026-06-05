# Status Report Automation

**Phase:** Project Management
**Estimated Time Saved:** ~90%
**Software Solution:** ✅ Yes

---

## The Problem

Every Friday, someone at Alphonso manually opens GitHub, Linear, and Slack, reads through a week's worth of commits and task updates, synthesises what happened into a coherent narrative, and writes a client-facing status report. This takes 60–90 minutes per project per week. For a team running 3–4 simultaneous projects, that's half a day of a senior person's time consumed by data aggregation — work that produces zero technical value and that AI can do in 30 seconds.

---

## AI-Native Workflow

> **Pipeline:** Weekly trigger fires → AI pulls data from GitHub, Linear, and Slack → drafts report → PM reviews → sends

**Steps:**

1. ⚡ **Trigger** — Scheduled: every Friday at 4pm (or configurable per project)
2. 🔗 **Integration** — n8n pulls the week's data:
   - GitHub: merged PRs, commit summaries, open PRs
   - Linear: completed tasks, in-progress tasks, blocked tasks, upcoming milestone status
   - Slack: project channel messages flagged as updates or decisions (via keyword/reaction filter)
3. 🤖 **AI** — Gemini Pro ingests all data sources simultaneously and identifies: the week's key technical achievements, current blockers, milestone progress vs. plan, and any discrepancies between completed code and reported task status
4. 🤖 **AI** — Claude drafts the client-facing status report using the client's preferred format (stored in the tool): Win of the Week, Progress Summary, Current Status (RAG: Red/Amber/Green), Blockers, Next Week's Plan, and any decisions needed from the client
5. 🤖 **AI** — Claude adjusts the tone for the specific client (technical / non-technical, formal / informal — stored in the client profile)
6. 👤 **Human Override Point** — PM reads the draft in under 5 minutes: confirms accuracy, adds any context from client calls or off-channel conversations, approves
7. 🔗 **Integration** — Report is sent via email or posted to the client's Slack channel. A copy is saved to Notion and linked to the project record.

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Gemini Pro** | Multi-source data ingestion — GitHub + Linear + Slack simultaneously |
| **Claude** | Report drafting with client-specific tone adjustment |
| **n8n** | Scheduled trigger + data collection from all integrations |
| **Linear API + GitHub API** | Task and commit data sources |

---

## Prompt Templates

### Draft Weekly Status Report
```
You are a project manager at Alphonso Solutions, a fixed-price software agency.

Draft a weekly client status report based on the following data.

Project: [PROJECT NAME]
Client: [CLIENT NAME]
Client communication style: [TECHNICAL / NON-TECHNICAL] [FORMAL / INFORMAL]
Project phase: [CURRENT PHASE — e.g., "Sprint 3 of 5, Build phase"]
Reporting week: [DATE RANGE]

GitHub activity this week:
[PASTE MERGED PR LIST AND COMMIT SUMMARIES]

Linear task updates:
[PASTE COMPLETED TASKS, IN-PROGRESS TASKS, BLOCKED TASKS]

Milestone status:
[PASTE MILESTONE DATES AND CURRENT STATUS]

Write a status report with these sections:

## 🏆 Win of the Week
One sentence on the most significant achievement. Make it tangible.

## Progress Summary
3-5 bullet points. Each bullet = one concrete thing completed.

## Project Status
Overall RAG status: Green / Amber / Red
One sentence explanation.

## Current Blockers
Any items blocking progress. If none: "No blockers."

## Next Week's Plan
3-5 bullet points on what will be completed next week.

## Decisions Needed
Any decisions the client needs to make that are on the critical path.

Tone: [match the client communication style]. Be direct. Do not pad.
```

---

## 🛠 Software Solution

### What It Does
An automated reporting pipeline that connects to GitHub, Linear, and Slack, aggregates weekly project data, generates a draft report per project, and presents it for PM review and one-click send.

### Suggested Stack
- **Frontend:** Next.js — report review dashboard, client profile manager, send history
- **Backend:** Supabase — project configs, client profiles, report archive
- **AI Layer:** Gemini Pro API (data analysis) + Claude API (report writing)
- **Automation:** n8n — Friday schedule → data collection → report generation → Slack/email draft
- **Integrations:** GitHub API, Linear API, Slack API (read), Gmail API or Slack (send)

### Key Features
- Per-project report template — different clients have different preferred formats
- Client communication profile — tone, technical level, preferred length, specific things to always / never mention
- One-click approve and send from the review dashboard
- Report archive — full history of every report sent, searchable
- Discrepancy detection — flags when completed code (commits) doesn't match reported task status
