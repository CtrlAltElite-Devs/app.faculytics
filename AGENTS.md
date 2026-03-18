# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages and layouts (e.g., `app/(dashboard)/student/courses/page.tsx`).
- `app/**/_components/`: route-local UI used by exactly one route.
- `components/`: shared components only.
  - `components/ui/`: shadcn-based primitives and generic controls.
  - `components/layout/`: app shell components such as sidebar, header, nav, role switcher, and theme controls.
- `features/`: domain slices that own feature logic and reusable feature code.
  - `features/auth/`: auth API, hooks, schemas, role helpers, and types.
  - `features/enrollments/`: enrollment API, hooks, and types.
  - `features/questionnaires/`: questionnaire API, reusable components, hooks, schemas, store, types, and builder logic.
- `lib/`: cross-feature pure utilities.
- `network/`: API client, endpoints, and request functions.
- `stores/`: Zustand state stores.
- `providers/`: app-level providers (React Query, theme, etc.).
- `public/`: static assets and images.
- `docs/ARCHITECTURE.md`: source of truth for file placement, ownership boundaries, and state placement rules. Agents should follow this when adding or moving code.

## Build, Test, and Development Commands
- `npm run dev`: start local dev server at `http://localhost:3000`.
- `npm run build`: create production build.
- `npm run start`: run built app.
- `npm run lint`: run ESLint checks.
- `npx tsc --noEmit`: run strict type-checking (recommended before PRs).

## Coding Style & Naming Conventions
- Language: TypeScript with `strict` mode enabled.
- Indentation: 2 spaces; prefer semicolons and double quotes only when already established in file.
- Components: PascalCase (`CourseCard`), hooks: `useXxx`, request functions: verb-first (`fetchMyEnrollments`).
- Keep API types inside their owning feature slice (for example `features/auth/types`).
- Use `@/*` path alias for internal imports.
- Favor small, composable components and colocate feature logic by domain.
- Default to `@/*` imports across folders and feature boundaries; use relative imports only for tightly colocated route-local files inside the same route subtree.

## Architecture Rules
- Treat `docs/ARCHITECTURE.md` as the governing policy for LLM agents and humans during development.
- Keep `app/` focused on routing, guards, redirects, route composition, and route-local `_components/`.
- Put shared shell UI in `components/layout/` and low-level reusable primitives in `components/ui/`.
- Put domain logic, request functions, reusable feature UI, schemas, and feature types in `features/<feature>/`.
- Use route-local `_components/` when UI is used by exactly one route and does not justify a shared feature component.
- Keep state in the lowest component that owns the behavior. Do not lift form, filter, search, or toggle state into page files unless it affects route orchestration.

## Testing Guidelines
- No dedicated test framework is currently configured.
- Minimum quality gate for changes:
  - `npm run lint`
  - `npx tsc --noEmit`
- When tests are added, place them next to source as `*.test.ts`/`*.test.tsx` or under a local `__tests__/` folder by feature.

## Commit & Pull Request Guidelines
- Follow Conventional Commit style seen in history: `feat:`, `refactor:`, `chore:`, etc.
- Keep commits focused and atomic.
- PRs should include:
  - Clear summary of behavior changes.
  - Linked issue/task (if available).
  - Screenshots/GIFs for UI updates.
  - Notes on API/type changes and manual verification steps.

## Security & Configuration Tips
- Keep secrets in `.env.local`; never commit env files with credentials.
- `NEXT_PUBLIC_API_BASE_URL` controls backend target for `network/axios.ts`.

## Product Context
- Faculytics serves multiple roles in one faculty-evaluation workflow:
  - Student: submits faculty feedback tied to enrolled courses.
  - Faculty: views feedback outcomes and limited analytics.
  - Dean and higher roles: view broader faculty feedback results and analytics.
- Student feedback entry point is the course-level `Give Feedback` flow.
- Questionnaire content is planned to become dynamic via a future `SUPER_ADMIN` questionnaire builder feature.
