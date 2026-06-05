# Use Cases Summary

A quick-reference overview of all 32 AI use cases across Alphonso's 8-phase agency lifecycle. Each entry links to the full use case file with the complete workflow, tools, and prompt templates.

---

## Phase 1 — Pre-Sales & Discovery

| Use Case | Summary | Software Solution |
|----------|---------|:-----------------:|
| [Prospect Research](./pre-sales-discovery/prospect-research.md) | An n8n pipeline automatically generates a full Client Dossier (pain points, tech stack signals, suggested questions) for every new lead overnight — before the sales call. | ✅ Yes |
| [Personalized Proposal Generation](./pre-sales-discovery/personalized-proposal.md) | Ingests the client dossier and discovery call notes to draft a fully tailored proposal within the hour, pulling from Alphonso's case study library to match relevant experience. | ✅ Yes |
| [Discovery Call Co-Pilot](./pre-sales-discovery/discovery-call-co-pilot.md) | Fireflies transcribes the call live; Claude then extracts requirements, flags scope creep signals, identifies contradictions, and produces a structured Discovery Brief within 15 minutes of the call ending. | ❌ No |
| [Win/Loss Analysis](./pre-sales-discovery/win-loss-analysis.md) | Automatically generates a deal post-mortem every time a deal closes, and produces a monthly pattern report surfacing which client types, proposal framings, and project types convert best. | ✅ Yes |

---

## Phase 2 — Scoping & Planning

| Use Case | Summary | Software Solution |
|----------|---------|:-----------------:|
| [Discovery Note Structuring](./scoping-planning/discovery-note-structuring.md) | Transforms a messy call transcript or raw notes into a structured requirements document using Alphonso's standard format, with a separate Gaps & Clarifications list and a drafted client follow-up email. | ✅ Yes |
| [PRD Generation](./scoping-planning/prd-generation.md) | Takes the structured requirements document and generates a complete PRD — user stories, functional specs, scope exclusions, and assumptions — using Alphonso's template. Produces the primary contractual document for fixed-price projects. | ✅ Yes |
| [Feature Estimation](./scoping-planning/feature-estimation.md) | Breaks every PRD feature into a granular FE/BE/DevOps/QA task breakdown with min/max hour ranges, compares against historical project data to assign confidence scores, and calculates a fixed-price quote. Gets smarter with every project logged. | ✅ Yes |
| [Scope Risk Analysis](./scoping-planning/scope-risk-analysis.md) | Scans the PRD across 8 risk categories (vague requirements, missing user flows, third-party dependencies, scope exclusion gaps, etc.) before the contract is signed, and recommends specific contract clauses to protect the fixed-price. | ❌ No |

---

## Phase 3 — Build

| Use Case | Summary | Software Solution |
|----------|---------|:-----------------:|
| [Project Scaffolding](./build/project-scaffolding.md) | A CLI/wizard generates Alphonso's full standard project structure — folder hierarchy, auth, DB schema, CI config, env vars — in minutes instead of hours, enforcing consistent architecture across all agency projects. | ✅ Yes |
| [API Integration](./build/api-integration.md) | Feeds third-party API documentation to AI, which generates a complete TypeScript service layer: typed interfaces, service class, React Query hooks, error handling, and a mock server for local development. | ❌ No |
| [Design to Code](./build/design-to-code.md) | Converts a Figma screenshot or export into a production-ready React + Tailwind component via v0.dev, then Claude applies the project's theme tokens, adds interactive states, and wires up the data layer. | ❌ No |
| [Intelligent Code Review](./build/intelligent-code-review.md) | A GitHub Action runs Claude on every PR, posting inline comments across five dimensions (bugs, security, performance, standards, test coverage) with severity labels, so human reviewers focus only on architecture and business logic. | ✅ Yes |

---

## Phase 4 — QA & Delivery

| Use Case | Summary | Software Solution |
|----------|---------|:-----------------:|
| [Unit Test Generation](./qa-delivery/unit-test-generation.md) | Generates a comprehensive test suite — happy paths, edge cases, null inputs, error states, and React Testing Library interaction tests — from any function or component, and flags logical flaws the tests expose. | ❌ No |
| [E2E Regression Testing](./qa-delivery/e2e-regression-testing.md) | User flows defined in plain English are turned into resilient Playwright tests using semantic selectors. Runs on every PR against staging. AI distinguishes genuine regressions from tests that need updating after intentional UI changes. | ❌ No |
| [Bug Detective](./qa-delivery/bug-detective.md) | Takes a vague bug report plus logs and code context, produces three ranked root cause hypotheses with supporting evidence, generates a reproduction script, and suggests a fix once the cause is confirmed. | ❌ No |
| [Client Acceptance Package](./qa-delivery/client-acceptance-package.md) | At project close, generates the full handoff package from PRD and git history: end-user manual, admin guide, technical handover document, and deployment checklist — all in one automated pipeline. | ❌ No |

---

## Phase 5 — Project Management

| Use Case | Summary | Software Solution |
|----------|---------|:-----------------:|
| [Status Report Automation](./project-management/status-report-automation.md) | Every Friday, pulls data from GitHub, Linear, and Slack to draft a client-facing status report with a Win of the Week, RAG status, blockers, and next week's plan — tailored to the client's communication profile. | ✅ Yes |
| [Delivery Risk Dashboard](./project-management/delivery-risk-dashboard.md) | Runs daily, comparing actual team velocity against the original estimates. Calculates milestone on-time probabilities, flags at-risk items weeks ahead of the deadline, and suggests re-prioritisation options. | ✅ Yes |
| [Client Communication AI](./project-management/client-communication-ai.md) | PM describes the situation and desired outcome; Claude loads the stored client communication profile and drafts a context-aware message (delay notice, scope change, payment request, etc.) with tone alternatives. | ✅ Yes |
| [Meeting Intelligence](./project-management/meeting-intelligence.md) | Fireflies transcribes every project meeting, then Claude automatically extracts decisions, action items (with owners), and scope changes — creates Linear tasks, updates project status, and drafts the follow-up email. | ❌ No |

---

## Phase 6 — Marketing & Brand

| Use Case | Summary | Software Solution |
|----------|---------|:-----------------:|
| [Case Study Pipeline](./marketing-brand/case-study-pipeline.md) | Triggers automatically at project completion, ingesting PRD, git log, and status reports to draft a full technical case study (Challenge → Architecture → Build → Impact). Published to the portfolio and fed into the proposal library. | ✅ Yes |
| [Social Content Engine](./marketing-brand/social-content-engine.md) | Turns a single input (project milestone, blog post, team win) into a full week's content: LinkedIn posts with multiple angles, Twitter/X posts, and visual concepts — scheduled automatically via Buffer. | ❌ No |
| [Technical Blog Generation](./marketing-brand/technical-blog-generation.md) | A developer spends 5 minutes describing a technical problem they solved; Claude drafts a full SEO-optimised blog post with production-quality code examples, documentation links, and metadata — ready to publish. | ❌ No |
| [Portfolio Intelligence](./marketing-brand/portfolio-intelligence.md) | Generates a portfolio page entry and a personalised testimonial request email at every project close, manages the testimonial collection workflow, and publishes the complete entry to the portfolio CMS automatically. | ✅ Yes |

---

## Phase 7 — Operations & HR

| Use Case | Summary | Software Solution |
|----------|---------|:-----------------:|
| [AI Hiring Pipeline](./operations-hr/hiring-pipeline.md) | Covers the full hiring cycle: JD generation, job board posting, CV screening and ranking against a structured rubric, tailored interview question generation, and offer letter drafting. | ✅ Yes |
| [Living Knowledge Base](./operations-hr/knowledge-base.md) | Continuously indexes Slack, Notion, GitHub, and past PRDs into a RAG-powered knowledge base. Developers query it in natural language and receive cited answers. Surfaces undocumented knowledge gaps weekly. | ✅ Yes |
| [Resource Optimisation](./operations-hr/resource-optimization.md) | Models team capacity over a 12-week horizon against current project loads and the incoming pipeline. Flags overallocation risks, identifies skill bottlenecks, and recommends team compositions for new projects. | ✅ Yes |
| [Smart Onboarding](./operations-hr/smart-onboarding.md) | Generates a personalised 30-day onboarding plan for each new hire, provides an AI assistant (powered by the Knowledge Base) to answer day-to-day questions, and produces structured check-in reports at day 15 and day 30. | ❌ No |

---

## Phase 8 — Post-Launch & Support

| Use Case | Summary | Software Solution |
|----------|---------|:-----------------:|
| [Intelligent Bug Triage](./post-launch-support/bug-triage.md) | Intercepts incoming bug reports from any channel, classifies severity and category, checks for duplicates, routes to the right developer, and sends an acknowledgment to the client — all within minutes of the report arriving. | ✅ Yes |
| [Automated Client Documentation](./post-launch-support/client-documentation.md) | On every production deployment, analyses the code diff to identify doc-impacting changes and automatically generates the updated documentation sections, with a change report for the reviewer to approve. | ❌ No |
| [Feature Request Intelligence](./post-launch-support/feature-request-intelligence.md) | Aggregates feature requests from all channels, deduplicates and tracks demand signals over time, and produces a monthly report with a prioritised backlog and a commercial upsell brief for the account manager. | ✅ Yes |
| [Performance Monitoring](./post-launch-support/performance-monitoring.md) | Connects to Sentry/Datadog; when an anomaly fires, AI classifies severity, identifies likely cause, alerts the team with recommended first steps, drafts the client status update, and generates a post-mortem after resolution. | ❌ No |

---

## Software Solution Count

| | Count |
|--|-------|
| Use cases with a software solution | **14** |
| Use cases without (workflow + tools only) | **18** |
| **Total** | **32** |
