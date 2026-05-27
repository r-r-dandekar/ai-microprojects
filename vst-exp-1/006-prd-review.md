# To PRD

**Works on:** 001-intent.md, 003-decisions.md, 004-to-prd.md, 005-prd.md
**Output:** 005-prd.md

Review the PRD based on the intent, decisions and prd requirements. Look for any ambiguities, and complete the PRD to remove them. Ask questions to the user if needed.

---

This skill takes the current conversation context and codebase understanding, along with the previous documentation regarding the product description and decisions made, and the product requirement documentation. Then, it looks for any ambiguities that could lead to problematic or incorrect code being generated, and tries to eliminate them. Interview the user if needed.

The issue tracker and triage label vocabulary should have been provided to you — run `/setup-matt-pocock-skills` if not.

## Process

1. **Context Initialization**: 
   * Read and parse the current active workspace files: `001-intent.md`, `003-decisions.md`, and `004-to-prd.md`.
   * Cross-reference this information against any existing structural drafts inside `005-prd.md`.
   * Verify if the Matt Pocock Issue Tracker and Triage Label vocabulary is loaded. If it is missing, halt execution and prompt the user to run `/setup-matt-pocock-skills`.

2. **Ambiguity & Gap Analysis**:
   * Audit the product requirements for technical ambiguities, edge cases, missing data models, or conflicting architecture decisions.
   * Cross-reference feature requirements against the Issue Tracker label vocabulary to ensure triage pipelines match the product scope.

3. **User Interview (If Needed)**:
   * If critical requirements are missing or ambiguous (e.g., authentication flows, scale metrics, or edge cases), pause and generate a concise, numbered list of clarifying questions for the user.
   * Avoid making arbitrary assumptions about product architecture without explicit validation.

4. **PRD Synthesis**:
   * Compile all verified intent, architectural decisions, and requirements into a production-grade Product Requirement Document.
   * Format the final output cleanly into `007-prd.md`, completely eliminating placeholders, vague bullet points, or hand-waving technical specifications.