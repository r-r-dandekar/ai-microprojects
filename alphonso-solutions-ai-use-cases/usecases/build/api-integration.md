# API Integration

**Phase:** Build
**Estimated Time Saved:** ~70%
**Software Solution:** ❌ No

---

## The Problem

Integrating a third-party API (Stripe, Twilio, Google Maps, a client's existing backend) requires reading often-poor documentation, manually writing TypeScript interfaces for every request and response shape, writing boilerplate fetch wrappers, handling error states, and building a mock for local development. A mid-complexity integration (e.g., Stripe with checkout, webhooks, and subscription management) can take a developer 1–2 days. Most of this time is not spent thinking — it is spent reading documentation and translating it into boilerplate code.

---

## AI-Native Workflow

> **Pipeline:** API documentation provided → AI generates the entire service layer, types, hooks, and mock → developer integrates and validates

**Steps:**

1. ⚡ **Trigger** — Developer needs to integrate a new third-party API
2. 👤 **Human Override Point** — Developer identifies the relevant API documentation sections (or provides the URL) and the specific endpoints needed for this project
3. 🤖 **AI** — Gemini Pro (with Search) retrieves and reads the latest API documentation, then Claude generates:
   - TypeScript interfaces for all request and response shapes
   - A service class with typed methods for each endpoint
   - Error handling covering all documented error codes
   - React Query hooks (or SWR) for data-fetching endpoints
4. 🤖 **AI** — Claude generates a mock service that mirrors the real service interface, suitable for local development and unit testing without hitting the live API
5. 🤖 **AI** — Claude generates a test file covering the happy path, common error states, and edge cases for the service layer
6. 👤 **Human Override Point** — Developer integrates the generated code into the project, runs the tests, and makes a real API call to verify the integration works end-to-end

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Gemini Pro (with Search)** | Fetching and reading the latest version of third-party API documentation |
| **Claude** | Generating TypeScript service layer, types, hooks, mock, and tests |
| **Cursor** | In-editor refinement and integration into the existing codebase |

---

## Prompt Templates

### Generate API Service Layer
```
You are a senior TypeScript developer at Alphonso Solutions.

Generate a complete, type-safe service layer for the following API integration.

Project stack: [TECH STACK]
API: [API NAME — e.g., Stripe, Twilio, Resend]
Endpoints needed:
[LIST the specific endpoints from the documentation — e.g., POST /v1/payment_intents, GET /v1/customers/:id]

API documentation reference:
[PASTE RELEVANT DOCUMENTATION SECTIONS or provide the URL]

Generate:
1. TypeScript interfaces for all request payloads and response shapes
2. A service class with typed, async methods for each endpoint
3. Centralised error handling using the API's documented error codes
4. Environment variable configuration (add to .env.example)
5. React Query hooks for any GET endpoints (using @tanstack/react-query)
6. A mock service class that implements the same interface as the real service

Standards:
- No any types
- All async methods return typed Promises
- Errors throw typed custom error classes, not raw Error objects
- Follow the project's existing service file conventions
```

### Generate Integration Tests
```
Given the following API service class:

[PASTE SERVICE CLASS]

Generate a comprehensive test suite (Jest/Vitest) covering:
1. Happy path for each method
2. All documented error codes (mock the HTTP client to return error responses)
3. Edge cases: empty responses, pagination, rate limiting

Use Mock Service Worker (msw) to intercept HTTP calls rather than mocking the HTTP client directly.
```
