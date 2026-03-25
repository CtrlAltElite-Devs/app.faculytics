# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Faculytics is a multi-role faculty evaluation platform built with Next.js App Router. Roles include Student (submits faculty feedback), Faculty (views feedback), Dean (views analytics), and SuperAdmin (manages questionnaires/dimensions). The frontend consumes a REST API backend.

## Tech Stack

Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS 4, shadcn/ui (new-york style), TanStack React Query, Axios, Zustand, React Hook Form, Zod, Bun (package manager).

## Commands

- `bun dev` — start dev server (port 3000)
- `bun run build` — production build
- `bun run lint` — ESLint (flat config, core-web-vitals + typescript presets)
- `bun run typecheck` — type-check without emitting (run before PRs)
- `bunx shadcn add <component>` — add shadcn components (also supports `@aceternity` registry)

## Architecture

The codebase follows a **feature-sliced structure**. The authoritative reference is `docs/ARCHITECTURE.md` — it contains **mandatory rules** (MUST/MUST NOT) that all code changes must follow. Always consult it before writing or placing new code.

### Key layout

- **`app/`** — routing, layouts, guards, route-local `_components/`. Pages are thin composition layers; no request functions or feature logic here.
- **`features/<feature>/`** — domain slices (`auth`, `enrollments`, `questionnaires`, `dimensions`). Each may contain `api/`, `components/`, `hooks/`, `lib/`, `schemas/`, `store/`, `types/`, and an `index.ts` barrel.
- **`components/ui/`** — shadcn primitives only. `components/shared/` — reusable app-specific composed components. `components/layout/` — app shell (sidebar, header, nav, role switcher, theme).
- **`network/`** — shared Axios client (`axios.ts`) with auth token injection and silent refresh, plus endpoint enum (`endpoints.ts`). Feature request functions live in their feature slice, not here.
- **`stores/`** — app-global Zustand stores (`auth-store`, `selected-course-store`). Feature-local stores go inside their feature slice.
- **`providers/`** — `AppProvider` composes QueryProvider, ThemeProvider, TooltipProvider, and Toaster.
- **`lib/`** — cross-feature pure utilities only.
- **`constants/`** — app-wide shared constants (e.g., role lists).

### Data flow

```
route/component → feature hook (useQuery/useMutation) → feature api request → apiClient (network/axios.ts) → backend
```

Mutations go through: form → Zod schema → feature hook → feature api request → backend.

### Import conventions

- Use `@/*` path alias for cross-folder imports. Relative imports only for tightly colocated route-local files (`./_components/...`).
- Feature barrel exports (`features/*/index.ts`) are the public API surface — don't over-export.

### State placement

State belongs in the lowest component that owns the behavior. Pages handle route orchestration only (redirects, query-param sync, cross-component coordination). Form state, filter state, and UI toggles stay in the component that renders them.

### Route-local `_components/`

Use when UI is consumed by exactly one route and doesn't justify a shared feature component.

## Hard Constraints

- No root-level `hooks/<feature>/`, `network/requests/`, `types/<feature>/`, or `schemas/<feature>/` folders — these belong in feature slices.
- Don't duplicate server state in Zustand (React Query owns it).
- Don't put React imports in request modules.
- Don't import feature request functions into shared shell components.
- `context/` directory is excluded from both tsconfig and eslint.

## Commit Style

Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, etc. Keep commits focused and atomic.

## Environment

`NEXT_PUBLIC_API_BASE_URL` controls the backend target (defaults to `http://localhost:3000`). Secrets go in `.env.local`, never committed.
