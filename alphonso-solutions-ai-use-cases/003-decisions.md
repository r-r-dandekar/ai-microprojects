# Decisions

This file records all decisions made during the brainstorming phase for the Alphonso Solutions AI use case documentation.

---

## Output Type
- **Decision:** Practical, executable use case documentation — not a strategy document.
- **Reasoning:** A strategy document gets read once and filed. The goal is something a team member can open on Monday morning and follow immediately.

## Audience
- **Decision:** The whole team — developers, PMs, sales, and leadership.
- **Reasoning:** Each phase of the agency lifecycle involves different roles. Every person should find directly relevant content.

## Content Depth per Use Case
- **Decision:** Workflow + recommended tools as the baseline for every use case.
- **Includes:** Problem description, AI-native workflow (step-by-step, agentic where possible), recommended tools, and prompt templates with `[PLACEHOLDER]` slots.
- **Software spec:** Use cases that are recurring AND data-dependent additionally get a software solution section: feature list + tech stack recommendation.

## Criteria for Including a Software Solution
- **Decision:** A use case gets a software solution spec if it is **recurring** (happens repeatedly, not ad-hoc) AND **data-dependent** (relies on stored/persistent data such as client profiles, historical estimates, templates, or project history).
- **Reasoning:** These are the cases where a chatbot prompt alone can't replace a tool, because the value compounds over time with stored context.

## AI Ambition Level
- **Decision:** Fully agentic by default. Human steps are approvals and strategic decisions, not manual labor.
- **Nuance:** Every workflow explicitly marks **Human Override Points** — places where a human must review, approve, or redirect before the pipeline continues. These are deliberate, not fallbacks.

## Business Phases Covered
All 8 phases of the full agency lifecycle:
1. Pre-Sales & Discovery
2. Scoping & Planning
3. Build (Dev + Design)
4. QA & Delivery
5. Project Management
6. Marketing & Brand
7. Operations & HR
8. Post-Launch & Support

## AI Stack Philosophy
- **Decision:** Best tool for each job. No loyalty to a single provider.
- **Approved platforms:**
  - **LLMs:** Claude (Anthropic), Gemini Pro (Google), GPT-4o (OpenAI)
  - **Coding:** Cursor, GitHub Copilot
  - **UI Generation:** v0.dev
  - **Automation / Pipelines:** n8n, Zapier / Make
  - **Meeting & Transcription:** Fireflies.ai, Otter.ai
  - **Image Generation:** Midjourney, DALL·E 3, Adobe Firefly
  - **Design / Presentation:** Canva AI, Beautiful.ai, Gamma
  - **Search / Research:** Perplexity, Gemini with Search
  - **Other specialist tools:** included where clearly superior for a specific task

## Prompt Format
- **Decision:** Prompt templates with `[PLACEHOLDER]` slots (e.g., `[CLIENT NAME]`, `[PROJECT TYPE]`, `[FEATURE DESCRIPTION]`).
- **Reasoning:** Ready-to-copy but flexible enough to adapt across different projects and clients.

## Software Solution Spec Depth
- **Decision:** Feature list + tech stack recommendation.
- **Includes:** What the tool does, the suggested stack (e.g., Next.js + Supabase), and key integrations required.
- **Excludes:** Full data models, API design, and wireframes (out of scope for this documentation phase).

## Build Target for Software Solutions
- **Decision:** Internal tools only.
- **Reasoning:** Built exclusively for Alphonso's own team. No multi-tenancy, external onboarding, or commercial packaging required.

## Adoption Guidance
- **Decision:** Quick-start tips only — a short "how to begin" note at the start of each phase section.
- **Reasoning:** Keep the content lean and actionable. Full org change management is out of scope.

## Cost Guidance
- **Decision:** One dedicated cost summary section covering all recommended tools.
- **Includes:** Estimated monthly tooling cost for a 10–50 person agency, broken down by tier (free, low-cost, enterprise).
- **Location:** Standalone reference file, not embedded per use case.

## File & Folder Structure
- **Decision:** `/usecases` directory, one `.md` file per use case, organized into subfolders by business phase.
- **Also regenerate:** `004-vision.md` and `global-ai-principles.md` to reflect the new decisions.
- **Example structure:**
  ```
  /usecases
    /pre-sales-discovery/
    /scoping-planning/
    /build/
    /qa-delivery/
    /project-management/
    /marketing-brand/
    /operations-hr/
    /post-launch-support/
  004-vision.md
  global-ai-principles.md
  ```

---
