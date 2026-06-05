# Win/Loss Analysis

**Phase:** Pre-Sales & Discovery
**Estimated Time Saved:** ~90% (currently done ad-hoc or not at all)
**Software Solution:** ✅ Yes

---

## The Problem

Alphonso wins and loses deals, but rarely knows exactly why. Post-mortems on lost deals are informal or skipped entirely because the team is already focused on the next project. Over time this means the same mistakes repeat: proposals pitched at the wrong angle, scoping calls that miss the real decision-maker's concern, or pricing that's consistently off for a certain type of client. Without systematic analysis, the agency cannot improve its conversion rate deliberately.

---

## AI-Native Workflow

> **Pipeline:** Deal closes (won or lost) → AI analyses all deal artifacts → pattern report updated → monthly insight digest generated

**Steps:**

1. ⚡ **Trigger** — Deal is marked as Won or Lost in the CRM
2. 🔗 **Integration** — n8n pulls all deal artifacts: Client Dossier, Discovery Brief, proposal sent, any follow-up emails, and the outcome
3. 🤖 **AI** — Claude analyses this specific deal and produces a Deal Post-Mortem: key factors that likely influenced the outcome, what was strong in the pitch, what was weak, and what should be done differently next time
4. 🔗 **Integration** — Post-mortem is saved to the deal record and added to the Win/Loss database
5. 🤖 **AI** — Monthly: GPT-4o analyses the accumulated database of post-mortems and produces a Pattern Report: which client types convert best, which proposal framings win, which project types have the best margins, where deals are consistently lost and why
6. 👤 **Human Override Point** — Sales lead and founder review the monthly Pattern Report, validate the AI's conclusions against their intuition, and decide which behaviours to change

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude** | Individual deal post-mortem analysis |
| **GPT-4o** | Cross-deal pattern recognition and monthly report generation |
| **n8n** | CRM trigger → artifact collection → AI analysis → database save |
| **Supabase** | Win/loss database with structured deal records |

---

## Prompt Templates

### Deal Post-Mortem
```
You are analysing a sales deal for Alphonso Solutions, a fixed-price software agency.

Outcome: [WON / LOST]
Client: [CLIENT NAME]
Project type: [PROJECT TYPE]
Deal value: [AMOUNT]

Client Dossier summary: [KEY POINTS from dossier]
Discovery call brief summary: [KEY POINTS from discovery brief]
Proposal summary: [BRIEF DESCRIPTION of what was proposed and at what price]
Client feedback (if known): [ANY FEEDBACK or reason given]

Produce a Deal Post-Mortem with:
1. What we did well (max 3 points)
2. What likely hurt our chances (max 3 points, even for wins — note any risks)
3. What we should do differently next time for a similar deal
4. One thing we should add to or change in our standard proposal template based on this deal

Be direct and specific. Do not be diplomatic at the expense of usefulness.
```

### Monthly Pattern Report
```
You are analysing [NUMBER] completed sales deals for Alphonso Solutions.

Below is a summary of each deal including: client type, project type, deal value, outcome (won/lost), and post-mortem notes.

[DEAL SUMMARIES — paste structured data]

Produce a Monthly Win/Loss Pattern Report covering:
1. Overall conversion rate and trend vs. last month
2. Client types with the highest and lowest win rates
3. Project types with the highest and lowest win rates
4. Common themes in winning proposals (max 3)
5. Common themes in lost deals (max 3)
6. One specific change to the sales process recommended for next month
```

---

## 🛠 Software Solution

### What It Does
A deal intelligence database that stores every post-mortem and surfaces patterns over time. Turns anecdotal sales experience into structured, queryable data that improves the agency's conversion rate systematically.

### Suggested Stack
- **Frontend:** Next.js — deal timeline view, pattern dashboard, monthly report viewer
- **Backend:** Supabase — deal records, post-mortems, pattern reports
- **AI Layer:** Claude API (post-mortem) + GPT-4o API (pattern analysis)
- **Integrations:** CRM webhook (HubSpot / Pipedrive), Slack (monthly report alert)

### Key Features
- Deal record view showing dossier → discovery brief → proposal → outcome → post-mortem in a single timeline
- Pattern dashboard: win rate by client type, project type, deal size, and month
- Searchable post-mortem archive ("show me all lost deals where pricing was mentioned")
- Monthly automated digest sent to the sales lead and founder
