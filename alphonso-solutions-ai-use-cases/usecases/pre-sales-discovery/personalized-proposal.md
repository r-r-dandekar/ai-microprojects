# Personalized Proposal Generation

**Phase:** Pre-Sales & Discovery
**Estimated Time Saved:** ~75%
**Software Solution:** ✅ Yes

---

## The Problem

Alphonso's proposals are often the same deck with the client's name swapped in. They reference generic capabilities rather than the prospect's specific situation, and they take 1–3 days to produce because someone has to manually research the client, find relevant case studies, and write bespoke sections. By the time the proposal lands, a faster-moving competitor may already have the deal.

---

## AI-Native Workflow

> **Pipeline:** Discovery call complete → AI ingests dossier + call notes → fully personalised proposal drafted within the hour

**Steps:**

1. ⚡ **Trigger** — Discovery call ends; sales lead marks it as "Proposal Needed" in CRM
2. 🔗 **Integration** — n8n pulls the Client Dossier (from Prospect Research) and the discovery call notes from Fireflies
3. 🤖 **AI** — Claude matches the client's pain points and project type against Alphonso's case study library and selects the 2–3 most relevant references
4. 🤖 **AI** — Claude drafts the full proposal using Alphonso's proposal template: executive summary, proposed solution, relevant experience, team overview, timeline, and fixed-price breakdown
5. 🤖 **AI** — Gamma or Beautiful.ai formats the proposal into a polished presentation-ready document
6. 👤 **Human Override Point** — Sales lead reviews the draft, adjusts pricing scenarios, adds any personal context from the call, and approves for sending
7. 🔗 **Integration** — Approved proposal is saved to CRM and optionally sent via DocuSign or email

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude** | Drafting proposal copy: solution narrative, case study selection, exec summary |
| **Gamma / Beautiful.ai** | Auto-formatting into a polished, visually consistent proposal document |
| **Fireflies.ai** | Source of discovery call transcript and notes |
| **n8n** | Orchestrating: CRM trigger → dossier + transcript → Claude → formatter → CRM |

---

## Prompt Templates

### Draft Proposal
```
You are writing a sales proposal for Alphonso Solutions, a boutique fixed-price software agency (10–50 people) that builds custom web and mobile applications for startups and SMBs.

Client: [CLIENT NAME]
Their challenge: [PAIN POINTS from Client Dossier]
Project type: [PROJECT TYPE]
Key discovery call insights: [DISCOVERY NOTES — paste the 5-10 most important points]

Relevant Alphonso case studies to reference:
- [CASE STUDY 1: one sentence description]
- [CASE STUDY 2: one sentence description]

Write a proposal with the following sections:
1. Executive Summary (why we understand their challenge, 2 short paragraphs)
2. Proposed Solution (what we will build and why this approach fits them specifically)
3. Why Alphonso (2-3 sentences referencing the relevant case studies)
4. Delivery Approach (fixed-price model, phases, timeline overview)
5. Investment (placeholder table: Phase | Deliverables | Fixed Price)
6. Next Steps (3 clear action items)

Tone: professional, confident, specific. Do not use filler phrases like "we are pleased to present."
```

---

## 🛠 Software Solution

### What It Does
A proposal generation tool that maintains Alphonso's case study library, proposal templates, and client history. Generates a new tailored proposal in minutes by combining the client dossier with stored templates and case studies.

### Suggested Stack
- **Frontend:** Next.js — proposal builder UI, case study library manager
- **Backend:** Supabase — stores proposals, case studies, templates, and client history
- **AI Layer:** Claude API for copy generation
- **Document Output:** Gamma API or HTML-to-PDF for formatted output
- **Integrations:** CRM (HubSpot / Pipedrive), Fireflies.ai (transcript), DocuSign (optional)

### Key Features
- Case study library with tags (industry, tech stack, project type) for smart matching
- Proposal version history — see every draft and what was changed before sending
- Win/Loss tracking — tag sent proposals as won or lost to identify which framings convert
- Re-use sections — save strong proposal sections as reusable blocks
