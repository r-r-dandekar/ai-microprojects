# Discovery Call Co-Pilot

**Phase:** Pre-Sales & Discovery
**Estimated Time Saved:** ~60%
**Software Solution:** ❌ No

---

## The Problem

Discovery calls are unstructured by nature: clients ramble, requirements emerge mid-sentence, and critical details get buried in small talk. The person running the call is simultaneously listening, asking follow-up questions, and trying to take notes — doing all three badly. After the call, someone spends 1–2 hours reconstructing what was said, and still misses things. Scope creep often begins here, when vague statements are interpreted optimistically.

---

## AI-Native Workflow

> **Pipeline:** Call starts → Fireflies transcribes live → Claude analyses post-call → structured brief delivered within 15 minutes of the call ending

**Steps:**

1. ⚡ **Trigger** — Discovery call starts; Fireflies.ai bot joins the meeting automatically (via calendar integration)
2. 🤖 **AI** — Fireflies transcribes the full call in real time, tagging speakers and key moments
3. 🔗 **Integration** — On call end, Fireflies webhook fires to n8n with the full transcript
4. 🤖 **AI** — Claude analyses the transcript against a Discovery Brief template and produces:
   - Functional requirements mentioned (explicit and implied)
   - Non-functional requirements (performance, security, integrations)
   - Scope ambiguities — statements that need clarification before a quote can be given
   - Contradictions in the client's statements
   - Potential scope creep signals (vague phrases like "and maybe also…")
   - Recommended follow-up questions to ask in the next call or email
5. 🔗 **Integration** — Discovery brief is posted to a Slack channel and saved to the CRM record
6. 👤 **Human Override Point** — The call lead reviews the brief, adds strategic notes, and decides whether to request a follow-up call or proceed to scoping

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Fireflies.ai** | Automatic call transcription, speaker tagging, and webhook on call completion |
| **Claude** | High-fidelity extraction of requirements, gaps, and risks from the transcript |
| **n8n** | Fireflies webhook → Claude → Slack + CRM save |
| **Notion / CRM** | Storage for the discovery brief alongside the lead record |

---

## Prompt Templates

### Analyse Discovery Call Transcript
```
You are a senior business analyst at Alphonso Solutions, a fixed-price software agency.

Below is the transcript of a discovery call with a potential client. Your job is to extract a structured Discovery Brief.

Client: [CLIENT NAME]
Project type: [PROJECT TYPE]

Transcript:
[FULL TRANSCRIPT — paste here]

Produce the following sections:

1. Functional Requirements
   - List every concrete feature or capability the client mentioned, explicitly or implicitly.

2. Non-Functional Requirements
   - Performance, scalability, security, browser/device support, integrations.

3. Scope Ambiguities (Critical)
   - Any requirement that is too vague to estimate. Quote the exact client phrase and explain what is unclear.

4. Contradictions
   - Any statements where the client contradicted themselves or where two requirements conflict.

5. Scope Creep Signals
   - Phrases like "and maybe also", "eventually we'd want", "it would be nice if". List each with the quote.

6. Missing Information
   - What do we still need to know before we can scope this project accurately?

7. Recommended Follow-Up Questions
   - 5 specific questions to send to the client or ask in the next call.

Be specific. Quote the transcript where relevant.
```

---

## Notes

- Set up Fireflies.ai to auto-join all calendar events with a video link. This requires a one-time calendar integration — no manual action needed per call.
- If the client is uncomfortable with recording, the same workflow can be run on typed notes by running the prompt manually after the call.
- This workflow feeds directly into **Discovery Note Structuring** (Scoping & Planning phase).
