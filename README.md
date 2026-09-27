# Maison d'Vine — Production Frontend Architecture

A modern, production-ready, frontend-only web application foundation built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and modern architectural patterns.

This project is strictly focused on the **frontend/UI layer**. It is decoupled from backend business logic, payment processors, databases, and authentication servers. It establishes a resilient foundation ready to connect to external REST/GraphQL APIs via a typed service layer.

---

## 1. Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with centralized design tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Server State & Caching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Client Global State**: [Zustand](https://zustand-demo.pmnd.rs/) (targeted UI state only)
- **Class Utilities**: `clsx` + `tailwind-merge` + `class-variance-authority` (CVA)
- **Linting & Code Formatting**: ESLint + Prettier

---

## 2. Project Architecture

The codebase follows a scalable, feature-friendly directory structure:

```
src/
├── app/                  # Next.js App Router (pages, layouts, loading, errors)
│   ├── error.tsx         # Route error boundary
│   ├── globals.css       # Tailwind CSS v4 & design tokens
│   ├── layout.tsx        # Root HTML layout with SEO metadata & providers
│   ├── loading.tsx       # Route loading skeleton
│   ├── not-found.tsx     # 404 page
│   ├── page.tsx          # Homepage view (Server Component)
│   └── providers.tsx     # TanStack Query & UI providers
│
├── components/           # Reusable UI component library
│   ├── ui/               # Atomic primitives (Button, Input, Select, Modal, etc.)
│   ├── common/           # Shared state widgets (EmptyState, ErrorState, SectionHeader)
│   ├── layout/           # App shell (Header, Footer, Sidebar, MobileNavigation)
│   └── sections/         # Composed page sections (Hero, Architecture, Showcase, Form)
│
├── features/             # Domain modules (encapsulated UI, queries, feature hooks)
├── hooks/                # Reusable custom React hooks (useDisclosure, useDebounce, etc.)
├── lib/                  # Utilities (cn, formatters, constants, query client)
├── services/             # Centralized API client & typed service endpoints
├── store/                # Zustand client state (drawer toggles, toast notifications)
├── types/                # Strict TypeScript declarations (API envelopes, domain models)
├── config/               # Environment, site metadata, navigation constants
├── mocks/                # Typed mock datasets (isolated from components)
└── assets/               # Bundled static media and illustrations
```

---

## 3. Getting Started

### Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or higher

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd maisondvine
npm install
```

### Environment Configuration

Copy the example environment configuration:

```bash
cp .env.example .env.local
```

Configure your variables in `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.example.com/v1
NEXT_PUBLIC_APP_NAME="Maison d'Vine"
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_MOCK_FALLBACK=true
```

---

## 4. Available Scripts

| Script                 | Purpose                                                            |
| ---------------------- | ------------------------------------------------------------------ |
| `npm run dev`          | Starts local Next.js development server at `http://localhost:3000` |
| `npm run build`        | Compiles production-optimized build                                |
| `npm run start`        | Runs the production build locally                                  |
| `npm run lint`         | Runs ESLint across the codebase                                    |
| `npm run format`       | Auto-formats code with Prettier                                    |
| `npm run format:check` | Checks formatting compliance with Prettier                         |
| `npm run type-check`   | Runs TypeScript compiler check (`tsc --noEmit`)                    |

---

## 5. Architectural Principles & Conventions

### Server vs. Client Components

- **Server Components by default**: All components are Server Components unless user interactivity, event listeners, or hooks (`useState`, `useEffect`, `useForm`) are required.
- **Client Boundaries**: Mark interactive files with `"use client"` at the top. Keep client boundaries as leaf components wherever possible to minimize JavaScript bundle size.

### API-Ready Service Layer

- **Centralized Client**: All remote HTTP requests pass through `@/services/api-client.ts`, which normalizes response envelopes, handles timeouts, and formats exceptions into `ApiException`.
- **Domain Services**: Dedicated service classes (`UserService`, `ProductService`) encapsulate endpoints and accept typed parameters and return typed DTOs.
- **Mock Fallback**: When `NEXT_PUBLIC_ENABLE_MOCK_FALLBACK=true`, services automatically return typed mock data if the backend is not yet deployed, allowing seamless offline UI development.

### State Management Hierarchy

1. **Local State**: Use `React.useState` / `useReducer` for self-contained UI interactions.
2. **Server State**: Use TanStack Query (`@tanstack/react-query`) for fetching, caching, invalidating, and mutating remote data.
3. **Global Client State**: Use Zustand (`@/store/ui-store.ts`) strictly for cross-cutting client concerns such as navigation drawers, modal managers, and toast notifications.

### Design System & Accessibility

- Components are built using **CVA (class-variance-authority)** with accessible ARIA tags, keyboard focus rings, and proper semantic HTML (`<button>`, `<main>`, `<header>`, `<table>`).
- Responsive across mobile (<640px), tablet (640px-1024px), laptop, and desktop screens.
- Zero horizontal overflow.

### TypeScript Standards

- Strict type checking enabled (`strict: true` in `tsconfig.json`).
- Avoid `any` — use typed interfaces, union types, and generic parameters.

---

## 6. Security & Production Readiness

- **No Exposed Secrets**: Sensitive secrets (API keys, private keys, database URLs) are prohibited in client bundles. All client variables are strictly prefixed with `NEXT_PUBLIC_`.
- **Input Validation**: Forms validate against Zod schemas on the client for immediate UX feedback. Backend validation must still be implemented on the API server.
