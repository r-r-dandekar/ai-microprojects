# Living Knowledge Base

**Phase:** Operations & HR
**Estimated Time Saved:** ~65% (of time spent searching for answers)
**Software Solution:** ✅ Yes

---

## The Problem

At a small agency, institutional knowledge lives in people's heads. How did we solve the Stripe webhook verification issue on the last project? What's the correct pattern for Supabase RLS with multi-tenant data? Which client has a specific requirement about not storing user data in the EU? When the person who knows the answer is unavailable, everyone else spends time re-discovering what already exists. New hires take weeks to get up to speed. Senior developers are interrupted constantly by questions they've already answered. When someone leaves, knowledge leaves with them.

---

## AI-Native Workflow

> **Pipeline:** Ongoing indexing of Slack, docs, and code → searchable AI knowledge base → developers query in natural language → instant, cited answers

**Steps:**

1. ⚡ **Trigger** — Continuous background indexing (runs nightly) plus on-demand when new documents are added
2. 🔗 **Integration** — n8n indexes the following sources:
   - Slack: messages from engineering and project channels (flagged as "saved" or matching keywords)
   - Notion: all internal documentation, meeting notes, and how-to guides
   - GitHub: README files, inline code comments, PR descriptions
   - Past PRDs: all approved PRDs as a reference library
   - Resolved bug tickets: bug descriptions and their solutions
3. 🤖 **AI** — A RAG (Retrieval-Augmented Generation) system using Claude processes natural language queries against the indexed corpus. Answers include citations (which document/message the answer comes from) so the developer can verify and read more.
4. 🤖 **AI** — Weekly: Claude identifies "knowledge gaps" — frequently asked questions that don't have a good documented answer — and surfaces them to the team lead for documentation
5. 👤 **Human Override Point** — Team lead reviews knowledge gap alerts and assigns documentation tasks. Any incorrect AI answer can be flagged and corrected, which improves future responses.

---

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **Claude API** | Query answering with RAG — long context, citation-aware |
| **n8n** | Indexing pipeline: Slack + Notion + GitHub → vector DB |
| **Supabase pgvector** | Vector database for document embeddings (built into Supabase) |
| **Notion** | Primary documentation source |
| **LangChain / LlamaIndex** | Optional: orchestration layer for the RAG pipeline |

---

## Prompt Templates

### Query the Knowledge Base (System Prompt)
```
You are the internal knowledge assistant for Alphonso Solutions, a software agency. Your job is to answer technical and operational questions based on the provided context documents.

Rules:
1. Only answer from the provided context. Do not use general knowledge to fill in gaps.
2. Always cite your source: [Document name / Slack message date / GitHub file]
3. If the answer is not in the context, say "I don't have a documented answer for this. This might be a knowledge gap — consider documenting the answer."
4. For technical answers, include the specific code example or step-by-step instruction from the source.
5. If multiple sources give conflicting answers, surface the conflict and cite both.

Context:
[RAG-retrieved documents — injected by the system]

Question: [USER QUERY]
```

### Add to Knowledge Base (Slack Command)
```
When a developer shares a solution in Slack, they can type:
/knowledge "How to [describe the problem]"

This saves the message to the knowledge base index with the context of the channel and thread.
```

---

## 🛠 Software Solution

### What It Does
An AI-powered internal knowledge base that indexes all of Alphonso's institutional knowledge (Slack, docs, code, PRDs) and makes it queryable in natural language. The longer it runs, the more valuable it becomes.

### Suggested Stack
- **Frontend:** Next.js — search interface, knowledge gap dashboard, source management
- **Backend:** Supabase with pgvector extension — document storage, vector embeddings, query logs
- **AI Layer:** Claude API (query answering) + text-embedding model (document indexing)
- **Automation:** n8n — nightly re-indexing of all sources
- **Integrations:** Slack API (save commands, channel indexing), Notion API, GitHub API

### Key Features
- Natural language search with source citations
- Slack `/knowledge` command for instant queries without leaving the chat
- Knowledge gap detection — surfaces questions that didn't get a good answer
- Source freshness indicators — flags documents that haven't been updated in 6+ months
- Confidence scoring — indicates when the AI is uncertain about an answer
