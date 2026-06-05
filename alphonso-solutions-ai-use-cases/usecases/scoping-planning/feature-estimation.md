# Feature Estimation

**Phase:** Scoping & Planning
**Estimated Time Saved:** ~60%
**Software Solution:** ✅ Yes

---

## The Problem

Estimating effort for a fixed-price project is the single highest-risk activity in Alphonso's entire business. Underestimate and the project loses money; overestimate and the proposal isn't competitive. Currently, estimation relies on a senior developer sitting down with the PRD for several hours, breaking features into tasks from memory, and applying gut-feel hour ranges. There is no systematic comparison to past projects, no formal risk weighting, and no structured breakdown by discipline (frontend, backend, DevOps, QA). The result is estimates that are consistently off in predictable ways that the team never fully corrects because they lack data.

---

## AI-Native Workflow

> **Pipeline:** PRD approved → AI breaks down every feature by discipline → historical comparison → confidence-weighted estimates → risk report → pricing calculation

**Steps:**

1. ⚡ **Trigger** — PRD is marked as approved and locked
2. 🔗 **Integration** — Feature Estimation tool pulls the full PRD and the historical project database
3. 🤖 **AI** — Claude breaks down every PRD feature into granular sub-tasks: Frontend, Backend, API integrations, DevOps, QA, and PM overhead — with a minimum and maximum hour estimate for each
4. 🤖 **AI** — GPT-4o compares this feature breakdown against the historical project database: "Projects of this type and complexity have historically taken X% longer than estimated on [category]." Adjusts estimates and assigns a confidence score (High / Medium / Low) to each feature
5. 🤖 **AI** — Claude produces a Risk Report: the top 5 features with the highest uncertainty, the reasons for uncertainty, and recommended mitigation (e.g., add a technical spike, clarify with client, add a contingency buffer)
6. 🔗 **Integration** — Total hours are calculated, margin is applied, and a fixed-price quote range is produced automatically
7. 👤 **Human Override Point** — Lead developer reviews the task breakdown for technical accuracy, adjusts any estimates that the AI has misjudged, reviews the risk report, and approves the final quote

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude** | Feature-to-task decomposition and risk narrative |
| **GPT-4o** | Cross-project pattern analysis and confidence scoring |
| **n8n** | PRD trigger → Claude breakdown → GPT-4o comparison → report generation |
| **Supabase** | Historical project database: estimated vs. actual hours per feature type |

---

## Prompt Templates

### Break Down PRD into Estimated Tasks
```
You are a senior technical lead at Alphonso Solutions, a fixed-price software agency.

Break down the following PRD into a granular task list for estimation purposes.

Project: [PROJECT NAME]
Tech stack: [TECH STACK]
Team size: [NUMBER] developers

PRD (Functional Specifications section):
[PASTE FUNCTIONAL SPECS]

For each feature, produce a task breakdown table:

| Task | Discipline | Min Hours | Max Hours | Assumptions | Uncertainty |
|------|-----------|-----------|-----------|-------------|-------------|

Disciplines: Frontend, Backend, Database, DevOps, QA, PM

After the table, produce:

**Hidden Complexity Flags**
List any tasks where the PRD is under-specifying a complex requirement (e.g., "real-time updates" without specifying WebSockets vs. polling, "payment integration" without specifying the number of payment methods).

**Recommended Contingency**
Based on the complexity and number of third-party integrations, suggest a contingency buffer as a percentage of total hours.
```

---

## 🛠 Software Solution

### What It Does
An estimation engine that generates task breakdowns from PRDs and improves its accuracy over time by storing actual project hours alongside estimates. The longer it runs, the more reliable its comparisons become.

### Suggested Stack
- **Frontend:** Next.js — estimation dashboard with editable task table, risk panel, and quote calculator
- **Backend:** Supabase — project history (estimates + actuals), task library, feature type taxonomy
- **AI Layer:** Claude API (decomposition) + GPT-4o API (historical comparison)
- **Integrations:** PRD tool (input), Linear API (create tasks from approved breakdown), accounting system (quote output)

### Key Features
- Editable task table — lead developer can override any AI estimate inline, with a note explaining the change
- Historical accuracy tracker — for each completed project, record actual hours vs. estimated. Surface accuracy by feature type.
- Confidence scoring with visual indicator (red/amber/green per feature)
- Quote calculator — applies configurable margin, day rate, and contingency buffer automatically
- "Clone estimate" — use a past project as the starting point for a similar new project
