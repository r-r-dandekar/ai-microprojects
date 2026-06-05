# Automated Client Documentation

**Phase:** Post-Launch & Support
**Estimated Time Saved:** ~80%
**Software Solution:** ❌ No

---

## The Problem

Documentation goes stale immediately after a product ships. New features are added, UI changes are made, and processes are updated — but the user manual distributed at handoff reflects the product as it was on launch day. Keeping documentation current requires someone to notice every change, write the relevant update, and find the right place to insert it. This never happens systematically: documentation maintenance is invisible work with no deadline and no client visible consequence — until a client calls and says the manual is wrong.

---

## AI-Native Workflow

> **Pipeline:** Code deployed → AI detects doc-impacting changes → affected sections updated automatically → reviewed and published

**Steps:**

1. ⚡ **Trigger** — A deployment to production is completed (GitHub Actions fires on merge to main)
2. 🔗 **Integration** — GitHub Action sends the diff (changed files) to n8n
3. 🤖 **AI** — Claude analyses the diff and identifies changes that affect user-facing documentation:
   - New features added → need new documentation sections
   - Existing feature behaviour changed → existing sections need updating
   - UI text or labels changed → screenshots and step descriptions need updating
   - API endpoints changed → API reference needs updating
4. 🤖 **AI** — For each identified documentation gap, Claude generates the updated or new documentation section using the same style and structure as the existing documentation
5. 🤖 **AI** — Claude produces a "Documentation Change Report": what was changed, what sections were affected, and what was updated — so the reviewer knows exactly what to check
6. 👤 **Human Override Point** — Developer or PM reviews the documentation changes for accuracy. Approves sections that are correct; corrects any section where the AI misinterpreted the code change.
7. 🔗 **Integration** — Approved changes are published to the documentation platform (Mintlify/GitBook/Notion) and optionally a "What's New" entry is generated for the client

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude** | Code diff analysis, documentation section generation |
| **GitHub Actions** | Trigger on production deployment |
| **n8n** | Diff → Claude → documentation platform update |
| **Mintlify / GitBook** | Documentation hosting with API for programmatic updates |

---

## Prompt Templates

### Update Documentation from Code Diff
```
You are a technical writer maintaining documentation for a live software application.

The following code was deployed to production. Identify any changes that affect user-facing documentation and generate the updated documentation sections.

Application: [APP NAME]
Existing documentation structure:
[PASTE TABLE OF CONTENTS — section names only]

Deployment diff (changed files and key changes):
[PASTE GIT DIFF or SUMMARY OF CHANGES]

For each documentation-impacting change:

1. **Change description:** What changed in the code
2. **Documentation impact:** Which existing section is affected, or what new section is needed
3. **Updated section:** The full rewritten or new documentation section, in the same style as the existing docs

Style guide for this documentation:
- Tone: [FORMAL / CONVERSATIONAL]
- Target reader: [TECHNICAL / NON-TECHNICAL]
- Format: [Numbered steps / Prose / Mixed]

If no changes affect documentation, respond with: "No documentation updates required for this deployment."
```

---

## Notes

- Set up the documentation platform (Mintlify/GitBook) with version tracking so clients can see a changelog of documentation updates alongside the product changelog.
- For major feature releases, don't just update the existing docs — generate a "What's New" announcement for the client using the same prompt. This turns documentation maintenance into a client communication opportunity.
- Store the entire documentation source in the GitHub repo as Markdown files. This gives Claude direct access to the full documentation context via the git diff workflow, producing much more accurate updates.
