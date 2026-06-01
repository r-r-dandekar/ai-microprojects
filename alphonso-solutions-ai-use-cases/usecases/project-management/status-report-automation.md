# Use Case: Status Report Automation (PM)

## Activity Description
Generating weekly or bi-weekly project status reports for clients, detailing progress, blockers, and upcoming milestones.

### Problems & Inefficiencies
- **Time Sink:** PMs or leads spend Friday afternoons manually aggregating data from Jira, Slack, and Git commits.
- **Inconsistency:** Some reports are detailed, others are sparse, leading to varying client satisfaction.
- **Human Bias:** Reports may downplay blockers or overpromise on timelines due to manual drafting.

## AI-Native Reimagining
The status report becomes a "System-Generated Narrative." AI ingests the activity from the project's ecosystem (GitHub, Linear/Jira, Slack) and drafts a professional, balanced report. The human becomes a "Strategic Editor" instead of a "Data Aggregator."

### Quality & Efficiency Improvements
- **Quality:** Data-driven accuracy; consistent professional tone; proactive identification of risks.
- **Efficiency:** 80-90% reduction in reporting time.

## AI Tool Selection
- **Primary Recommendation:** **Gemini 1.5 Pro** - Its large context window can process thousands of lines of commit messages and task descriptions to find the "story" of the week.
- **Alternative(s):** **Claude 3.5 Sonnet** - Excellent for adjusting the tone for different client personalities (e.g., "Technical Lead" vs. "Non-Technical Founder").

### Specific Tool Notes
- Use a "System Prompt" that defines Alphonso's specific reporting brand voice (e.g., "Always lead with the 'Win of the Week'").

## AI-Integrated Workflow (Operational Steps)
1. **[Human Step]:** Export the week's Git commit log and task status (from Linear/Jira).
2. **[AI Step]:** Feed the data into the AI with the prompt: "Summarize this week's technical progress into a client-facing status report. Highlight 3 key achievements and any potential risks."
3. **[AI Step]:** Ask the AI to "Identify any discrepancies between completed code (commits) and reported task status."
4. **[Human Step]:** Review the draft, add specific client context or personal notes, and hit "Send."
