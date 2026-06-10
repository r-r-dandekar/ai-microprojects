# Website Decisions

**Generated from:** website/002-brainstorm.md

---

## Tech Stack
- Plain HTML/CSS/JavaScript
- Supabase JavaScript SDK for backend connectivity

## Structure
- Single-page website with scroll-based navigation
- Sections: Home / What We Do / Work With Us / Contact

## Sections

### Hero
- Tagline + subheading + single CTA button ("Get in Touch")

### What We Do
- 6 items: icon + title + one-line description
- Based on the 6 service points in 001-intent.md

### Work With Us (Pricing)
- Three cards: Hourly, Retainer, Project-Based
- No prices listed — describe each model and who it suits
- Each card directs to the contact form

### Contact
- Form fields: Name, Email, Message, Submit
- Brief line setting response time expectation (e.g., "I'll respond within 2 business days")
- Submissions stored in Supabase

## Backend
- Contact form submissions stored in Supabase database
- No user login or authentication

## Hosting
- Netlify (free tier)
- Domain: Netlify subdomain for now (e.g., parardha.netlify.app)

## Responsiveness
- Mobile-first, fully responsive
