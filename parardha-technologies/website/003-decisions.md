# Website Decisions

**Generated from:** website/002-brainstorm.md

---

## Tech Stack
- Plain HTML/CSS/JavaScript
- Supabase JavaScript SDK for backend connectivity

## Structure
- Single-page website with scroll-based navigation
- Sections: Home / How We Help / Work With Us / Contact
- (Revised 2026-06-11 after client feedback — see notes per section)

## Sections

### Hero
- Logo image (contains the small tagline beneath the name) + short, plain intro
  paragraph focused on the client + single CTA button ("Get in touch")
- No giant tagline title — that read as pretentious

### How We Help (was "What We Do")
- 6 cards, each framed as a client question (e.g. "Where does AI actually fit?")
  with a plain-language answer
- No emoji icons (read as flashy); no "selling who we are" subtitle
- Based on the 6 service points in 001-intent.md

### Work With Us (Pricing)
- Three cards: by the hour / on retainer / by the project
- No prices listed — describe each model and who it suits
- A single "Get in touch" button sits below the three cards (not one per card)

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
