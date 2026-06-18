# Software Development PSA — Use Case Groupings

Use cases grouped by the **underlying data each one reads from / writes to** — i.e., which ones operate on the same tables. Where one tool's *output* is another's *input*, they belong in the same data cluster.

---

## Cluster A — Account & Deal data
*Entities: leads, companies, contacts, proposals, deal outcomes*

- **[Prospect Research](../usecases/pre-sales-discovery/prospect-research.md)** → *writes* the dossier record on a company/lead
- **[Personalized Proposal Generation](../usecases/pre-sales-discovery/personalized-proposal.md)** → *reads* the dossier, *writes* the proposal
- **[Win/Loss Analysis](../usecases/pre-sales-discovery/win-loss-analysis.md)** → *reads* proposals + deal outcomes, *writes* pattern insights (which feed back into Research & Proposal)

> Self-contained loop on one data object: the **Deal**.

---

## Cluster B — Requirements & Spec data
*Entities: discovery notes → requirements doc → PRD → feature/task breakdown → estimate*

- **[Discovery Note Structuring](../usecases/scoping-planning/discovery-note-structuring.md)** → raw notes *→* structured requirements
- **[PRD Generation](../usecases/scoping-planning/prd-generation.md)** → requirements *→* PRD
- **[Feature Estimation](../usecases/scoping-planning/feature-estimation.md)** → PRD features *→* task breakdown + hour ranges + quote

> A strict pipeline: each tool's output is literally the next tool's input. One growing **Project Spec** document, enriched stage by stage.

---

## Cluster C — Engineering activity & project telemetry
*Entities: PRs, commits, code-review comments, task status (Linear), velocity, estimate-vs-actual*

- **[Intelligent Code Review](../usecases/build/intelligent-code-review.md)** → *generates* PR review data + quality/severity signals on the repo
- **[Status Report Automation](../usecases/project-management/status-report-automation.md)** → *reads* git/PR activity + Linear + (code-review output) → status report
- **[Delivery Risk Dashboard](../usecases/project-management/delivery-risk-dashboard.md)** → *reads* velocity + estimates (from Cluster B) vs actual git/task progress → risk scores

> The PR-reviewer **produces** the activity/quality data; the status reporter and risk dashboard **consume** it. Same data substrate — live repo + task telemetry.

---

## Cluster D — Portfolio / capacity data *(cross-cluster reader)*

- **[Resource Optimization](../usecases/operations-hr/resource-optimization.md)** → *reads* estimates (Cluster B) + active delivery load & velocity (Cluster C) across **all** projects → capacity model

> Owns little data of its own; it's an aggregation layer over B + C at the portfolio level.

---

## Cluster E — Completed-project corpus
*Entities: finished PRDs, git logs, status reports, indexed docs/Slack/Notion*

- **[Case Study Pipeline](../usecases/marketing-brand/case-study-pipeline.md)** → *reads* the closed project's PRD (B) + git log + status reports (C) → case study (which feeds back to Cluster A proposals)
- **[Living Knowledge Base](../usecases/operations-hr/knowledge-base.md)** → *indexes* everything from A–C → queryable RAG corpus

> Both feed on the **exhaust** of the other clusters. The Knowledge Base is effectively the read-layer over the entire data model.

---

## Data-dependency map

```
A (Deal) ──► B (Spec) ──► C (Telemetry) ──► E (Corpus)
  ▲                          │                  │
  │            D (Capacity) ◄─┴── reads B+C      │
  └──────────────── case studies / KB ──────────┘
                    (E feeds back into A)
```

**Build takeaway:** the real shared data backbone is **B → C** (a project's Spec and its live Telemetry, joined on `project_id`). A sits upstream as the CRM layer, E sits downstream as the read/index layer, and D is a portfolio-level query across B + C. Build the Spec and Telemetry data models first and tightly; the other three clusters mostly become readers/writers around them.
