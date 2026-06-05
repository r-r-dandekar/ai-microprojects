# Global AI Principles

These principles apply across every use case in this documentation. Read this before diving into any specific workflow.

---

## How to Read a Use Case File

Each use case file contains:

- **The Problem** — the specific manual pain this workflow addresses
- **AI-Native Workflow** — step-by-step pipeline with actor labels (see below)
- **Recommended Tools** — the best tool for each role in the workflow
- **Prompt Templates** — ready-to-use prompts with `[PLACEHOLDER]` slots
- **Software Solution** *(where applicable)* — spec for a custom internal tool, for use cases that are recurring and data-dependent

### Workflow Actor Labels

| Label | Meaning |
|-------|---------|
| ⚡ **Trigger** | What starts the workflow (a commit, a calendar event, a form submit, etc.) |
| 🤖 **AI** | An autonomous AI step — runs without human input |
| 👤 **Human Override Point** | A deliberate checkpoint — human reviews, approves, or redirects before continuing |
| 🔗 **Integration** | An automated connection between two tools (e.g., n8n moves data from GitHub to Claude) |

---

## Principle 1: Agentic by Default

Design workflows so that AI runs the pipeline and humans review the output — not the other way around. A workflow where a human does five steps and asks AI to help with one is not an AI-native workflow; it is a traditional workflow with AI bolted on.

**Ask for every workflow:** What is the minimum number of human touches required to maintain quality and accountability? Design to that minimum.

---

## Principle 2: Human Override Points Are Non-Negotiable

Every agentic pipeline must have at least one Human Override Point before:
- Anything is sent to a client
- Any code is merged or deployed
- Any contract or pricing document is finalized
- Any public content is published

Human Override Points are not fallbacks for when AI fails. They are deliberate design decisions that preserve professional accountability. Mark them explicitly in every workflow.

---

## Principle 3: Use Prompt Templates, Not Free-Form Prompts

For any recurring task, never prompt AI from scratch each time. Use the templates in each use case file. Templates ensure:
- Consistent output format across the team
- Alphonso-specific context is always included
- New team members can use AI effectively from day one

### How to Fill in Placeholders

Replace every `[PLACEHOLDER]` before running the prompt. Brackets indicate required context — leaving them blank will produce generic output.

Common placeholders used across the playbook:

| Placeholder | What to fill in |
|------------|----------------|
| `[CLIENT NAME]` | The client's company name |
| `[PROJECT TYPE]` | e.g., "e-commerce web app", "mobile SaaS" |
| `[TECH STACK]` | e.g., "Next.js, Supabase, Tailwind CSS" |
| `[FEATURE NAME]` | The specific feature being discussed |
| `[RELEVANT CODE]` | Paste the actual code block |
| `[DISCOVERY NOTES]` | Paste the raw or cleaned-up notes |
| `[PRD CONTENT]` | Paste the relevant PRD section |
| `[BUG REPORT]` | The client's description of the issue |
| `[ERROR LOGS]` | The relevant error output |

---

## Principle 4: Context Injection Is the Multiplier

AI output quality scales with the quality and specificity of context provided. Always include:

1. **Who Alphonso is** — small fixed-price agency, 10–50 people, custom web/mobile for SMBs
2. **The project context** — stack, client type, project phase
3. **The relevant artifact** — the PRD, the code, the bug report, the meeting notes
4. **The desired output format** — specify structure, length, and tone explicitly

Vague prompts produce vague results. Specific prompts produce production-ready output.

---

## Principle 5: Best Tool for the Job

Use the tool that is strongest for each specific task. General guidance:

| Task Type | Recommended Primary Tool |
|-----------|--------------------------|
| Long-form writing, drafting, analysis | Claude |
| Real-time web research, large context ingestion | Gemini Pro |
| Reasoning, structured data, broad API ecosystem | GPT-4o |
| In-editor code generation and refactoring | Cursor |
| UI generation from designs or prompts | v0.dev |
| Multi-step pipeline automation | n8n or Make |
| Meeting transcription and action extraction | Fireflies.ai |
| Image and visual generation | Midjourney, DALL·E 3, Adobe Firefly |
| Presentation generation | Gamma, Beautiful.ai |

Each use case file specifies the optimal tool for that workflow. Default to these recommendations; override only when the team has a specific reason.

---

## Principle 6: Client Data Privacy

Before feeding any client data into an external AI tool:

1. **Anonymize** sensitive data where possible — replace client names with `[CLIENT]`, financial figures with `[AMOUNT]`, etc.
2. **Use API access** (not the web UI) for recurring workflows involving real project data — API calls are not used for model training by default.
3. **Check your agreements** — some enterprise clients may have NDAs that restrict use of their data in third-party systems.
4. **Never paste credentials** — API keys, database passwords, and secret tokens must never appear in a prompt.

---

## Principle 7: Design for Data Accumulation

Use cases marked with a **Software Solution** are ones where value compounds over time. When building these tools:

- Store inputs and outputs — every estimation, every proposal, every bug report
- Track actuals vs. predictions — did the estimate match reality? Did the proposal win?
- Make the data queryable — the tool should get smarter, not just execute the same query repeatedly

A feature estimator that has never seen a past project is a calculator. One that has seen 50 projects is a forecasting engine.

---

## Principle 8: Validate Before Shipping

AI output is a first draft, not a final product. Every output that exits the internal system (sent to a client, merged to main, published publicly) must pass a human review. The review is not a line-by-line edit — it is a quality and accuracy check. Ask:

- Is this factually accurate for this specific project/client?
- Does it match Alphonso's professional standard?
- Are there any statements that could create a contractual or reputational risk?

If yes to all three: approve and ship. If not: iterate.

---
