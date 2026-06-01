# Use Case: Unit Test Generation (QA)

## Activity Description
Writing small, isolated tests for individual functions and components to ensure they work as expected.

### Problems & Inefficiencies
- **Skipped Tests:** Under tight deadlines in a fixed-price model, devs often skip unit tests to save time.
- **Low Coverage:** Manual test writing is tedious, leading to "happy path only" testing.
- **Maintenance Burden:** Tests need to be updated whenever the code changes, doubling the work.

## AI-Native Reimagining
AI acts as a "Test Engineer" that writes the tests *alongside* the code. Instead of writing tests, the developer reviews and refines the AI-generated test suite. We aim for 80%+ coverage by default without extra human effort.

### Quality & Efficiency Improvements
- **Quality:** Exhaustive coverage of edge cases, error states, and boundary conditions.
- **Efficiency:** 75-90% reduction in time spent writing unit tests.

## AI Tool Selection
- **Primary Recommendation:** **Cursor (AI Code Editor)** - Its ability to read the file context and generate matching tests in one click is highly efficient.
- **Alternative(s):** **GitHub Copilot** - Good for real-time test suggestions as you type.

### Specific Tool Notes
- Use the "Add tests for this file" command in Cursor to generate a full Jest or Vitest suite instantly.

## AI-Integrated Workflow (Operational Steps)
1. **[Human Step]:** Finish writing a function or component.
2. **[AI Step]:** Use the AI editor to "Generate a comprehensive unit test suite for this file. Include edge cases like null/undefined inputs."
3. **[AI Step]:** Ask the AI to "Identify any logical flaws in my code that these tests might expose."
4. **[Human Step]:** Run the tests, fix any exposed bugs, and finalize the test suite.
