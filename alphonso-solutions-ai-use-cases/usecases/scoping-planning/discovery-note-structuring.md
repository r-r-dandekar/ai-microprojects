# Discovery Note Structuring

**Phase:** Scoping & Planning
**Estimated Time Saved:** ~85%
**Software Solution:** ✅ Yes

---

## The Problem

Raw discovery call output — whether a Fireflies transcript or a developer's bullet-point notes — is messy, non-linear, and full of client tangents. Turning it into a structured requirements document that can actually drive a PRD currently takes 2–4 hours of a senior person's time. The output quality varies by who does it, and requirements mentioned in passing are frequently lost. This bottleneck sits right at the start of every project and delays everything that follows.

---

## AI-Native Workflow

> **Pipeline:** Call transcript available → AI extracts and structures all requirements → flagged gaps sent to client → signed-off requirements document ready in under an hour

**Steps:**

1. ⚡ **Trigger** — Discovery call transcript is available in Fireflies (or notes are manually uploaded)
2. 🔗 **Integration** — n8n retrieves the transcript from Fireflies and passes it to Claude
3. 🤖 **AI** — Claude processes the transcript using Alphonso's requirements structure template and produces a full structured requirements document: functional requirements, non-functional requirements, user personas, integration requirements, and assumed constraints
4. 🤖 **AI** — Claude generates a separate "Gaps & Clarifications" list: every requirement that is vague, ambiguous, or missing — with a specific clarification question for each
5. 🤖 **AI** — Claude drafts a short client-facing clarification email with the gap questions, framed professionally
6. 👤 **Human Override Point** — Lead reviews the structured requirements and the gap list. Removes irrelevant gaps, adds any context from the call that wasn't in the transcript, approves the clarification email
7. 🔗 **Integration** — Approved requirements document is saved to Notion/Confluence and linked to the CRM deal. Clarification email is staged in Gmail for review.

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Fireflies.ai** | Source transcript with speaker labels |
| **Claude** | Requirements extraction, structuring, and gap analysis |
| **n8n** | Fireflies → Claude → Notion + Gmail draft |
| **Notion / Confluence** | Requirements document storage |

---

## Prompt Templates

### Structure Discovery Notes
```
You are a senior business analyst at Alphonso Solutions, a fixed-price software agency.

Below is the transcript of a discovery call. Extract and structure all requirements into a formal requirements document using the format below. Be exhaustive — do not skip any requirement, even ones mentioned briefly.

Client: [CLIENT NAME]
Project type: [PROJECT TYPE]

Transcript:
[FULL TRANSCRIPT or RAW NOTES]

---

Output format:

## Functional Requirements
For each requirement:
- ID: FR-001
- Description: What the system must do
- Source: Quote from the transcript that confirms this requirement
- Priority: Must Have / Should Have / Nice to Have

## Non-Functional Requirements
- Performance, scalability, security, browser/device support, uptime expectations

## User Personas
- List each type of user who will interact with the system, with a brief description

## External Integrations
- Any third-party APIs, tools, or systems the product must connect with

## Assumed Constraints
- Budget signals, timeline constraints, tech preferences, or platform decisions mentioned

## Out of Scope (Inferred)
- Capabilities the client may expect but did not explicitly request, which should be clarified and excluded

---

After the structured document, produce a separate section:

## Gaps & Clarifications
For each ambiguity or missing piece:
- Gap: What is unclear
- Quote: The relevant transcript quote (if any)
- Clarification question: The exact question to ask the client
```

---

## 🛠 Software Solution

### What It Does
A requirements intake tool that accepts a call transcript or raw notes and produces a structured requirements document in Alphonso's standard format. Stores all requirements documents linked to client and project records, making it easy to track how requirements evolved from first call to PRD.

### Suggested Stack
- **Frontend:** Next.js — upload interface, requirements document viewer/editor, gap list management
- **Backend:** Supabase — client records, requirements documents, version history
- **AI Layer:** Claude API
- **Integrations:** Fireflies.ai webhook, Notion API (export), Gmail API (draft clarification email)

### Key Features
- One-click import from Fireflies (no copy-pasting)
- Inline editing — human can accept, edit, or delete any extracted requirement
- Gap tracker — mark each gap as "resolved" when the client responds
- Version history — see how requirements changed between calls
- Feeds directly into the PRD Generation tool
