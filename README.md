Vikas Frontend

Quick start

1. Install deps

```powershell
cd vikas_frontend
npm install
```

2. Start dev server (Vite)

```powershell
npm run dev
```

3. Open app: http://localhost:3001 (Vite may choose 3000 or 3001)

Notes
- Login with seeded admin: admin@vikas.com / Admin@123

Vikas Frontend (Vite + React)
Run locally:
1. npm install
2. copy .env.example to .env and set VITE_API_BASE if needed (defaults to http://localhost:4000/api)
3. npm run dev

Structure:
- /src
  - pages/Login.jsx
  - pages/AdminDashboard.jsx
  - pages/StudentDashboard.jsx
  - components/ProtectedRoute.jsx
  - services/api.js (axios instance with token)
