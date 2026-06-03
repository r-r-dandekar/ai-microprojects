# Decisions

**Based on:** 002-brainstorm.md

---

## 1. Frontend Framework
**Decision:** React (Vite) + Bootstrap
**Rationale:** Balanced approach providing modern component architecture with the requested simple styling library.

---

## 2. Authentication Method
**Decision:** Supabase Email & Password
**Rationale:** Standard internal tool approach; easy to manage user accounts manually or via admin setup.

---

## 3. User-Department Relationship
**Decision:** One Department per User
**Rationale:** Simplifies the database schema and reporting for the initial prototype.

---

## 4. Task Assignment Model
**Decision:** Single Owner per Task
**Rationale:** Ensures clear accountability and simplifies tracking.

---

## 5. Task Statuses
**Decision:** Global Fixed Set
**Rationale:** Provides consistency across the organization for reporting and analytics.

---

## 6. Data Visibility Scope
**Decision:** Departmental Silos
**Rationale:** Restricts employees to their relevant department tasks, ensuring privacy and focus.

---

## 7. Department Management
**Decision:** Admin-only Creation
**Rationale:** Centralizes organizational structure management to prevent fragmentation.

---

## 8. Task Change History
**Decision:** Current State Only
**Rationale:** Prioritizes speed of development and simplicity for the initial release.

---

## 9. Task Priority Levels
**Decision:** Standard Levels
**Rationale:** Helps in triaging and focusing on the most critical tasks.

---

## 10. Task Deadlines
**Decision:** Optional Due Date
**Rationale:** Provides flexibility for various task types while supporting time-tracking when needed.

---

## 11. System Multi-tenancy
**Decision:** Single Organization (Internal Tool)
**Rationale:** Focuses resources on meeting ABC Ltd's specific needs without SaaS overhead.

---

**Interview Status:** Complete. Shared understanding reached.
