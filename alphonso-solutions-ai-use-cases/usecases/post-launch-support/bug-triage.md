# Intelligent Bug Triage

**Phase:** Post-Launch & Support
**Estimated Time Saved:** ~75%
**Software Solution:** ✅ Yes

---

## The Problem

After a project launches, bug reports arrive through email, Slack, and sometimes WhatsApp — unstructured, vague, and urgent-sounding regardless of severity. Someone has to read each report, determine if it's a real bug or a user error, assess the severity, check if it's a duplicate, decide which developer should look at it, and draft an acknowledgment to the client. This triage process happens manually and inconsistently, leading to bugs being missed, developers being interrupted by issues that aren't their responsibility, and clients feeling ignored because the acknowledgment took a day to arrive.

---

## AI-Native Workflow

> **Pipeline:** Client submits bug → AI triages immediately → duplicate check → routed to right developer → acknowledgment sent in minutes

**Steps:**

1. ⚡ **Trigger** — Bug report submitted via support email, Slack, or a support form
2. 🔗 **Integration** — n8n intercepts the report and passes it to the triage pipeline
3. 🤖 **AI** — Claude analyses the report and produces a structured triage:
   - **Is this a bug or user error?** Based on the description, does this sound like unexpected software behaviour or a user misunderstanding?
   - **Severity:** Critical (app unusable) / High (major feature broken) / Medium (feature impaired) / Low (cosmetic or minor)
   - **Category:** Frontend / Backend / Data / Integration / Performance / Security
   - **Duplicate check:** Compare against open and resolved tickets to identify if this was already reported
   - **Suggested owner:** Which developer should investigate based on the category and their project knowledge
4. 🤖 **AI** — Claude drafts a client acknowledgment message: confirms receipt, sets expectations for response time based on severity, and asks for any additional information needed (e.g., device, browser, steps to reproduce)
5. 👤 **Human Override Point** — PM or lead reviews the triage summary, confirms the severity and routing, and approves the acknowledgment message. For Critical bugs, escalation is immediate and this review happens within 15 minutes.
6. 🔗 **Integration** — Linear ticket is created with the structured triage, assigned to the recommended developer. Acknowledgment is sent to the client. PM is alerted via Slack.

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude** | Bug report analysis, severity assessment, duplicate detection, acknowledgment drafting |
| **n8n** | Email/form trigger → Claude → Linear + email send |
| **Linear API** | Ticket creation and developer assignment |
| **Sentry** | Optional: link bug reports to existing Sentry errors for richer context |

---

## Prompt Templates

### Triage Bug Report
```
You are a QA lead at Alphonso Solutions. Triage the following bug report.

Project: [PROJECT NAME]
Tech stack: [TECH STACK]
Client: [CLIENT NAME]

Bug report:
[PASTE REPORT]

Previously reported bugs in this project:
[PASTE LIST of recent open tickets — title + brief description]

Produce a structured triage:

**Classification:** Bug / User Error / Feature Request / Unclear (explain)

**Severity:**
- Critical: Core functionality is completely broken for all users
- High: A key feature is broken or inaccessible for some users
- Medium: A feature is impaired but has a workaround
- Low: Cosmetic issue or very minor inconvenience

**Category:** Frontend / Backend / Data / Integration / Performance / Security

**Duplicate?** Yes (link to ticket) / No / Possibly (link to similar ticket)

**Recommended developer:** [Which type of developer should investigate, and why]

**Information needed from client:** [List any missing details needed to investigate — browser, device, account ID, steps to reproduce, etc.]

**Draft acknowledgment message:**
[A short, professional message confirming receipt, stating the severity classification and expected response time, and requesting any missing information]
```

---

## 🛠 Software Solution

### What It Does
A support triage system that intercepts incoming bug reports from any channel (email, Slack, form), automatically triages and classifies them, routes them to the right developer, and sends a client acknowledgment — all within minutes of the report arriving.

### Suggested Stack
- **Frontend:** Next.js — support queue dashboard, triage view per ticket, routing rules manager
- **Backend:** Supabase — tickets, triage history, routing rules, client configs
- **AI Layer:** Claude API
- **Automation:** n8n — email/webhook ingestion → Claude triage → Linear create → email send
- **Integrations:** Gmail API (email ingestion + send), Linear API, Slack API (developer alert), Sentry API (error context)

### Key Features
- Multi-channel ingestion: email, Slack, web form — all routed through the same triage pipeline
- Routing rules engine: configurable rules for which developer gets which category of bug
- Acknowledgment templates per client: tone and expected SLA can vary by client
- Bug pattern detection: alerts when 3+ similar bugs are reported, indicating a systemic issue
- SLA tracking: flags tickets that haven't been responded to within the agreed response time
