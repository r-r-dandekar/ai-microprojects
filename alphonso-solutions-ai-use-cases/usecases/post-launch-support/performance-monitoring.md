# Proactive Performance Monitoring

**Phase:** Post-Launch & Support
**Estimated Time Saved:** ~65%
**Software Solution:** ❌ No

---

## The Problem

Alphonso's clients often discover performance problems before the team does — a slow page, an intermittent error, a spike in support tickets that nobody connected to a deployment. By the time a developer is investigating, the client is already frustrated and asking why they weren't told. Reactive monitoring is the default because setting up proactive alerting requires time to configure, tune, and maintain — and after a project is delivered, there's no obvious owner. The result is a reactive support posture that damages client trust and creates surprise fire-fighting work.

---

## AI-Native Workflow

> **Pipeline:** Continuous monitoring → AI detects anomaly patterns → classifies severity → alerts team → drafts client update → generates post-mortem report

**Steps:**

1. ⚡ **Trigger** — Continuous: performance monitoring tools (Sentry, Datadog, Vercel Analytics) detect an anomaly or error spike
2. 🔗 **Integration** — Monitoring tool fires a webhook to n8n when an alert threshold is crossed
3. 🤖 **AI** — Claude analyses the alert data:
   - What type of anomaly is this? (Error spike, latency increase, traffic drop, failed jobs)
   - Is this related to a recent deployment? (Check GitHub Actions for recent deploys)
   - What is the likely user impact? (How many users affected, which features)
   - Is this a new issue or a recurrence of a known pattern?
4. 🤖 **AI** — Claude classifies the severity (Critical / High / Medium / Low) and determines whether immediate action is required or it can wait for business hours
5. 🔗 **Integration** — Alert summary is posted to the relevant project Slack channel with severity, analysis, and recommended first steps. For Critical issues, the on-call developer is directly mentioned.
6. 🤖 **AI** — If the issue persists for 30+ minutes: Claude drafts a client status update explaining the situation, what is being done, and the expected resolution timeline
7. 👤 **Human Override Point** — Developer reviews the analysis and recommended first steps. Approves the client status update before it is sent.
8. 🤖 **AI** — After resolution: Claude generates a Post-Mortem Report: timeline of events, root cause, resolution steps taken, and preventive measures to avoid recurrence

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Sentry** | Error tracking and alerting |
| **Datadog / Vercel Analytics** | Performance metrics and anomaly detection |
| **Claude** | Alert analysis, severity classification, client update drafting, post-mortem generation |
| **n8n** | Monitoring webhook → Claude analysis → Slack alert + client email |
| **PagerDuty** | On-call escalation for Critical issues |

---

## Prompt Templates

### Analyse Performance Alert
```
You are a senior site reliability engineer at Alphonso Solutions.

Analyse the following performance alert and determine the appropriate response.

Project: [PROJECT NAME]
Alert from: [SENTRY / DATADOG / VERCEL]
Alert type: [ERROR SPIKE / LATENCY INCREASE / DOWNTIME / FAILED JOBS]
Alert data:
[PASTE ALERT DETAILS — error message, count, affected endpoints, timestamp]

Recent deployments (last 24 hours):
[PASTE DEPLOYMENT LOG]

1. **What happened:** One sentence description of the anomaly
2. **Likely cause:** Most probable root cause based on the alert data and recent deployments
3. **User impact:** Which users are affected and how severely
4. **Severity classification:** Critical / High / Medium / Low (with reasoning)
5. **Immediate action:** What should the on-call developer do first?
6. **Is client communication needed?** Yes / No (if yes, within what timeframe?)
```

### Draft Client Incident Update
```
Draft a client status update for the following incident.

Client: [CLIENT NAME]
Client communication style: [FORMAL / INFORMAL] [TECHNICAL / NON-TECHNICAL]
Incident: [BRIEF DESCRIPTION]
Start time: [TIME]
Current status: [INVESTIGATING / IDENTIFIED / RESOLVING / RESOLVED]
Impact: [WHAT IS AFFECTED]
Expected resolution: [TIME / "under investigation"]

Write a status update that:
- Acknowledges the issue without being defensive
- Explains the impact in the client's language (not technical jargon)
- States what is being done
- Sets a clear expectation for the next update
- Is under 100 words

Do not: speculate on the cause, make promises you can't keep, or use corporate apology language.
```

### Generate Post-Mortem Report
```
Generate a post-mortem report for the following incident.

Project: [PROJECT NAME]
Incident period: [START TIME to END TIME]
Severity: [CRITICAL / HIGH / MEDIUM]

Timeline of events:
[PASTE CHRONOLOGICAL LIST OF EVENTS with timestamps]

Root cause: [DESCRIPTION]
Resolution: [WHAT FIXED IT]

Write a post-mortem with:
1. **Summary** — what happened, when, and impact (2 sentences)
2. **Timeline** — formatted chronological timeline
3. **Root Cause Analysis** — technical explanation of why this happened
4. **Resolution** — what was done to fix it
5. **Preventive Measures** — 3-5 specific changes to prevent recurrence (infrastructure, code, monitoring)
6. **Action Items** — specific tasks, each with an owner and due date
```

---

## Notes

- Set up Sentry for every project at the start of the build phase, not after launch. Retroactively adding monitoring to a live app is harder and often done incompletely.
- Configure alert thresholds carefully: alerts that fire too frequently get ignored. Start with only the two most critical metrics: unhandled errors above a baseline and p95 latency above 2s.
- The post-mortem template is as valuable for internal learning as it is for client communication. File every post-mortem in the Knowledge Base — it's some of the most useful institutional memory the team can accumulate.
