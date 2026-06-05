# Prospect Research

**Phase:** Pre-Sales & Discovery
**Estimated Time Saved:** ~80%
**Software Solution:** ✅ Yes

---

## The Problem

Before a sales call, someone at Alphonso manually Googles the prospect, skims their LinkedIn, and tries to piece together their industry context in the 10 minutes before the meeting. The result is a surface-level understanding that makes the conversation generic. Deeper research — competitors, recent funding, tech stack signals, likely pain points — simply doesn't happen because there isn't time to do it manually.

---

## AI-Native Workflow

> **Pipeline:** New lead added → overnight research agent runs → full client dossier delivered to sales lead before the call

**Steps:**

1. ⚡ **Trigger** — New lead is added to the CRM (manually or via web form)
2. 🔗 **Integration** — n8n picks up the new lead and passes company URL + LinkedIn URL to the research pipeline
3. 🤖 **AI** — Gemini Pro (with Search) scrapes and summarises: company overview, product/service offering, team size, recent news, funding rounds, tech stack signals (via job listings, BuiltWith), and key decision-maker profiles
4. 🤖 **AI** — Claude analyses the research and generates a structured "Client Dossier": top 3 likely pain points, relevant Alphonso case studies to reference, suggested discovery questions, and red flags to watch for
5. 🔗 **Integration** — Dossier is saved to the CRM record and a Slack notification is sent to the sales lead with a link
6. 👤 **Human Override Point** — Sales lead reviews the dossier, adds any personal knowledge, and confirms the discovery call is the right fit to pursue

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Gemini Pro (with Search)** | Real-time web research — company news, funding, job listings |
| **Perplexity** | Fast secondary source validation for industry context |
| **Claude** | Synthesising research into the structured dossier format |
| **n8n** | Orchestrating the pipeline: CRM trigger → research → dossier → Slack |

---

## Prompt Templates

### Generate Client Dossier
```
You are a senior pre-sales analyst at a boutique software agency called Alphonso Solutions.

Research the following company and produce a structured Client Dossier.

Company: [CLIENT NAME]
Website: [WEBSITE URL]
LinkedIn: [LINKEDIN URL]
Project interest: [PROJECT TYPE they enquired about]

Dossier sections:
1. Company Overview (3-4 sentences: what they do, size, stage, market)
2. Tech Stack Signals (infer from job listings, BuiltWith, or product pages)
3. Top 3 Likely Pain Points (specific to a company of this type and stage)
4. Relevant Alphonso Experience (which of our past projects/skills are most relevant)
5. Suggested Discovery Questions (5 questions tailored to their situation)
6. Red Flags to Watch For (scope creep risks, budget signals, technical complexity)

Be specific. Avoid generic observations that would apply to any company.
```

---

## 🛠 Software Solution

### What It Does
A lightweight CRM-integrated research tool that automatically generates a Client Dossier for every new lead. Dossiers are stored against the CRM record so the full research history is available for future interactions.

### Suggested Stack
- **Frontend:** Next.js — simple dashboard showing dossier per lead
- **Backend:** Supabase — stores leads, dossiers, and research history
- **AI Layer:** Gemini Pro API (research) + Claude API (synthesis)
- **Automation:** n8n — CRM webhook → research pipeline → dossier storage → Slack alert
- **Integrations:** CRM webhook (HubSpot / Pipedrive), BuiltWith API, Slack

### Key Features
- Auto-triggers on new CRM entry
- Stores full dossier history per client (useful when re-engaging old leads)
- Win/Loss tagging — over time, identifies which dossier signals correlate with won deals
- Manual "refresh" button to re-run research before a follow-up call
