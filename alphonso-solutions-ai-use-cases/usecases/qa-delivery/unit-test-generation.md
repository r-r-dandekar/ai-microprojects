# Unit Test Generation

**Phase:** QA & Delivery
**Estimated Time Saved:** ~80%
**Software Solution:** ❌ No

---

## The Problem

In a fixed-price agency under delivery pressure, unit tests are the first thing that gets cut. Developers know they should write them, but writing a comprehensive test suite for a function takes almost as long as writing the function itself — and it produces nothing visible to the client. The result is projects shipped with minimal test coverage, regressions discovered late, and bugs in edge cases that a test would have caught in seconds. The irony is that poor test coverage costs far more time in debugging than writing tests would have saved.

---

## AI-Native Workflow

> **Pipeline:** Function or component written → AI generates full test suite in under 60 seconds → developer reviews and runs → coverage gaps reported

**Steps:**

1. ⚡ **Trigger** — Developer completes writing a function, hook, or component
2. 👤 **Human Override Point** — Developer triggers test generation in Cursor (or pastes the code into Claude) and confirms which test framework and testing library the project uses
3. 🤖 **AI** — Cursor/Claude analyses the code and generates:
   - Happy path tests for all expected inputs
   - Edge cases: null/undefined inputs, empty arrays, boundary values, maximum values
   - Error state tests: what happens when the function throws, when an API call fails
   - For React components: render tests, user interaction tests (with Testing Library), and snapshot tests where appropriate
4. 🤖 **AI** — Claude identifies any logical flaws in the source code that the generated tests expose — bugs that only become visible when you try to write a test for them
5. 👤 **Human Override Point** — Developer runs the test suite, reviews failing tests (are they exposing real bugs or incorrect test assumptions?), fixes any bugs found, and commits both the code and the tests together

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Cursor** | "Add tests for this file" command — context-aware, one-click test generation |
| **Claude** | More detailed test suites with complex edge cases and mocking strategies |
| **GitHub Copilot** | Real-time test suggestions as the developer types |
| **Vitest / Jest** | The test runner (project-dependent) |

---

## Prompt Templates

### Generate Comprehensive Unit Tests
```
You are a senior test engineer at Alphonso Solutions.

Generate a comprehensive unit test suite for the following code.

File: [FILENAME]
Test framework: [Jest / Vitest]
Testing libraries available: [e.g., @testing-library/react, msw, @testing-library/user-event]

Code to test:
[PASTE CODE]

Generate tests covering:
1. Happy path: all expected inputs produce the correct outputs
2. Edge cases:
   - Null and undefined inputs
   - Empty strings, arrays, and objects
   - Boundary values (min, max, zero)
   - Very large inputs
3. Error states:
   - What happens when async calls fail
   - What happens when required props are missing
   - What happens when the input format is wrong
4. For React components:
   - Renders correctly with required props
   - Renders correctly in loading state
   - Renders correctly in error state
   - Renders correctly in empty state
   - User interactions (clicks, form submissions, keyboard)

After the test suite, list:
**Potential bugs found** — any code behaviour that seems incorrect when you tried to write a test for it
**Coverage gaps** — any scenarios you could not test without refactoring the source code (indicates a testability issue)
```

---

## Notes

- Use Cursor's `@Codebase` indexing to ensure generated tests import correctly and use the project's existing test utilities and mocks.
- Aim for 80%+ coverage on all service layer files and custom hooks. UI components can be at 60%+.
- Tests should be committed in the same PR as the code they test — never as a separate "add tests" PR later.
