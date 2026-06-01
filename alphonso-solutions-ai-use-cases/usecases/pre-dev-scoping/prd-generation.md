# Use Case: PRD Generation (Pre-Dev)

## Activity Description
Generating a formal Product Requirements Document (PRD) that serves as the blueprint for development.

### Problems & Inefficiencies
- **Drafting Fatigue:** Writing 10-20 page documents from scratch is mentally draining for developers/PMs.
- **Inconsistency:** Different team members use different styles, leading to confusion during implementation.
- **Stale Documents:** PRDs are often not updated because the effort to re-draft is too high.

## AI-Native Reimagining
The PRD becomes a "living document" generated from the "Discovery Note Cleanup" output. The human provides the *intent* and *architecture decisions*; the AI handles the *specification* and *documentation*. We move from "writing" a PRD to "orchestrating" its creation.

### Quality & Efficiency Improvements
- **Quality:** Standardized documentation across all projects; exhaustive edge-case coverage (AI is better at remembering the "boring" details like error states).
- **Efficiency:** 60-75% reduction in drafting time.

## AI Tool Selection
- **Primary Recommendation:** **Claude 3.5 Sonnet** - Its superior writing style and ability to follow complex structural templates make it ideal for formal documentation.
- **Alternative(s):** **Gemini 1.5 Flash** - Fast and effective for generating initial drafts or specific sections like user stories.

### Specific Tool Notes
- Provide the AI with the `global-ai-principles.md` context to ensure the PRD is structured for a fixed-price delivery model (clear scope boundaries).

## AI-Integrated Workflow (Operational Steps)
1. **[Human Step]:** Provide the AI with the cleaned-up discovery notes and the "Alphonso PRD Template."
2. **[AI Step]:** Generate the full PRD, including User Stories, Functional Specs, and Technical Constraints.
3. **[AI Step]:** Ask the AI to "Generate a 'Scope Exclusion' section to explicitly list what is NOT being built," critical for fixed-price protection.
4. **[Human Step]:** Conduct a "Technical Feasibility Review" of the generated PRD and finalize.
