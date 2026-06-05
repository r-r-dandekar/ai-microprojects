# AI Hiring Pipeline

**Phase:** Operations & HR
**Estimated Time Saved:** ~70%
**Software Solution:** ✅ Yes

---

## The Problem

Hiring at a small agency is painfully manual. Writing a job description takes 2–3 hours. Screening 50 CVs takes a full day. Preparing interview questions requires research. Drafting offer letters involves legal back-and-forth. Across a single hire, a founder or senior lead can spend 20–30 hours on process work rather than evaluation and conversation. The quality of hires also suffers: CV screening is inconsistent and biased by whoever is doing it, interview questions aren't systematically tailored to the role, and feedback is rarely structured. For a 10–50 person agency, a bad hire is a 6-month problem.

---

## AI-Native Workflow

> **Pipeline:** Role opens → JD generated → CVs screened → shortlist ranked → interview questions generated → offer letter drafted

**Steps:**

1. ⚡ **Trigger** — New role is opened (entered in the hiring tool)
2. 🤖 **AI** — Claude generates a full job description from a brief: role title, team context, required skills, and 3 bullet points on what makes Alphonso unique. Includes responsibilities, requirements, and a realistic "what success looks like in 90 days."
3. 🔗 **Integration** — JD is posted to LinkedIn, Indeed, and any other boards via API
4. 🤖 **AI** — As CVs arrive, Claude screens each one against a structured rubric: required technical skills match, relevant experience level, portfolio/GitHub quality signals, and any red flags. Produces a score and a 3-sentence summary per candidate.
5. 🤖 **AI** — Shortlisted candidates (above the score threshold) are ranked, and Claude generates tailored interview questions for each: technical questions based on their background, scenario questions based on the role, and culture/values questions based on Alphonso's working style
6. 👤 **Human Override Point** — Hiring manager reviews the shortlist, adjusts rankings based on any context not in the CV (referrals, prior contact), reviews the interview question set, and confirms who to interview
7. 🤖 **AI** — After interviews, Claude generates a structured evaluation summary from the interview notes provided by the interviewer
8. 🤖 **AI** — On hire decision: Claude drafts the offer letter and optionally the rejection emails for other candidates
9. 👤 **Human Override Point** — Founder reviews and signs off on the offer letter before it is sent

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude** | JD writing, CV screening, interview question generation, offer letters |
| **n8n** | CV ingestion pipeline, board posting, scoring automation |
| **Supabase** | Candidate database, scoring records, hiring history |
| **LinkedIn API / Job Board APIs** | Posting JDs, receiving applications |

---

## Prompt Templates

### Generate Job Description
```
You are writing a job description for Alphonso Solutions, a boutique software agency (10-50 people) building custom web and mobile apps for startups and SMBs. Fixed-price model. Flat team. Everyone ships real code.

Role: [JOB TITLE]
Team context: [2 sentences — what team they join, current projects or focus]
Required skills: [LIST]
Nice to have: [LIST]
Seniority level: [Junior / Mid / Senior / Lead]
Remote/hybrid: [ARRANGEMENT]

Write a job description with:
1. Opening paragraph: what makes this role interesting (specific, not generic — no "fast-paced startup environment")
2. What you'll do: 5-7 bullet points, concrete and specific
3. What we're looking for: required skills separated from nice-to-haves
4. What success looks like in 90 days: 3 specific, measurable outcomes
5. About Alphonso: 2 sentences, factual
6. What we offer: honest, specific benefits

Tone: direct and honest. Do not use: "passionate", "ninja", "rockstar", "dynamic", "synergy".
```

### Screen Candidate CV
```
You are screening a job applicant for Alphonso Solutions.

Role: [JOB TITLE]
Required skills: [LIST]
Seniority expected: [LEVEL]

CV:
[PASTE CV TEXT]

Evaluate against this rubric:
1. Technical skills match (0-10): Does their experience match our required skills?
2. Seniority signal (0-10): Is their experience level appropriate?
3. Portfolio/Work quality (0-10): Any public work (GitHub, projects, publications)?
4. Trajectory (0-10): Is their career moving in the right direction?
5. Red flags (-1 to -5 each): frequent short tenures, no concrete achievements, skills mismatch

Total score: [out of 40]
Recommendation: SHORTLIST / MAYBE / REJECT
Summary: 3 sentences — the most relevant thing about this candidate for this specific role.
```

---

## 🛠 Software Solution

### What It Does
An end-to-end hiring tool that manages the full candidate lifecycle: JD generation, job board posting, CV screening and ranking, interview question generation, and offer letter drafting. Builds a candidate database that makes future hiring faster.

### Suggested Stack
- **Frontend:** Next.js — role management, candidate pipeline (kanban: Applied → Screened → Interviewing → Offer → Hired/Rejected), interview prep view
- **Backend:** Supabase — roles, candidates, scores, evaluations, hiring decisions
- **AI Layer:** Claude API
- **Integrations:** LinkedIn API, email inbox (CV ingestion), Google Calendar (interview scheduling)

### Key Features
- Automated CV parsing and scoring on arrival — no manual processing
- Candidate comparison view — side-by-side scoring of shortlisted candidates
- Interview feedback form — structured, forces numerical ratings alongside free text
- Historical hiring data — track offer acceptance rates, time-to-hire, and source quality over time
- Rejection email templates — personalised, respectful, fast to send
