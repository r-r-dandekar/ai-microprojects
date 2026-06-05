# Scope Risk Analysis

**Phase:** Scoping & Planning
**Estimated Time Saved:** ~70% (currently done informally or not at all)
**Software Solution:** ❌ No

---

## The Problem

In a fixed-price model, the contract is signed before the team fully understands the complexity. Scope creep — clients adding, changing, or "clarifying" requirements mid-project — is the #1 cause of unprofitable projects. Most scope creep is predictable: it originates from vague requirements, absent user flows, underdefined third-party dependencies, or requirements that assume capabilities the client considers "obvious." A systematic risk review of the PRD before contract signature could prevent the majority of these losses, but currently this review is ad-hoc and relies entirely on the experience of whoever reads the PRD.

---

## AI-Native Workflow

> **Pipeline:** PRD approved → AI scans for 12 categories of scope risk → risk report with contract clause recommendations → final review before signing

**Steps:**

1. ⚡ **Trigger** — PRD is marked as approved and ready for quoting
2. 🤖 **AI** — Claude analyses the entire PRD against a fixed-price risk taxonomy covering: vague requirements, undefined user flows, third-party API dependencies, assumed platform behaviour, missing edge cases, timeline risks, and scope exclusion gaps
3. 🤖 **AI** — For each identified risk, Claude produces: the risk category, the specific PRD statement that is risky, the potential impact (time and cost), and a recommendation (clarify with client / add exclusion clause / add to change request process)
4. 🤖 **AI** — Claude drafts recommended additions to the Scope Exclusion section and suggested contract language for any high-risk items (e.g., "delays caused by third-party API availability are not included in the delivery timeline")
5. 👤 **Human Override Point** — Founder or lead reviews the risk report. High-risk items must be resolved before the contract is signed: either clarified with the client, written into scope exclusions, or reflected in a higher contingency in the quote.

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude** | PRD risk analysis — best for reading long documents and identifying nuanced scope risks |
| **GPT-4o** | Cross-check: use as a second opinion on the risk report for high-value contracts |

---

## Prompt Templates

### Full PRD Scope Risk Analysis
```
You are a senior solutions architect at Alphonso Solutions, a fixed-price software agency. Your job is to protect the agency from scope creep and unprofitable delivery by identifying risks in the PRD before the contract is signed.

Project: [PROJECT NAME]
Estimated value: [QUOTE AMOUNT]

Full PRD:
[PASTE FULL PRD]

Analyse the PRD for the following risk categories:

1. **Vague Requirements** — requirements that are too imprecise to estimate accurately (e.g., "fast loading", "easy to use", "admin panel")
2. **Missing User Flows** — user journeys that have functional requirements but no defined happy path or error path
3. **Third-Party Dependencies** — integrations where the API documentation, availability, or behaviour is not fully specified
4. **Assumed Platform Behaviour** — requirements that assume the behaviour of a framework, browser, or OS without specifying it
5. **Undefined Edge Cases** — features where error states, empty states, or boundary conditions are not specified
6. **Scope Exclusion Gaps** — things a client of this type would typically expect that are NOT in the Scope Exclusions section
7. **Timeline Risks** — any dependency that could delay delivery outside the team's control (client approval gates, third-party onboarding, content provision)
8. **Change Surface** — features that are likely to change during development based on the client's expressed uncertainty

For each risk found:
- **Risk:** One sentence description
- **PRD Reference:** Quote the relevant PRD text
- **Potential Impact:** Estimated additional hours if this becomes a problem
- **Recommendation:** Clarify with client / Add scope exclusion / Add contract clause / Adjust estimate

After the risk list, produce:
- **Top 3 Highest-Risk Items** with priority action for each
- **Recommended Contract Additions** — specific wording to add to the contract before signing
```

---

## Notes

- Run this analysis on every project above [£X] in value. For smaller projects, run only the "Top 3 Highest-Risk Items" version using the PRD summary.
- The output of this analysis feeds directly into the final scope exclusion section of the locked PRD and into the contract review conversation with the client.
- Keep a log of risks that materialised on past projects to build a Alphonso-specific risk taxonomy over time.
