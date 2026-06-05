# Meeting Intelligence

**Phase:** Project Management
**Estimated Time Saved:** ~80%
**Software Solution:** ❌ No

---

## The Problem

Every project meeting produces decisions, action items, and context that must then be manually distributed: someone types up notes, pastes action items into Linear, updates project status, and drafts a follow-up email. This administrative tail takes 30–45 minutes after a 30-minute meeting — often longer than the meeting itself. More often, it doesn't happen at all, and decisions made in the meeting are lost, disputed, or forgotten a week later. "I thought we agreed to…" is a common source of project friction.

---

## AI-Native Workflow

> **Pipeline:** Meeting ends → Fireflies transcript available → AI extracts action items, decisions, and updates → all systems updated automatically → PM reviews and approves

**Steps:**

1. ⚡ **Trigger** — Meeting ends; Fireflies completes transcription (typically 3–5 minutes after the call)
2. 🔗 **Integration** — Fireflies webhook fires to n8n with the full transcript
3. 🤖 **AI** — Claude processes the transcript and extracts:
   - **Decisions made** — any agreement or conclusion reached during the call
   - **Action items** — specific tasks, with the owner (by name) and any mentioned deadline
   - **Blockers surfaced** — any issue that was raised as blocking progress
   - **Open questions** — things discussed but not resolved
   - **Changes to scope or timeline** — anything that would affect the PRD or project plan
4. 🤖 **AI** — Claude drafts:
   - New Linear tasks for each action item, assigned to the correct team member
   - Linear status updates for any tasks discussed in the meeting
   - A follow-up email to the client (or meeting participants) summarising decisions and confirming action items with owners and due dates
5. 👤 **Human Override Point** — PM reviews the extracted list: confirms action items are correct and assigned to the right people, removes any duplicates, approves the creation of Linear tasks and the sending of the follow-up email
6. 🔗 **Integration** — Tasks are created in Linear, project status is updated, and the follow-up email is sent or staged for review

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Fireflies.ai** | Meeting transcription with speaker labels |
| **Claude** | Action item extraction, task generation, follow-up email drafting |
| **n8n** | Fireflies webhook → Claude → Linear + Gmail |
| **Linear API** | Task creation and project status updates |

---

## Prompt Templates

### Extract Meeting Actions and Decisions
```
You are a project coordinator at Alphonso Solutions.

Extract all actionable information from the following meeting transcript.

Project: [PROJECT NAME]
Meeting type: [INTERNAL / CLIENT-FACING]
Meeting date: [DATE]
Participants: [LIST OF NAMES AND ROLES]

Transcript:
[FULL TRANSCRIPT]

Extract the following, structured exactly as shown:

## Decisions Made
- [Decision 1]: [One sentence description. Who agreed to it.]
- [Decision 2]: ...

## Action Items
| Task | Owner | Due Date | Notes |
|------|-------|----------|-------|
| ... | ... | [Stated date or "Not specified"] | ... |

## Blockers Raised
- [Blocker]: [What is blocking, who owns the resolution]

## Open Questions (Unresolved)
- [Question]: [What needs to be decided and by whom]

## Scope / Timeline Changes
- [Any change discussed that affects the PRD, estimate, or delivery date]

---

Draft a follow-up email:
Subject: [PROJECT NAME] — Meeting Summary [DATE]

[Structured summary of decisions and action items, written for [CLIENT NAME / internal team]. Confirm each action item with the owner's name. Professional tone.]
```

---

## Notes

- Set Fireflies.ai to auto-join all project-related calendar events (tag with the project name). This eliminates the need to manually start recording.
- For internal-only meetings, skip the client follow-up email step and just post the summary to the project's Slack channel.
- Store all meeting summaries in Notion linked to the project record — they are invaluable context when a dispute arises about what was agreed and when.
