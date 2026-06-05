# Client Communication AI

**Phase:** Project Management
**Estimated Time Saved:** ~70%
**Software Solution:** ✅ Yes

---

## The Problem

Drafting a difficult client email — a delay notification, a scope change request, a pushback on additional feature requests — is mentally draining and time-consuming. PMs stare at blank screens, over-think the phrasing, and send messages that are either too apologetic (which signals weakness), too blunt (which damages the relationship), or too vague (which creates confusion). Under pressure, rushed messages go out that create more problems than they solve. The deeper issue is that there is no institutional memory of how each client prefers to communicate — every message is written from scratch.

---

## AI-Native Workflow

> **Pipeline:** PM provides the facts and desired outcome → AI loads the client profile → drafts the message → PM reviews and sends

**Steps:**

1. ⚡ **Trigger** — PM needs to communicate with a client (any reason)
2. 👤 **Human Override Point** — PM fills in a short form: What happened? What is the desired outcome? What is the urgency? Any sensitivities to be aware of?
3. 🔗 **Integration** — The tool loads the stored Client Communication Profile: preferred tone, technical literacy, known sensitivities, examples of past messages that landed well or poorly
4. 🤖 **AI** — Claude drafts the message tailored to the specific client and situation: correct tone, appropriate level of technical detail, structured clearly, with a specific call to action
5. 🤖 **AI** — Claude generates 2 alternative versions: one more formal, one more concise. The PM can choose the base version and blend if needed.
6. 👤 **Human Override Point** — PM reads the draft. Edits if needed. Approves. Message goes out via email or Slack. The final sent message is stored in the client communication history.

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude** | Message drafting — superior emotional intelligence and tone calibration |
| **n8n** | Form → client profile lookup → Claude → draft delivery |
| **Supabase** | Client profiles and communication history storage |

---

## Prompt Templates

### Draft Client Message
```
You are a senior project manager at Alphonso Solutions, a professional fixed-price software agency.

Draft a client communication based on the following situation.

Client: [CLIENT NAME]
Client profile:
  - Communication style: [FORMAL / INFORMAL]
  - Technical level: [TECHNICAL / NON-TECHNICAL]
  - Known sensitivities: [e.g., "very sensitive about delays", "prefers bullet points", "responds badly to jargon"]
  - Relationship stage: [e.g., "mid-project, good relationship", "tense after last week's delay"]
  
Channel: [EMAIL / SLACK]
Situation: [WHAT HAPPENED — facts only, no spin]
Desired outcome: [WHAT DO YOU WANT THE CLIENT TO DO OR FEEL AFTER READING THIS?]
Urgency: [HIGH / MEDIUM / LOW]
Any constraints: [e.g., "cannot offer a refund", "cannot commit to a new date yet"]

Draft the message. Then provide:
- Version A: Standard (as drafted)
- Version B: More formal / longer
- Version C: More concise / direct

After the drafts, note: any risk in this communication (e.g., a phrase that could be interpreted as a commitment, or an admission that could be used against us contractually).
```

---

## 🛠 Software Solution

### What It Does
A client communication tool that stores communication profiles for each client and generates context-aware message drafts on demand. Builds an institutional memory of how each client prefers to be communicated with, so the quality of communications doesn't depend on who happens to be available.

### Suggested Stack
- **Frontend:** Next.js — message composer (situation form), draft viewer with alternatives, communication history per client
- **Backend:** Supabase — client profiles (communication preferences, sensitivities, history), sent message archive
- **AI Layer:** Claude API
- **Integrations:** Gmail API (send directly from tool), Slack API (post to client channel), CRM (link messages to deal records)

### Key Features
- Client profile builder — onboard each client with their communication preferences at project start
- Communication history — every sent message stored and searchable ("what did we tell them about the payment module delay?")
- Situation templates — pre-filled forms for common situations: delay notification, scope change request, payment reminder, project milestone update
- Tone preview — before generating, shows which tone profile will be used so the PM can correct it
