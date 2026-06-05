# Social Content Engine

**Phase:** Marketing & Brand
**Estimated Time Saved:** ~90%
**Software Solution:** ❌ No

---

## The Problem

Alphonso's social presence is inconsistent — posting when there's time, going dark for weeks, sharing generic content that looks identical to every other agency. The team knows social presence drives inbound leads, but context-switching from engineering mode to marketing mode feels jarring, and no one person owns it. The result: completed projects, technical insights, and team achievements that would make compelling content are never shared. The agency's real work remains invisible.

---

## AI-Native Workflow

> **Pipeline:** Project milestone or content input → AI generates a week's worth of platform-optimised posts + visuals → scheduled automatically

**Steps:**

1. ⚡ **Trigger** — Weekly (Monday), or immediately when a project milestone is hit / a blog post is published
2. 👤 **Human Override Point** — Content coordinator (any team member) provides one input: a project win, a published blog post URL, a technical insight, a team update, or a case study
3. 🤖 **AI** — Claude generates a full content batch:
   - 3 LinkedIn posts with different angles (educational, behind-the-scenes, results-focused)
   - 5 short-form posts for X/Twitter
   - 1 longer LinkedIn article draft (if a blog post was the input)
   - 3 content hooks that could be turned into short video scripts
4. 🤖 **AI** — DALL·E 3 or Adobe Firefly generates 3 accompanying visual concepts (image descriptions or actual images) to accompany the LinkedIn posts
5. 🤖 **AI** — Claude schedules the content across the week: Monday (educational), Wednesday (behind-the-scenes), Friday (result/celebration)
6. 👤 **Human Override Point** — Content coordinator reviews the batch, removes anything off-brand, makes small tweaks, and approves
7. 🔗 **Integration** — Approved posts are scheduled in Buffer/Hootsuite for automatic publishing at the optimal time for each platform

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude** | Post generation — tone, platform optimisation, brand voice |
| **DALL·E 3 / Adobe Firefly** | Generating accompanying visuals and social cards |
| **Canva AI** | Formatting visuals to brand templates |
| **Buffer / Hootsuite** | Scheduling and publishing |
| **n8n** | Trigger → generation → scheduling pipeline |

---

## Prompt Templates

### Generate Weekly Content Batch
```
You are a social media strategist for Alphonso Solutions, a boutique software agency specialising in custom web and mobile apps for startups and SMBs.

Brand voice: professional but not corporate, technically credible, direct and specific (no buzzwords), occasionally self-deprecating.

Content input: [PASTE — a project milestone, blog post URL, technical insight, or team update]

Generate a weekly content batch:

**LinkedIn Post 1 — Educational angle**
Lead with a specific insight or lesson. Not a listicle. 150-200 words. End with a question to drive comments.

**LinkedIn Post 2 — Behind-the-scenes angle**
Show the team's real work: a challenge faced, a decision made, a problem solved. 100-150 words. First-person.

**LinkedIn Post 3 — Results angle**
Highlight a specific, measurable outcome from the work. Lead with the number. 80-100 words.

**X/Twitter Posts (5)**
Each under 250 characters. Vary the angle: provocative take, useful tip, specific fact, question, celebration.

**Visual concepts (3)**
Describe 3 images or graphics that would complement the LinkedIn posts. Include: subject, style (photo / illustration / data viz), and key text overlay if any.

**Suggested posting schedule:**
Mon: [post title] | Wed: [post title] | Fri: [post title]
X/Twitter: [day for each]
```

---

## Notes

- Give Claude 3–5 examples of Alphonso's best-performing past posts before generating new content. This "few-shot" context significantly improves tone matching.
- The best source content for social posts is the "Win of the Week" from weekly status reports. Set up an n8n automation to forward each week's win directly to the content batch generator.
- Do not try to cover everything — one specific, well-chosen content input per week produces better output than dumping everything in at once.
