# To Code Review

**Works on:** 005-prd.md, 008-architecture.md, Source/*
**Output:** 011-code-review-plan.md

To generate a plan to review the code and check if meets the requirements correctly. Do not modify 010-to-code-review-plan.md. The output should be in 011-code-review-plan.md

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

4. List and describe the specific points to check and fix while reviewing:
    - Code should follow the architectural decisions outlined in the PRD and architecture document
    - Check for logical or syntax errors
    - Check for edge cases
    - Check for features or specifications that haven't been implemented
    - Check for features that are implemented, but are never called or initialized

---

## Output

A file (011-code-review-plan.md) containing a detailed list of things to be checked and reviewed.