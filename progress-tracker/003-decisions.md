# Decisions

**Based on:** 002-brainstorm.md

---

## 1. Frontend Framework
**Decision:** React (Vite) + Bootstrap
**Rationale:** Component-based architecture with fast dev server; Bootstrap handles styling simply.

---

## 2. Authentication Method
**Decision:** Custom auth stored in Supabase DB (not Supabase Auth). Passwords hashed with bcrypt on the frontend before storing.
**Rationale:** Users sign up with email + username + password. Login accepts either email or username. Supabase is used purely as the database; there is only one Supabase account for DB management, unrelated to end-user login.

---

## 3. User Roles
**Decision:** Two roles — Manager and Employee
**Rationale:** Manager oversees a department and its tasks; employees are assigned tasks within their department. No separate superuser/admin role needed.

---

## 4. User-Department Assignment
**Decision:** Each user belongs to exactly one department, selected during sign-up
**Rationale:** Simple schema; users self-assign to their department at registration.

---

## 5. Department Creation
**Decision:** Managers can create departments
**Rationale:** Gives managers control over their org structure within the app.

---

## 6. Task Assignment
**Decision:** Single assignee per task
**Rationale:** Clear accountability; simpler schema and UI.

---

## 7. Task Creation & Assignment Permissions
**Decision:** Only Managers can create tasks and assign them to employees in their department
**Rationale:** Keeps managers in full control of workload distribution.

---

## 8. Task Status Updates
**Decision:** Only the assigned employee can update their task's status
**Rationale:** Employees own their progress; managers can monitor but not override.

---

## 9. Task Statuses
**Decision:** Five fixed statuses — Pending, In Progress, Under Review, Completed, Blocked. Each status update includes an optional short description (e.g. outcome if completed, reason if blocked).
**Rationale:** Granular enough for manager oversight without being overly complex. The description field adds context without requiring a full audit log.

---

## 10. Task Due Dates
**Decision:** Optional due date per task, set by the Manager at creation time
**Rationale:** Provides deadline tracking where needed without forcing it on every task.

---

## 11. Task Priority
**Decision:** Three levels — Low, Medium, High
**Rationale:** Helps employees triage their workload without over-engineering urgency signals.

---

## 12. Employee Data Visibility
**Decision:** Employees see all tasks in their department, but can only update their own assigned tasks
**Rationale:** Promotes transparency within the department while maintaining clear ownership.

---

## 13. Manager Data Visibility
**Decision:** Managers can see all departments' tasks and employees, but can only create/edit tasks in their own department
**Rationale:** Full org awareness for cross-department coordination, with edit control scoped to their own department.

---

## 14. Task Change History
**Decision:** No history — current state only
**Rationale:** Simpler schema and faster to build for the initial release.

---

## 15. Session Management
**Decision:** Store session in localStorage — persists across browser closes
**Rationale:** User stays logged in until they explicitly log out; better UX for a daily-use internal tool.

---

## 16. App Layout / Landing View
**Decision:** Dashboard-first — users land on a summary dashboard showing task counts by status, then can drill into task lists
**Rationale:** Gives both managers and employees an immediate high-level overview before diving into details.

---

## 17. Notifications
**Decision:** No notifications — users check the app manually
**Rationale:** Keeps the app simple; no email or push infrastructure required.

---

## 18. Hosting / Deployment
**Decision:** Netlify or Vercel (free tier static hosting)
**Rationale:** Simplest deployment path for a React/Vite app; easy CI/CD from GitHub.

---

## 19. Task Deletion
**Decision:** Managers can delete tasks they created in their department
**Rationale:** Full CRUD control for managers over their department's tasks.

---

**Interview Status:** Complete. Shared understanding reached.
