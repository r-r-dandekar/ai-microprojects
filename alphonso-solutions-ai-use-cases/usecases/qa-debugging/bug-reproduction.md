# Use Case: Bug Reproduction (QA)

## Activity Description
Taking a vague bug report from a client and creating a reproducible test case or script to isolate the issue.

### Problems & Inefficiencies
- **"Heisenbugs":** Intermittent issues that take hours of manual effort to trigger reliably.
- **Vague Reports:** Clients say "it's broken" without providing steps, forcing devs to play detective.
- **Capacity Drain:** Hunting bugs is the #1 drain on engineering capacity, especially late in a project.

## AI-Native Reimagining
AI acts as the "Lead Investigator." You feed it the bug report, the relevant code files, and even logs. The AI then hypothesizes the cause and writes a reproduction script or unit test that fails, proving the bug exists.

### Quality & Efficiency Improvements
- **Quality:** Faster time-to-resolution; prevents "band-aid" fixes by identifying the root cause.
- **Efficiency:** 50-70% reduction in time spent on bug reproduction and isolation.

## AI Tool Selection
- **Primary Recommendation:** **Gemini 1.5 Pro** - Its large context window allows it to analyze entire logs and multiple source files to find deep-seated logic errors.
- **Alternative(s):** **Claude 3.5 Sonnet** - Excellent for writing precise reproduction scripts in various languages.

### Specific Tool Notes
- Provide the AI with recent error logs and a dump of the relevant database schema to give it full context.

## AI-Integrated Workflow (Operational Steps)
1. **[Human Step]:** Paste the client's bug report and any available logs into the AI.
2. **[AI Step]:** Ask: "Based on these logs and the provided code, what are the most likely causes of this bug? Provide 3 hypotheses."
3. **[AI Step]:** Prompt: "Write a reproduction script (or unit test) that triggers this bug."
4. **[Human Step]:** Run the script to confirm the bug is reproducible, then use the AI to help draft the fix.
