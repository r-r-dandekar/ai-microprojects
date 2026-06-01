# Use Case: Discovery Note Cleanup (Pre-Dev)

## Activity Description
Taking messy, unstructured notes from client discovery meetings and organizing them into a coherent, structured format.

### Problems & Inefficiencies
- **Manual Synthesis:** Founders or senior leads spend hours re-reading and manually typing up notes.
- **Lost Requirements:** Critical details mentioned in passing are often missed in the manual cleanup.
- **Delayed Kickoff:** Drafting structured notes takes days, delaying the transition to the scoping phase.

## AI-Native Reimagining
Instead of "taking notes," we record the discovery session. AI then acts as a "Senior Analyst" that extracts every technical and business requirement, resolving ambiguities and flagging missing information instantly. The process moves from *re-typing* to *reviewing*.

### Quality & Efficiency Improvements
- **Quality:** Higher requirement accuracy; identifies contradictions in client statements during the cleanup.
- **Efficiency:** 80-90% reduction in time spent on initial note synthesis.

## AI Tool Selection
- **Primary Recommendation:** **Gemini 1.5 Pro** - Its massive 2M token context allows it to ingest hours of meeting transcripts or dozens of messy documents without losing detail.
- **Alternative(s):** **Claude 3.5 Sonnet** - Excellent for high-fidelity technical extraction and structured Markdown formatting.

### Specific Tool Notes
- Use Gemini's "System Instructions" to define the specific company-standard output format (e.g., "Always use Alphonso's requirement table format").

## AI-Integrated Workflow (Operational Steps)
1. **[Human Step]:** Record the discovery meeting (with client consent) or capture quick bulleted notes during the call.
2. **[AI Step]:** Feed the transcript/messy notes into the AI with a prompt to "Extract and structure all functional and non-functional requirements into a technical summary."
3. **[AI Step]:** Ask the AI to "Highlight any missing details or contradictions that need clarification from the client."
4. **[Human Step]:** Review the structured summary, add strategic nuance, and send to the client for instant validation.
