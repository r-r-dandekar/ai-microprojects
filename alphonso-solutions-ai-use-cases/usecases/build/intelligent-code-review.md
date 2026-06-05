# Intelligent Code Review

**Phase:** Build
**Estimated Time Saved:** ~60%
**Software Solution:** ✅ Yes

---

## The Problem

Code review at a small agency is inconsistent. Senior developers catch issues when they have time; when they're busy, PRs get approved with a quick glance. Security vulnerabilities, performance anti-patterns, and deviations from Alphonso's coding standards slip through because no single reviewer has the mental bandwidth to check everything on every PR. Junior developers in particular receive sparse feedback, slowing their growth. And the review process itself adds friction to delivery — PRs sit for hours waiting for a human reviewer.

---

## AI-Native Workflow

> **Pipeline:** PR opened → AI review runs in under 2 minutes → inline comments posted on GitHub → human reviewer focuses only on architecture and business logic

**Steps:**

1. ⚡ **Trigger** — A pull request is opened or updated on GitHub
2. 🔗 **Integration** — GitHub Action fires, sends the PR diff to the code review pipeline
3. 🤖 **AI** — Claude analyses the diff across multiple review dimensions:
   - **Bugs:** Logic errors, off-by-one errors, unhandled async race conditions, null/undefined risks
   - **Security:** SQL injection patterns, XSS risks, exposed secrets, insecure auth patterns, missing input validation
   - **Performance:** N+1 query patterns, unnecessary re-renders, missing indexes referenced in queries, large bundle imports
   - **Alphonso Standards:** Naming conventions, file structure, TypeScript strictness, missing error handling
   - **Test coverage:** Are new functions covered? Are edge cases tested?
4. 🤖 **AI** — Claude posts inline comments directly on the relevant lines in the GitHub PR, with a severity label (blocking / suggestion / nitpick) and a specific fix recommendation
5. 🤖 **AI** — Claude posts a PR summary comment: overall quality assessment, count of blocking vs. suggestion issues, and a one-line verdict (Approve / Request Changes)
6. 👤 **Human Override Point** — Human reviewer reads the AI summary, focuses their attention on architecture, business logic, and any blocking issues the AI flagged. Makes the final approve/reject decision.

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude API** | Core review engine — best at following detailed, multi-dimensional review instructions |
| **GitHub Actions** | Trigger on PR open/update; post comments via GitHub API |
| **n8n** | Optional: more complex routing (e.g., skip review on certain file types or branches) |

---

## Prompt Templates

### Code Review Prompt (used inside GitHub Action)
```
You are a senior code reviewer at Alphonso Solutions, a software agency with high standards for TypeScript quality, security, and performance.

Review the following pull request diff. The project uses: [TECH STACK].

PR title: [PR TITLE]
PR description: [PR DESCRIPTION]

Diff:
[PR DIFF]

Review across these dimensions:

1. **Bugs (Blocking)** — Logic errors, race conditions, null/undefined risks, incorrect assumptions
2. **Security (Blocking)** — Input validation, auth checks, exposed data, injection risks, secrets in code
3. **Performance (Suggestion)** — N+1 queries, unnecessary renders, large imports, missing memoisation
4. **Code Standards (Suggestion)** — Naming, TypeScript strictness, file structure, error handling patterns
5. **Test Coverage (Suggestion)** — Missing tests for new code, untested edge cases

For each issue:
- File and line number
- Severity: [BLOCKING / SUGGESTION / NITPICK]
- Issue description (1–2 sentences)
- Recommended fix (specific code suggestion where possible)

End with a summary:
- Blocking issues: [count]
- Suggestions: [count]
- Verdict: APPROVE / REQUEST CHANGES
- One sentence overall comment
```

---

## 🛠 Software Solution

### What It Does
A GitHub-integrated AI code review system that automatically reviews every PR and posts inline comments. Learns Alphonso's specific standards over time and can be configured per project or per tech stack.

### Suggested Stack
- **Runtime:** GitHub Action (YAML workflow)
- **AI Layer:** Claude API
- **Config:** Per-repo `.alphonso-review.yml` file defining stack, standards, and which review dimensions to enable
- **Integrations:** GitHub API (post comments, update PR status), Slack (alert on blocking issues)

### Key Features
- Per-project configuration (some projects have stricter security rules, others have performance budgets)
- "Learning" from human decisions — when a human overrides an AI blocking comment and approves, that pattern is logged and the prompt is refined
- Review analytics dashboard: most common issue types by developer, improvement over time
- Skip rules: do not review auto-generated files, migrations, or vendor code
