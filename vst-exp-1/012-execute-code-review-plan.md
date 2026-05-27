# Execute Code Review

**Works on:** 005-prd.md, 008-architecture.md, 011-code-review-plan, Source/*

To review the code according to the generated plan. Do not modify 012-execute-code-review-plan.md. Only modify the code.

---

## Process

1. Read 006-prd.md thoroughly to understand:
   - Problem Statement
   - Solution approach
   - User Stories
   - Implementation Decisions
   - Testing Decisions
   - Modules to be built/modified

2. Read 008-architecture.md thoroughly to understand:
   - Major classes
   - Solution approach
   - Implementation Pitfalls and Workarounds
   - Modules to be built/modified

3. Explore the existing codebase to understand:
   - Current architecture
   - Module structure
   - Testing patterns and conventions
   - Coding standards
   - Dependencies and constraints

4. Check if the code correctly meets the requirements:
   - Build or modify modules as specified in Implementation Decisions
   - Follow the architectural decisions outlined in the PRD and architecture document
   - Check for logical or syntax errors
   - Check for edge cases
   - Check for features or specifications that haven't been implmemented
   - Check for features that are implemented, but are never called or initialized

5. Update the code to fix the problems:
   - Make sure you fix the problem without creating any new issues
   - Write clean, testable, well-documented code
   - Respect existing codebase patterns and conventions

6. Commit changes with clear, descriptive commit messages that reference the PRD

7. Ensure all tests pass before completing implementation

---

## Output

- Git commits with implementation code
- Tests accompanying the implementation
- Code follows project standards and conventions
- All changes traceable to PRD requirements
- A file giving directions and commands for building and installing the product.
