# Expense Tracker — Frontend

React 19 + TypeScript + Vite + Tailwind CSS

## Development

```bash
npm install
npm run dev       # Start dev server on port 5173
npm run build     # Type-check + production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Structure

```
src/
├── api/          # Axios client with auth interceptors
├── components/   # Reusable UI components
├── context/      # AuthContext, ToastContext
├── pages/        # Login, Register, Dashboard
├── types/        # TypeScript interfaces
└── utils/        # Error messages, shared styles
```
