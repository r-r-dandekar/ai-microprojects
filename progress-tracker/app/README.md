# Task Tracker

A web-based task management tool for ABC Ltd. Managers can create departments, assign tasks to employees, and monitor progress across the organisation. Employees can view their department's tasks and update the status of tasks assigned to them.

Built with React + TypeScript + Vite, Bootstrap 5, and Supabase as the database.

---

## Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Run tests:

```bash
npm run test:run
```

---

## Deploying to Netlify

1. Build the app:

```bash
npm run build
```

2. Drag and drop the **`dist`** folder (inside `app/`) onto the Netlify deploy area — not the `app` folder itself.

3. To fix direct URL navigation (e.g. `/tasks`), create `public/_redirects` with:

```
/*    /index.html   200
```

Then rebuild and redeploy.
