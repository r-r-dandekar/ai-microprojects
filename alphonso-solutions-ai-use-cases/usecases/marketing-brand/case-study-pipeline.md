# Case Study Pipeline

**Phase:** Marketing & Brand
**Estimated Time Saved:** ~85%
**Software Solution:** ✅ Yes

---

## The Problem

Every completed project is a potential case study that could win the next deal. In practice, case studies are written months late (or never), because the team immediately moves to the next project and no one has bandwidth to write retrospectively. When they are written, they are generic: "We built an e-commerce app for a retail client." The technical depth — the actual problems solved, the architecture decisions, the measurable business impact — is either forgotten or never captured. A strong portfolio of specific, technical case studies is one of the highest-ROI sales assets a software agency can have, and Alphonso systematically under-produces them.

---

## AI-Native Workflow

> **Pipeline:** Project complete → AI ingests all project artifacts → full case study drafted → reviewed and published to portfolio

**Steps:**

1. ⚡ **Trigger** — Project is marked as complete in Linear
2. 🔗 **Integration** — n8n collects all project artifacts: the PRD, the git log (commit history with messages), all weekly status reports, and the feature estimation document
3. 🤖 **AI** — Gemini Pro ingests all artifacts and identifies: the key technical challenges solved, the most significant architectural decisions, the features that took the longest, and any innovations specific to this project
4. 🤖 **AI** — Claude drafts the full case study using Alphonso's case study template:
   - **The Challenge** — the client's problem before the project
   - **The Architecture** — the technical approach and key decisions
   - **The Build** — 2–3 specific technical innovations or interesting problems solved
   - **The Impact** — measurable outcomes (performance metrics, time saved, revenue generated)
5. 🤖 **AI** — Claude generates 5 social media post variants from the case study (for the social content pipeline)
6. 👤 **Human Override Point** — Lead developer reviews for technical accuracy. PM adds specific client metrics and approval from the client for publication. Approves the case study.
7. 🔗 **Integration** — Approved case study is published to the portfolio CMS and linked in the case study library (for use in the Proposal Generation tool)

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Gemini Pro** | Ingesting large amounts of project artifacts (PRDs, git logs, reports) |
| **Claude** | Case study writing — long-form technical narrative |
| **n8n** | Project completion trigger → artifact collection → generation → CMS publish |
| **Webflow / Framer / CMS API** | Portfolio website content management |

---

## Prompt Templates

### Draft Technical Case Study
```
You are a senior technical writer at Alphonso Solutions, a boutique software agency.

Write a technical case study for a completed project. This case study will appear on Alphonso's public portfolio.

Client industry: [INDUSTRY — anonymise the client name if not approved for publication]
Project type: [PROJECT TYPE]

PRD summary (key features built):
[PASTE PRD FUNCTIONAL SPECS SUMMARY]

Git log highlights (notable commits):
[PASTE KEY COMMIT MESSAGES — 20-30 most significant]

Status report highlights (notable achievements):
[PASTE KEY "WIN OF THE WEEK" SECTIONS from status reports]

Project metrics (if available):
[e.g., "Page load time reduced from 4.2s to 0.9s", "Checkout conversion increased 23%"]

Write a 900-1200 word case study with these sections:

## The Challenge
2 paragraphs: the client's situation before the project, their specific technical and business problems.

## Our Approach
2-3 paragraphs: the architectural decisions we made and why. Include specific technology choices.

## The Build: Key Innovations
3 specific technical challenges we solved during the project. Each should be 2-3 sentences, specific enough that a technical reader would find it interesting.

## The Impact
Measurable outcomes. If metrics are not available, describe qualitative outcomes (e.g., "The client's team now manages product catalogue updates independently without developer involvement").

## What We Learned
1 paragraph: a genuine insight from this project that shapes how we work.

Tone: confident, technically credible, specific. No generic phrases like "leveraged cutting-edge technology."
```

---

## 🛠 Software Solution

### What It Does
A case study generation and management tool that automatically triggers at project completion, drafts the case study from project artifacts, manages the approval workflow, and publishes directly to the portfolio CMS. Also serves as the case study library used by the Proposal Generation tool.

### Suggested Stack
- **Frontend:** Next.js — case study editor, approval workflow, library view with tags
- **Backend:** Supabase — case studies, project artifacts, tags (industry, stack, project type), approval status
- **AI Layer:** Gemini Pro API (artifact analysis) + Claude API (writing)
- **Integrations:** Linear API (project completion trigger), CMS API (Webflow/Contentful publish), Proposal Generation tool (library feed)

### Key Features
- Automated trigger on project completion — never miss a case study again
- Tag system: industry, tech stack, project type — for smart matching in proposal generation
- Approval workflow — requires client consent before publishing publicly
- Version history — see every draft and edit
- Social post generator — automatically produces 5 social variants alongside the case study
