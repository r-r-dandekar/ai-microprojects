# Setup Instructions

These commands will initialize the ABC Ltd. Progress Tracker project environment.

## 1. Project Initialization
Create the React application with Vite and TypeScript:
```powershell
npm create vite@latest app -- --template react-ts
```

## 2. Install Dependencies
Navigate into the app directory and install the core libraries:
```powershell
cd app
npm install
npm install bootstrap react-bootstrap @supabase/supabase-js react-router-dom
```

## 3. Install Development Dependencies
Install Vitest and testing utilities:
```powershell
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

## 4. Supabase Setup (Manual Step)
1. Create a new project on [Supabase](https://supabase.com/).
2. Define the schema based on the PRD (Departments, Users, Tasks).
3. Enable Row-Level Security (RLS) for departmental silos.
4. Obtain the `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

## 5. Environment Configuration
Create a `.env` file in the `app` root:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 6. Build & Run
To start the development server:
```powershell
npm run dev
```

To run tests:
```powershell
npm test
```
