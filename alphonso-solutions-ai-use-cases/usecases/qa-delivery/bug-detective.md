# Bug Detective

**Phase:** QA & Delivery
**Estimated Time Saved:** ~60%
**Software Solution:** ❌ No

---

## The Problem

Bug reports from clients range from "it's broken" to a single screenshot with no reproduction steps. Turning a vague report into a confirmed, reproducible bug — with an identified root cause — currently takes anywhere from 30 minutes to several hours of a developer's time. They read logs, trace execution paths, add debug statements, and try to reproduce the issue from memory. This investigative overhead consumes engineering capacity that should be spent on delivery, and it intensifies under deadline pressure.

---

## AI-Native Workflow

> **Pipeline:** Vague bug report received → AI ingests all context → produces 3 root cause hypotheses → generates reproduction script → developer confirms and fixes

**Steps:**

1. ⚡ **Trigger** — Bug report received from client or internal QA
2. 🔗 **Integration** — Developer collects: the bug report, relevant error logs (from Sentry/Datadog), the affected code files, and any recent git changes that may have introduced the issue
3. 🤖 **AI** — Gemini Pro (large context window) ingests all materials simultaneously — error logs, stack traces, multiple code files, recent diff — and produces 3 ranked hypotheses for the root cause, each with supporting evidence from the materials provided
4. 🤖 **AI** — Claude generates a reproduction script or test case that would trigger the bug based on the most likely hypothesis. Also generates the passing test that would confirm the fix.
5. 👤 **Human Override Point** — Developer runs the reproduction script to confirm the bug is reproducible. If the hypothesis is wrong, provides feedback and the AI generates alternative hypotheses.
6. 🤖 **AI** — Once the root cause is confirmed, Claude suggests a fix with an explanation of why it resolves the issue without introducing regressions
7. 👤 **Human Override Point** — Developer reviews and applies the fix, runs the confirmation test, and commits

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Gemini Pro** | Large context window — ingests logs, multiple code files, and diffs simultaneously |
| **Claude** | Generating reproduction scripts, test cases, and fix suggestions |
| **Sentry / Datadog** | Source of structured error logs and stack traces |
| **Cursor** | Applying the fix within the editor with full codebase context |

---

## Prompt Templates

### Generate Root Cause Hypotheses
```
You are a senior debugging specialist at Alphonso Solutions.

Analyse the following bug report and produce 3 ranked hypotheses for the root cause.

Bug report from client:
[PASTE BUG REPORT]

Error logs / stack trace:
[PASTE LOGS]

Relevant code files:
[PASTE CODE — include the file where the error originates and any upstream callers]

Recent git changes (last 5 commits affecting this area):
[PASTE GIT DIFF or COMMIT SUMMARIES]

For each hypothesis:
1. Root cause: What specifically is causing the bug
2. Evidence: Which specific lines in the logs or code support this hypothesis
3. Confidence: High / Medium / Low
4. Reproduction path: The exact sequence of actions that would trigger the bug

After the 3 hypotheses, produce:
**Recommended investigation order** — which hypothesis to test first and why
```

### Generate Reproduction Script
```
Based on the following root cause hypothesis, generate a reproduction script.

Hypothesis: [PASTE HYPOTHESIS]
Tech stack: [TECH STACK]
Test framework: [Jest / Vitest / Playwright]

Generate:
1. A failing test that reproduces the bug (it should fail right now)
2. A passing test that confirms the fix (it should pass after the fix is applied)
3. Any setup or mock data required to run the test

The reproduction test should isolate the exact failing behaviour. Do not test unrelated code paths.
```

---

## Notes

- Always provide Gemini Pro with the full error log, not just the top of the stack trace. The root cause is often several frames down.
- For intermittent bugs ("it happens sometimes"), ask the AI to analyse whether the issue is a race condition, a timing dependency, or a non-deterministic data state.
- After a bug is fixed, ask Claude to review the fix for regressions: "Does this change affect any other code paths that call this function?"
