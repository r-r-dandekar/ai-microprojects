# E2E Regression Testing

**Phase:** QA & Delivery
**Estimated Time Saved:** ~80%
**Software Solution:** ❌ No

---

## The Problem

Before every release, someone has to manually click through the entire application to check that nothing is broken. This takes 30–90 minutes per release, grows as the application grows, and still misses things. Traditional automated E2E tests (Selenium, older Playwright patterns) are notoriously brittle: they break every time a CSS class or element ID changes, and maintaining them becomes a second job. The result is that most agencies either skip E2E automation or maintain a fragile test suite that nobody trusts. "Release anxiety" — the fear of shipping — becomes a cultural problem.

---

## AI-Native Workflow

> **Pipeline:** User flows defined in plain English → Playwright + AI generates intent-based tests → tests self-heal on UI changes → runs on every PR automatically

**Steps:**

1. ⚡ **Trigger** — Project enters QA phase, or a new major feature is added
2. 👤 **Human Override Point** — Developer/PM defines the critical user flows in plain English (e.g., "User signs up, verifies email, completes onboarding, creates a project, invites a team member, and logs out")
3. 🤖 **AI** — Claude generates Playwright test scripts from the plain-English flow descriptions. Tests use role-based and semantic selectors (not fragile CSS classes) to be resilient to UI changes.
4. 🔗 **Integration** — Tests are committed to the repo. A GitHub Action runs the full E2E suite on every PR against a staging environment.
5. 🤖 **AI** — On failure: Claude analyses the failure (screenshot + error message) and determines whether it is a genuine regression or a test that needs updating due to an intentional UI change. Posts the analysis as a PR comment.
6. 🤖 **AI** — Monthly: Claude reviews the test suite and identifies flows that need new coverage based on recent feature additions (by analysing the git log).
7. 👤 **Human Override Point** — Developer reviews AI-flagged failures: approves genuine bugs for fixing, updates tests that broke due to intentional changes

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Playwright** | E2E test runner — modern, reliable, excellent TypeScript support |
| **Claude** | Generating test scripts from plain-English flows; failure analysis |
| **Checkly** | Monitoring: run Playwright tests on a schedule against production |
| **GitHub Actions** | Run tests on every PR against a preview deployment |

---

## Prompt Templates

### Generate Playwright E2E Test from User Flow
```
You are a senior QA engineer at Alphonso Solutions.

Generate a Playwright test for the following user flow.

Application: [APP NAME]
Base URL (staging): [STAGING URL]
Tech stack: [FRONTEND STACK]

User flow:
[DESCRIBE THE FLOW IN PLAIN ENGLISH — e.g., "User navigates to /login, enters valid credentials, clicks Login, is redirected to /dashboard, sees their name in the top navigation"]

Authentication (if needed): [Describe how to authenticate — e.g., "Use test user: test@example.com / TestPass123"]

Requirements for the test:
1. Use role-based selectors (getByRole, getByLabel, getByText) — never use CSS classes or IDs
2. Include explicit wait assertions (not arbitrary time delays)
3. Test the happy path completely
4. Add assertions for error states: what if the form is submitted empty? What if credentials are wrong?
5. Include a screenshot on failure
6. The test must pass on both Chrome and Mobile Chrome viewport

Generate the full Playwright test file.
```

### Analyse E2E Test Failure
```
A Playwright E2E test has failed. Determine whether this is a genuine regression or a test that needs updating.

Test name: [TEST NAME]
Error message: [ERROR OUTPUT]
Screenshot description or URL: [SCREENSHOT]

Recent changes in this PR (git diff summary):
[PASTE RELEVANT DIFF]

Answer:
1. Is this a genuine regression (a bug introduced by the PR)? OR is this a test that needs updating because the UI was intentionally changed?
2. If it is a genuine regression: what is the most likely cause based on the diff?
3. If the test needs updating: what specific change should be made to the test?
```

---

## Notes

- Do not generate E2E tests for every possible user flow. Focus on the **critical paths** — the flows where a failure would prevent a user from completing a core action (sign up, purchase, core feature use).
- Run E2E tests against a staging environment, not production. Use Checkly to run a lighter "smoke test" set against production after each deployment.
- Treat E2E test maintenance as part of the Definition of Done — when a UI change is made, the relevant test is updated in the same PR.
