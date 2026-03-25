---
project_name: "app.faculytics"
user_name: "Aya"
date: "2026-03-11T00:00:00+08:00"
sections_completed: ["technology_stack", "language_rules", "framework_rules", "testing_rules", "quality_rules", "workflow_rules", "anti_patterns"]
status: "complete"
rule_count: 56
optimized_for_llm: true
existing_patterns_found: 9
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- Next.js 16.1.6 with App Router under `app/`
- React 19.2.3 and React DOM 19.2.3
- TypeScript 5 with `strict: true`, `noEmit: true`, `moduleResolution: "bundler"`, and `@/*` path alias
- ESLint 9 with `eslint-config-next` 16.1.6 (`core-web-vitals` + `typescript`)
- Tailwind CSS 4 with `@tailwindcss/postcss` and `tw-animate-css`
- shadcn-style UI primitives in `components/ui/` using Radix-based dependencies
- React Query 5.90.21 for server-state hooks
- Axios 1.13.6 for HTTP requests with centralized client/interceptors
- Zustand 5.0.11 with `persist` middleware for auth/session state
- React Hook Form 7.71.2 with Zod 4.3.6 available for form validation
- `next-themes` 0.4.6 for theming
- `lucide-react` 0.577.0 for icons

Version-sensitive notes:
- Internal imports should use `@/*` because `tsconfig.json` defines that alias.
- Generated code must be compatible with React 19 and Next 16 APIs already in use.
- Remote images must comply with the `next.config.ts` allowlist for `moodle.faculytics.ctr3.org`.

## Critical Implementation Rules

### Language-Specific Rules

- Keep all new code in TypeScript and satisfy `strict: true`; do not rely on `any` when a project type can be defined in `types/*`.
- Put API request/response shapes in handwritten `types/*` modules; do not source app types from generated or context files.
- Use the `@/*` alias for internal imports instead of deep relative paths.
- Match existing export patterns: hooks and request functions use named exports, while some feature components may use default exports when that file already does.
- Prefer `type` imports (`import type { ... }`) for purely static types, matching the existing codebase style.
- Keep request functions thin and verb-first in `network/requests/*`; they should call `apiClient`, type the response, and return `response.data`.
- Default query objects close to the request layer when there is a stable fallback, as in enrollments.
- Use async/await for request functions and asynchronous control flow; avoid mixing in manual Promise chains unless interceptor/retry logic requires it.
- For auth-sensitive code, rely on the centralized axios interceptor and Zustand session state instead of attaching auth headers ad hoc in feature code.
- Preserve nullability from backend DTOs (`faculty?: ... | null`, optional campus/profile fields) and handle missing data in UI code explicitly.

### Framework-Specific Rules

- Default to Server Components in `app/`; add `"use client"` only for files that need hooks, browser APIs, Zustand state, or client-side interactivity.
- Keep route structure aligned with App Router conventions already used here, including grouped segments like `(dashboard)` and colocated guards under route folders.
- Wrap cross-app providers at the root through `AppProvider`; do not duplicate Query, Theme, or Tooltip providers inside feature routes.
- Use React Query for authenticated server-state reads in hooks under `hooks/*`; feature pages should consume hooks rather than call request functions directly when caching/loading state matters.
- Build React Query keys as stable arrays that include the relevant scope inputs (`token`, pagination, filters) when those values affect fetched data.
- Keep Zustand for client session and lightweight shared UI state only, such as auth session and selected course context.
- For auth and role flows, follow the existing chain: Zustand auth state -> `useMe()` -> `useActiveRole()` -> guard components and route redirects.
- Do not bypass `AuthGuard`/role guard behavior with page-level ad hoc redirects unless the route genuinely has different access requirements.
- Keep axios auth refresh logic centralized in `network/axios.ts`; request modules should not reimplement refresh/retry behavior.
- Prefer composing feature UI from `components/ui/*` primitives and domain components in `components/faculytics/*` instead of embedding repeated low-level markup across pages.
- Preserve the current styling approach: utility-first Tailwind classes, existing brand tokens/classes, and font variables from the root layout.
- For `next/image`, ensure remote sources are allowed by `next.config.ts`; otherwise use local assets or update config intentionally.

### Testing Rules

- The current mandatory validation gate is `bun run lint` plus `bun run typecheck`; agents should run both after meaningful code changes when possible.
- There is no dedicated test framework configured yet, so do not invent Jest/Vitest/Playwright setup as part of ordinary feature work unless the task explicitly includes test infrastructure.
- When adding tests, colocate them with the feature as `*.test.ts` or `*.test.tsx`, or place them in a local `__tests__/` folder near the source.
- If a change touches auth, routing, or API contracts and automated tests are not added, manual verification steps should still cover loading, error, unauthorized, and empty-state behavior.
- Prefer testing hook/request boundaries and user-visible route behavior over brittle implementation details if a test framework is introduced later.
- Any new test utilities should follow the same import alias and type rules as app code.

### Code Quality & Style Rules

- Follow the current file organization strictly: routes in `app/`, shared primitives in `components/ui/`, domain UI in `components/faculytics/`, hooks in `hooks/`, network code in `network/`, state in `stores/`, and API types in `types/`.
- Match existing naming conventions: components in PascalCase, hooks as `useXxx`, request functions as verb-first names like `fetchMyEnrollments`, and route files using App Router names (`page.tsx`, `layout.tsx`).
- Keep components small and composable; move reusable UI into shared/domain components instead of growing route files with repeated blocks.
- Prefer succinct comments only where intent is not obvious; existing code comments are sparse and focused on request hooks or API calls.
- Maintain the repo’s import style: external packages first, blank line, then internal `@/*` imports.
- Continue using semicolon-terminated TypeScript and the quote style already established in each file.
- Reuse existing UI primitives (`Button`, `Card`, `Avatar`, etc.) before introducing one-off markup patterns for the same interaction.
- Preserve loading, error, empty, and ready states explicitly in user-facing pages when data is asynchronous.
- Do not introduce hidden cross-folder coupling; shared logic belongs in hooks, stores, lib helpers, or request modules, not duplicated inside pages.
- Keep metadata, provider setup, and global concerns in layout/provider files rather than feature components.

### Development Workflow Rules

- Treat `bun run lint` and `bun run typecheck` as the default pre-handoff checks for code changes.
- Use Conventional Commit prefixes consistent with the repo history and guidance, such as `feat:`, `refactor:`, and `chore:`.
- Keep commits focused and atomic; avoid bundling unrelated refactors with feature work.
- If a change affects UI, capture manual verification notes and screenshots/GIFs for PR-ready handoff.
- Document API or type-shape changes clearly when they affect `network/*` or `types/*`.
- Keep secrets out of the repo and use `.env.local`; backend targeting should continue to flow through `NEXT_PUBLIC_API_BASE_URL`.
- Do not replace or bypass existing auth/session infrastructure during implementation; coordinate changes through the established stores, hooks, and request layers.
- When adding new functionality, prefer matching the current domain folder structure instead of introducing a parallel architecture.

### Critical Don't-Miss Rules

- Do not fetch protected data directly from route components in a way that bypasses the existing auth-aware hooks, guards, or axios interceptor flow.
- Do not assume backend fields are always present; current DTOs include optional and nullable fields that must degrade cleanly in the UI.
- Do not add `"use client"` to entire route trees unnecessarily; keep client boundaries as narrow as possible.
- Do not duplicate auth refresh, token storage, or redirect logic outside the established Zustand store, `useMe`/`useActiveRole`, guard components, and `network/axios.ts`.
- Do not introduce relative import chains where `@/*` aliases should be used.
- Do not use remote image hosts outside the explicit Next.js image allowlist without intentionally updating configuration.
- Do not skip loading, error, unauthorized, or empty states when introducing async UI.
- Do not place domain API types inline in components or hooks when they belong in `types/*`.
- For student/faculty/dean flows, keep route behavior aligned with the current role-based dashboard structure instead of mixing role responsibilities inside a single page.
- Preserve persisted auth behavior: changes to the auth store must keep hydration and session clearing semantics intact.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code.
- Follow all rules exactly as documented.
- When in doubt, prefer the more restrictive option.
- Update this file if new project-specific patterns emerge.

**For Humans:**

- Keep this file lean and focused on agent needs.
- Update it when the technology stack or implementation patterns change.
- Review it periodically for outdated or obvious rules.

Last Updated: 2026-03-11
