# Portfolio Intelligence

**Phase:** Marketing & Brand
**Estimated Time Saved:** ~80%
**Software Solution:** ✅ Yes

---

## The Problem

Alphonso's portfolio website is perpetually out of date. New projects are completed but not added for months. Old case studies lack the metrics and testimonials that would make them convincing. The website doesn't reflect the agency's current capabilities because keeping it current requires manual effort that never gets prioritised. Prospective clients visit the portfolio and see a less impressive version of Alphonso than the reality — costing deals without anyone realising.

---

## AI-Native Workflow

> **Pipeline:** Project closes → portfolio entry auto-drafted → testimonial requested from client → portfolio site updated → SEO metadata generated

**Steps:**

1. ⚡ **Trigger** — Project is marked complete and case study is approved (from Case Study Pipeline)
2. 🤖 **AI** — Claude generates a portfolio page entry: project summary (100 words), tech stack badge list, key deliverables, and a pull quote placeholder
3. 🤖 **AI** — Claude drafts a personalised testimonial request email to the client: specific about what to comment on (the outcome, working with the team, the technical quality), with a 2–3 sentence suggested testimonial they can approve or edit
4. 🔗 **Integration** — n8n sends the testimonial request email via Gmail and sets a follow-up reminder for 7 days
5. 👤 **Human Override Point** — PM reviews the portfolio entry draft and the testimonial request email. Adjusts anything specific to the client relationship.
6. 🔗 **Integration** — On testimonial receipt, n8n adds it to the portfolio entry and publishes the complete page to the portfolio CMS
7. 🤖 **AI** — Claude generates SEO metadata and a social announcement post for the new portfolio addition
8. 🔗 **Integration** — Social post is fed into the Social Content Engine for scheduling

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude** | Portfolio entry drafting, testimonial request email, SEO metadata |
| **n8n** | Trigger → draft → testimonial request → CMS publish pipeline |
| **Webflow / Contentful / Sanity** | Portfolio CMS |
| **Gmail API** | Automated testimonial request and follow-up |

---

## Prompt Templates

### Generate Testimonial Request Email
```
You are a project manager at Alphonso Solutions. Write a personalised email requesting a testimonial from a client whose project just completed.

Client name: [CLIENT NAME]
Client role: [e.g., CTO, Founder, Head of Product]
Project: [PROJECT NAME]
Key outcome delivered: [ONE SPECIFIC, MEASURABLE OUTCOME]
Working relationship notes: [any notable positive moments, challenges overcome, personal rapport]

Write an email that:
1. Opens by referencing the specific project outcome (not generic "we enjoyed working with you")
2. Explains that the testimonial will be used on Alphonso's portfolio and in proposals
3. Provides a 2-3 sentence suggested testimonial they can approve, edit, or replace
4. Makes it easy to respond — one click to approve the suggestion or reply with their own version
5. Ends with gratitude that feels genuine, not corporate

Subject line: [suggest 2 options]
Length: under 150 words. Respectful of their time.
```

---

## 🛠 Software Solution

### What It Does
A portfolio management system that automatically generates new portfolio entries at project completion, manages the testimonial collection workflow, keeps the public portfolio site up to date, and tracks which portfolio pieces are driving enquiries.

### Suggested Stack
- **Frontend:** Next.js — portfolio management dashboard: entry editor, testimonial tracker, publication status
- **Backend:** Supabase — portfolio entries, testimonials, tags, publication status
- **AI Layer:** Claude API
- **Integrations:** CMS API (Webflow/Contentful), Gmail API (testimonial outreach), Social Content Engine (social announcements), Analytics (track which portfolio entries appear in winning deals)

### Key Features
- Auto-trigger from project completion
- Testimonial pipeline: request → reminder → receipt → publication
- Portfolio analytics: which entries are viewed most, which are included in winning proposals
- Tag and filter by industry, stack, and project type (mirrors the proposal case study library)
- "Refresh" trigger — re-generate SEO metadata and entry copy for older portfolio items that are stale
