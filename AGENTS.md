# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages and layouts (e.g., `app/(dashboard)/student/courses/page.tsx`).
- `components/`: Shared UI and feature components.
  - `components/ui/`: shadcn-based primitives.
  - `components/faculytics/`: domain UI (course cards, etc.).
- `hooks/`: React Query and feature hooks (auth, enrollments).
- `network/`: API client, endpoints, and request functions.
- `types/`: handwritten TypeScript API/request/response shapes.
- `stores/`: Zustand state stores.
- `providers/`: app-level providers (React Query, theme, etc.).
- `public/`: static assets and images.

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
- Keep API types in `types/*` (do not import from `context/index.d.ts`).
- Use `@/*` path alias for internal imports.
- Favor small, composable components and colocate feature logic by domain.

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
