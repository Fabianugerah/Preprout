# Preproute – Test Management Application

A 5-page frontend application for creating, managing, and publishing tests. Built for the Preproute Frontend Developer evaluation task.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI Framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Zustand | State management |
| React Hook Form + Zod | Form handling & validation |
| Axios | API calls |
| React Router v6 | Routing |
| React Hot Toast | Notifications |
| Lucide React | Icons |

---

## Project Structure

```
src/
├── api/
│   ├── client.ts          # Axios instance with interceptors
│   └── index.ts           # All API service functions
├── components/
│   ├── layout/
│   │   └── MainLayout.tsx # Sidebar + layout wrapper
│   ├── shared/
│   │   ├── ProtectedRoute.tsx
│   │   └── Stepper.tsx
│   └── ui/
│       └── index.tsx      # Spinner, EmptyState, ConfirmDialog
├── lib/
│   └── schemas.ts         # Zod validation schemas
├── pages/
│   ├── LoginPage.tsx       # Page 1 – Login
│   ├── DashboardPage.tsx   # Page 2 – Test list
│   ├── CreateTestPage.tsx  # Page 3 – Create/edit test
│   ├── AddQuestionsPage.tsx# Page 4 – Add questions
│   └── PreviewPublishPage.tsx # Page 5 – Preview & publish
├── store/
│   ├── authStore.ts        # JWT + user state (Zustand)
│   ├── testCreationStore.ts# Shared state for pages 3–5
│   └── index.ts
├── types/
│   └── index.ts            # All TypeScript interfaces
├── utils/
│   └── index.ts            # Helpers, constants
├── App.tsx                 # Routes
├── main.tsx                # Entry point
└── index.css               # Global styles + Tailwind
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Test Credentials

```
Username: vedant-admin
Password: vedant123
```

---

## Application Flow

```
Login → Dashboard → Create Test → Add Questions → Preview & Publish
  1         2           3              4                 5
```

---

## API Base URL

```
https://admin-moderator-backend-staging.up.railway.app/api
```

All protected routes require:
```
Authorization: Bearer <jwt_token>
```