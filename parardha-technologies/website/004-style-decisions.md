# Style Decisions

**Generated from:** website/002-brainstorm.md
**Revised:** 2026-06-11 after client feedback. Where this conflicts with the
original brainstorm, the feedback takes precedence. The guiding principle is now
**genuine and human, not flashy or pretentious.**

---

## Colors
- **Background:** Warm off-white (#faf8f5), with a slightly deeper alt tone (#f2ede6) for alternating sections
- **Cards / surfaces:** White (#ffffff)
- **Primary accent:** #FF9966 (Coral-Orange) — used sparingly for buttons, links, and small accents
- **Text:** Warm near-black (#2c2a28); muted grey (#6b665f) for secondary text

> Changed from the original dark charcoal "premium tech" theme. The dark
> background with glowing-orange gradients read as flashy. A light, warm,
> editorial layout feels more honest and approachable.

## Typography
- **Font family:** DM Sans (matches the logo, which is set in DM Sans)
- **Feel:** Warm, neutral, readable

> Changed from Space Grotesk. DM Sans is what the logo uses and is less
> overtly "techy".

## Logo
- Use `parardha-logo.png` in the hero (high-res, renders consistently).
- The logo already contains the tagline ("Scale Infinitely, Win Strategically…")
  beneath the name in small grey caps — this satisfies the requirement that the
  tagline be small and sit under the logo, rather than being a giant hero title.
- Nav uses a plain text wordmark.

## Layout
- Single-page, scroll-based
- Mobile-first, fully responsive
- Generous whitespace; no large hero title

## Animations
- One gentle fade-in as sections scroll into view (16px rise, ~0.55s)
- No hover-lift, no glow, no gradient effects
- Respects `prefers-reduced-motion`

## Navigation
- Labels: Home / How We Help / Work With Us / Contact
- Anchor links scrolling to sections on the same page

## Tone of copy
- Plain, honest, conversational ("Get in touch", not "Get In Touch")
- Focus on the client's questions and what we do for them — not on selling our
  credentials or using hype words ("transform", "cut through", etc.)
- Comfortable saying where AI does *not* help
