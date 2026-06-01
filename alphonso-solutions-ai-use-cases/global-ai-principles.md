# Global AI Principles

To ensure high-quality outputs across all Alphonso use cases, follow these fundamental principles when interacting with AI models.

## 1. The Context is King
Never ask a "naked" question. Always provide:
- **Role:** (e.g., "Act as a Senior Solution Architect")
- **Task:** (e.g., "Draft a PRD based on these messy notes")
- **Context:** (e.g., "This is for a fixed-price web project for an SMB client")
- **Constraint:** (e.g., "Keep it under 3 pages")

## 2. Chain of Thought (CoT)
Encourage the AI to "think step-by-step."
- *Example:* "First, analyze the requirements for contradictions. Then, propose a data schema. Finally, write the API endpoints."

## 3. Few-Shot Prompting
Provide examples of the desired output style or format.
- *Example:* "Format the report like this example: [Example]"

## 4. Iterative Refinement
The first output is rarely the final one.
- Use "Critique your own response for [specific criteria]" to improve quality.
- Use "Rewrite this to be more [concise/technical/professional]" to adjust tone.

## 5. Structured Data
Request outputs in formats that are easy to use (Markdown, JSON, CSV).
- *Example:* "Provide the feature list as a Markdown table with columns for 'Feature', 'Complexity', and 'Priority'."

## 6. The "Human-in-the-Loop" Mandate
AI generates; Humans validate. Always check for:
- Hallucinations (especially in technical documentation).
- Alignment with client-specific constraints.
- Security best practices (never leak keys or follow insecure patterns suggested by AI).
