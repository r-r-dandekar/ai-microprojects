# PRD Generation

**Phase:** Scoping & Planning
**Estimated Time Saved:** ~70%
**Software Solution:** ✅ Yes

---

## The Problem

Writing a Product Requirements Document from scratch is one of the most mentally draining tasks in the pre-development phase. A well-structured PRD for a typical project runs 15–25 pages and takes a senior developer or PM 1–2 full days to produce. Because the effort is so high, PRDs are often started late, left incomplete, or not updated when requirements change. In a fixed-price model, a weak PRD is a direct financial liability — it is the primary contractual protection against scope creep.

---

## AI-Native Workflow

> **Pipeline:** Structured requirements ready → AI generates full PRD draft → scope exclusion review → technical feasibility sign-off → final PRD locked

**Steps:**

1. ⚡ **Trigger** — All gaps in the requirements document are marked as resolved (from Discovery Note Structuring)
2. 🔗 **Integration** — The requirements document is pulled from the discovery note tool and passed to Claude
3. 🤖 **AI** — Claude generates the full PRD using Alphonso's PRD template: executive summary, user stories, functional specifications, technical constraints, integration specifications, and edge case coverage
4. 🤖 **AI** — Claude generates a "Scope Exclusion" section — a list of everything that is explicitly NOT included in this project, derived from the requirements and inferred from common scope creep patterns for this project type. This is critical for fixed-price protection.
5. 🤖 **AI** — Claude generates a "Assumptions & Dependencies" section listing every assumption baked into the spec (e.g., "client will provide API credentials within 5 days of project start")
6. 👤 **Human Override Point** — Lead developer and PM conduct a Technical Feasibility Review: verify that the spec is buildable in the estimated timeframe, flag any architectural decisions that need to be made before work begins, and confirm the scope exclusions are comprehensive
7. 🔗 **Integration** — Approved PRD is saved to Notion/Confluence, versioned, and linked to the project in Linear

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude** | PRD drafting — superior structured writing and edge case coverage |
| **n8n** | Requirements doc → Claude → Notion/Confluence save |
| **Notion / Confluence** | PRD storage and version control |
| **Linear** | Link PRD to project; PRD requirements become the source for task creation |

---

## Prompt Templates

### Generate Full PRD
```
You are a senior product manager at Alphonso Solutions, a fixed-price software agency building custom web and mobile applications for startups and SMBs.

Using the structured requirements document below, generate a complete Product Requirements Document (PRD).

Client: [CLIENT NAME]
Project: [PROJECT NAME]
Tech stack: [TECH STACK]
Target launch: [DATE or TIMEFRAME]

Structured Requirements:
[PASTE FULL REQUIREMENTS DOCUMENT]

PRD Structure to follow:

1. Executive Summary
   - Project overview, client context, and the problem being solved (1 page max)

2. Goals & Success Metrics
   - What does a successful delivery look like? What are the measurable outcomes?

3. User Personas
   - Each user type, their goals, and their technical literacy

4. Functional Specifications
   - For each feature: description, user story (As a [persona], I want to [action] so that [outcome]), acceptance criteria, edge cases

5. Technical Constraints
   - Platform requirements, performance targets, browser/device support, security requirements

6. Integration Specifications
   - Each third-party integration: purpose, data flow, authentication method, fallback behaviour

7. Scope Exclusions (Critical for fixed-price)
   - Explicitly list everything that is NOT in scope. Be aggressive. Include things the client may assume are included.

8. Assumptions & Dependencies
   - Every assumption baked into this spec. Every external dependency that could delay delivery.

9. Open Questions
   - Any remaining decisions that must be made before development begins

Write at a level of detail that a developer could build from without needing further clarification on any functional requirement.
```

---

## 🛠 Software Solution

### What It Does
A PRD generation and management tool that maintains Alphonso's PRD template, generates new PRDs from the requirements document, and keeps the PRD as a living document throughout the project — easy to update without rewriting from scratch.

### Suggested Stack
- **Frontend:** Next.js — PRD editor with section-level editing, change tracking, and approval workflow
- **Backend:** Supabase — PRD versions, section history, client and project linkage
- **AI Layer:** Claude API for generation and section-level regeneration
- **Integrations:** Discovery Note tool (requirements input), Notion API (export), Linear API (create tasks from user stories)

### Key Features
- Section-level regeneration — regenerate a single section without touching the rest of the document
- Change tracking — every edit is logged with who changed what and when
- Scope Exclusion library — common exclusions by project type, pre-populated and editable
- "Lock" mechanism — once the PRD is approved, changes require a change request (critical for fixed-price contracts)
- Export to PDF for client sign-off
