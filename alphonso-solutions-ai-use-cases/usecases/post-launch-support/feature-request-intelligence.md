# Feature Request Intelligence

**Phase:** Post-Launch & Support
**Estimated Time Saved:** ~70%
**Software Solution:** ✅ Yes

---

## The Problem

After launch, clients submit feature requests informally — in Slack, by email, during calls, as comments in bug tickets. These requests are scattered, untracked, and evaluated ad-hoc. Patterns are invisible: if 8 requests all relate to the same underlying need, nobody spots it because they arrived over 3 months through different channels. Effort estimates are never attached, so prioritisation conversations with clients happen without any grounding in what things actually cost to build. And from a business development perspective, a well-curated backlog of requested features is a natural pipeline for paid change requests — but it's never used that way because it doesn't exist in a structured form.

---

## AI-Native Workflow

> **Pipeline:** Feature request arrives → AI classifies and deduplicates → requests grouped by theme → prioritised backlog with effort estimates → monthly upsell brief generated

**Steps:**

1. ⚡ **Trigger** — Feature request received via any channel (email, Slack, support form)
2. 🔗 **Integration** — n8n intercepts the request and routes it to the feature request pipeline
3. 🤖 **AI** — Claude classifies the request: which part of the application it relates to, whether it is a bug fix, a workflow improvement, a new feature, or an integration request
4. 🤖 **AI** — Claude checks for duplicates or similar requests in the existing backlog. If a similar request exists, it increments the demand signal rather than creating a duplicate. If it is genuinely new, it creates a backlog entry with: request description, original quote from the client, classification, and a rough effort estimate.
5. 🤖 **AI** — Monthly: Claude analyses the full backlog and produces a Feature Request Report: top-requested themes, estimated effort for each theme's top items, business case for prioritising them, and a suggested agenda for a roadmap discussion with the client
6. 🤖 **AI** — Claude generates an upsell brief for the account manager: the top 3 feature clusters with the strongest demand signals, framed as commercial opportunities with effort and value estimates
7. 👤 **Human Override Point** — PM and account manager review the monthly report and upsell brief. Decide which items to bring to the client as formal change requests. Approved items are moved to a scoping workflow.

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude** | Request classification, deduplication, backlog analysis, report generation |
| **n8n** | Multi-channel request ingestion and pipeline |
| **Supabase** | Feature request database with demand signals and effort estimates |
| **Linear API** | Sync approved items to the project backlog |

---

## Prompt Templates

### Classify and Add Feature Request
```
You are a product manager at Alphonso Solutions reviewing a client feature request.

Client: [CLIENT NAME]
Project: [PROJECT NAME]
Request received: [DATE]
Channel: [EMAIL / SLACK / CALL NOTES]

Request:
[PASTE REQUEST TEXT]

Existing backlog (for duplicate check):
[PASTE CURRENT BACKLOG TITLES]

Produce:
1. **Classification:** Bug Fix / Workflow Improvement / New Feature / Integration / Configuration Change
2. **Component:** Which part of the application this relates to
3. **Duplicate?** Yes (existing item title) / No / Partially overlaps (existing item title)
4. **Request summary:** One clear sentence describing what the client wants and why
5. **Rough effort estimate:** [Small: <1 day / Medium: 1–5 days / Large: 1–3 weeks / XL: 3+ weeks]
6. **Business value signal:** [High / Medium / Low] — is this likely to impact retention, revenue, or client satisfaction significantly?
```

### Generate Monthly Feature Request Report
```
You are generating a monthly feature request report for a client.

Client: [CLIENT NAME]
Project: [PROJECT NAME]
Report period: [MONTH]

Feature request backlog:
[PASTE ALL REQUESTS — description | category | demand count | effort estimate | date first requested]

Generate:
1. **Summary:** Total requests received this month, total in backlog, trend vs. last month
2. **Top 5 Most Requested Themes:** group related requests and rank by demand signal
3. **Recommended Priorities:** top 3 items to implement, with rationale (demand, effort, impact)
4. **Commercial Opportunities:** 2-3 items suitable for a paid change request, framed as value to the client (not cost to Alphonso)
5. **Suggested Roadmap Discussion Agenda:** a 3-point agenda for a 30-minute call with the client to align on next steps
```

---

## 🛠 Software Solution

### What It Does
A feature request management system that aggregates requests from all channels, eliminates duplicates, tracks demand signals over time, and generates monthly reports that turn client feedback into structured commercial opportunities.

### Suggested Stack
- **Frontend:** Next.js — backlog view (kanban by status), demand heatmap, monthly report viewer
- **Backend:** Supabase — requests, demand signals, effort estimates, client and project linkage
- **AI Layer:** Claude API
- **Automation:** n8n — multi-channel ingestion + monthly report scheduling
- **Integrations:** Gmail API, Slack API (request capture), Linear API (approved items), CRM (upsell opportunity creation)

### Key Features
- Demand signal tracking: each duplicate request increments a counter rather than creating noise
- Effort-demand matrix: visualisation of what's most wanted vs. what's cheapest to build
- Monthly report auto-generation with one-click client share
- Upsell pipeline integration: approved commercial items flow directly into the CRM as opportunities
