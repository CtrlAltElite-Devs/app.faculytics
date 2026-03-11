---
title: 'Super Admin Questionnaires Route'
slug: 'super-admin-questionnaires-route'
created: '2026-03-11T00:00:00+08:00'
status: 'implementation-complete'
stepsCompleted: [1, 2, 3, 4]
tech_stack:
  - 'Next.js 16 App Router'
  - 'React 19'
  - 'TypeScript strict mode'
  - 'Tailwind CSS 4'
  - 'Zustand auth store'
  - 'Client-side route guards via next/navigation'
files_to_modify:
  - 'lib/auth/role-route.ts'
  - 'app/(dashboard)/superadmin/layout.tsx'
  - 'app/(dashboard)/superadmin/page.tsx'
  - 'app/(dashboard)/superadmin/questionnaires/page.tsx'
code_patterns:
  - 'Role-specific route groups use thin layout wrappers around RoleGuard'
  - 'Dashboard shell is inherited from app/(dashboard)/layout.tsx'
  - 'Role home and sidebar nav are centralized in lib/auth/role-route.ts'
  - 'Placeholder dashboard pages are simple server components with heading and muted descriptive copy'
  - 'Nav active state is pathname-based and supports nested routes'
test_patterns:
  - 'No dedicated automated test framework configured'
  - 'Validation gate is npm run lint and npx tsc --noEmit'
  - 'Manual verification needed for login redirect, role guard, and sidebar navigation'
---

# Tech-Spec: Super Admin Questionnaires Route

**Created:** 2026-03-11T00:00:00+08:00

## Overview

### Problem Statement

`SUPER_ADMIN` is already recognized in the role system, but the app has no dedicated `superadmin` dashboard route tree, no redirect from `/superadmin` to a concrete destination, and no sidebar entry for questionnaire management.

### Solution

Add a `superadmin` dashboard route structure that follows the existing role-guarded dashboard pattern, redirect `/superadmin` to `/superadmin/questionnaires`, and create a placeholder Questionnaires page that matches the layout conventions used by the other dashboard pages with a clear title and descriptive copy.

### Scope

**In Scope:**
- `app/(dashboard)/superadmin/layout.tsx`
- `app/(dashboard)/superadmin/page.tsx`
- redirect behavior from `/superadmin` to `/superadmin/questionnaires`
- placeholder page at `/superadmin/questionnaires`
- `SUPER_ADMIN` sidebar nav item updated to `Questionnaires`
- reuse existing dashboard guard and layout patterns
- placeholder UI content:
  - title: `Questionnaires`
  - description: `Create and manage all your questionnaires.`

**Out of Scope:**
- questionnaire CRUD
- questionnaire builder logic
- backend/API integration
- analytics, audit logs, or other superadmin modules
- new permissions model beyond existing `SUPER_ADMIN` access

## Context for Development

### Codebase Patterns

- Role-specific route groups use thin layout wrappers with `RoleGuard allowedRoles=[...]`; the role layout itself contains no extra page chrome.
- The shared dashboard shell lives in `app/(dashboard)/layout.tsx` and already applies `AuthGuard`, sidebar, header, and content inset, so superadmin routes should live under the same group to inherit all of it.
- Active-role resolution, role home paths, route prefixes, labels, and sidebar nav items are centralized in `lib/auth/role-route.ts`; changing the `SUPER_ADMIN` home path there also changes post-login redirects.
- `RoleGuard` is a client component that blocks rendering until `useMe()` and `useActiveRole()` settle; unauthorized users are redirected to `roleHome`.
- Existing placeholder dashboard pages are minimal server components using a `<section className="md:p-8">`, a heading, and muted descriptive copy.
- Sidebar navigation is derived from `getNavItemsForRole(activeRole)` and marks items active when the pathname equals or starts with the item URL, so `/superadmin/questionnaires` is a stable anchor for future nested pages.
- Confirmed clean slate: no `app/(dashboard)/superadmin/*` files exist yet.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `lib/auth/role-route.ts` | Central source for role home paths, route prefixes, and sidebar nav items |
| `constants/roles.ts` | Confirms `SUPER_ADMIN` is already part of the supported role union |
| `app/(dashboard)/layout.tsx` | Shared dashboard shell inherited by all role route groups |
| `app/(dashboard)/superadmin/page.tsx` | Redirect entry route from `/superadmin` to `/superadmin/questionnaires` |
| `app/(dashboard)/faculty/courses/page.tsx` | Example of current placeholder dashboard page structure |
| `app/(dashboard)/dean/faculties/page.tsx` | Example of current placeholder dashboard page structure |
| `app/(dashboard)/student/layout.tsx` | Example of role-specific layout using `RoleGuard` |
| `app/(dashboard)/faculty/layout.tsx` | Example of role-specific layout using `RoleGuard` |
| `app/(dashboard)/dean/layout.tsx` | Example of role-specific layout using `RoleGuard` |
| `app/(dashboard)/_guards/role-guard.tsx` | Existing route access enforcement pattern |
| `components/app-sidebar.tsx` | Sidebar consumes nav items from the role config |
| `components/nav-main.tsx` | Active state logic for sidebar links based on pathname |
| `app/auth/page.tsx` | Login flow redirects to `roleHome`, so `SUPER_ADMIN` home path must be correct |

### Technical Decisions

- The canonical landing destination for `SUPER_ADMIN` will become `/superadmin/questionnaires`.
- The first superadmin feature is a non-dynamic placeholder page, despite the initial mention of a slug.
- Navigation should expose a `Questionnaires` item through the existing role config rather than page-local navigation.
- The route should integrate into the existing dashboard shell instead of introducing a separate layout system.
- Existing multi-role behavior must be preserved: users who have `SUPER_ADMIN` in `me.roles` but another `activeRole` selected should continue to follow the current role-switch flow rather than implicitly switching roles when they hit `/superadmin/*`.
- The placeholder page should use:
  - title: `Questionnaires`
  - description: `Create and manage all your questionnaires.`
- The `SUPER_ADMIN` role config should update both `homePath` and the nav item URL to `/superadmin/questionnaires` to keep auth redirects and sidebar behavior aligned.
- Redirect behavior should be implemented as a dedicated server route file at `app/(dashboard)/superadmin/page.tsx` using the App Router redirect pattern, not client-side effect logic.
- The new superadmin layout should mirror the other role layouts exactly and allow only `SUPER_ADMIN`.
- The new `layout.tsx`, redirect page, and questionnaires page should remain server-first files and must not add `"use client"` unless a later requirement genuinely needs client-only behavior.

## Implementation Plan

### Tasks

- [x] Task 1: Update `SUPER_ADMIN` route metadata to point to the questionnaires destination
  - File: `lib/auth/role-route.ts`
  - Action: Change the `SUPER_ADMIN` `homePath` from `/superadmin` to `/superadmin/questionnaires`.
  - Notes: Keep the existing `routePrefix` as `/superadmin` so pathname-to-role resolution still works for the entire route tree.

- [x] Task 2: Replace the `SUPER_ADMIN` sidebar navigation item with the Questionnaires destination
  - File: `lib/auth/role-route.ts`
  - Action: Update the `SUPER_ADMIN` `navItems` entry so the title is `Questionnaires` and the URL is `/superadmin/questionnaires`.
  - Notes: Reuse the existing icon unless there is an explicit design requirement to change it.

- [x] Task 3: Add the role-guarded superadmin layout
  - File: `app/(dashboard)/superadmin/layout.tsx`
  - Action: Create a role-specific layout component that mirrors the existing student/faculty/dean layouts and wraps `children` in `RoleGuard allowedRoles={["SUPER_ADMIN"]}`.
  - Notes: Do not duplicate dashboard shell markup here; this layout must inherit `app/(dashboard)/layout.tsx`.

- [x] Task 4: Add the superadmin landing redirect route
  - File: `app/(dashboard)/superadmin/page.tsx`
  - Action: Create a server route component that redirects `/superadmin` to `/superadmin/questionnaires`.
  - Notes: Use the App Router `redirect` utility from `next/navigation`; do not implement this redirect with a client hook or effect.

- [x] Task 5: Create the placeholder Questionnaires page
  - File: `app/(dashboard)/superadmin/questionnaires/page.tsx`
  - Action: Create a minimal server component page using the same placeholder structure as the current faculty and dean pages.
  - Notes: Render:
    - title: `Questionnaires`
    - description: `Create and manage all your questionnaires.`
    Use existing utility-first styling conventions and match the spacing pattern already used in placeholder dashboard pages.

### Acceptance Criteria

- [ ] AC 1: Given an authenticated user whose active role is `SUPER_ADMIN`, when they are redirected after login, then they land on `/superadmin/questionnaires`.
- [ ] AC 2: Given a `SUPER_ADMIN` user visits `/superadmin`, when the route loads, then the app redirects them to `/superadmin/questionnaires`.
- [ ] AC 3: Given a `SUPER_ADMIN` user opens the dashboard sidebar, when navigation is rendered, then they see a `Questionnaires` item linked to `/superadmin/questionnaires`.
- [ ] AC 4: Given a `SUPER_ADMIN` user is on `/superadmin/questionnaires`, when the sidebar renders, then the `Questionnaires` nav item appears active.
- [ ] AC 5: Given a user without the `SUPER_ADMIN` role attempts to access `/superadmin` or `/superadmin/questionnaires`, when `RoleGuard` evaluates access, then the user is redirected to their resolved `roleHome`.
- [ ] AC 6: Given the Questionnaires page loads successfully, when the placeholder UI renders, then the page shows the title `Questionnaires` and the description `Create and manage all your questionnaires.`
- [ ] AC 7: Given the new superadmin route tree is added, when the dashboard shell renders the page, then it uses the existing shared dashboard header/sidebar layout rather than a separate custom layout.
- [ ] AC 8: Given an unauthenticated user accesses `/superadmin` or `/superadmin/questionnaires`, when the dashboard auth guard runs, then the user is redirected to `/auth`.
- [ ] AC 9: Given a user has `SUPER_ADMIN` in `me.roles` but a different `activeRole` such as `DEAN`, when they attempt to access `/superadmin` or `/superadmin/questionnaires`, then the app preserves the current multi-role behavior and redirects according to the existing guard logic instead of implicitly switching roles.
- [ ] AC 10: Given a multi-role user switches their active role to `SUPER_ADMIN`, when they navigate within the dashboard, then the sidebar and resolved home destination expose `Questionnaires` under `/superadmin/questionnaires`.

## Additional Context

### Dependencies

- Existing role routing and guard system
- Existing `(dashboard)` layout and sidebar composition
- Existing App Router redirect utilities
- No backend or API dependencies are required for this placeholder route
- `SUPER_ADMIN` must continue to be included in backend `me.roles` responses for access resolution to work

### Testing Strategy

- Follow the current repo gate: `npm run lint` and `npx tsc --noEmit`
- Manually verify redirect, guard behavior, and sidebar navigation visibility for `SUPER_ADMIN`
- Manual verification checklist:
  - log in as a `SUPER_ADMIN` user and confirm post-login routing lands on `/superadmin/questionnaires`
  - navigate directly to `/superadmin` and confirm redirect to `/superadmin/questionnaires`
  - confirm the sidebar shows `Questionnaires` for `SUPER_ADMIN`
  - confirm the Questionnaires nav item is active on `/superadmin/questionnaires`
  - confirm a logged-out user is redirected to `/auth` when attempting to access the superadmin route tree
  - confirm a user with both `DEAN` and `SUPER_ADMIN` roles is not implicitly switched into `SUPER_ADMIN` when `DEAN` remains the active role
  - confirm switching the active role to `SUPER_ADMIN` exposes the `Questionnaires` destination and uses `/superadmin/questionnaires` as the role home
  - confirm a non-`SUPER_ADMIN` authenticated user is redirected away from the superadmin route tree
- No automated tests are required unless the implementation task explicitly expands test coverage scope

### Notes

- This spec is intentionally limited to route structure and placeholder UI so it can be implemented as a focused brownfield change.
- High-risk item: changing `SUPER_ADMIN.homePath` affects every redirect path that resolves via `roleHome`, especially login and unauthorized-role fallbacks.
- Verification note: `app/auth/page.tsx` is expected to work unchanged because it already redirects through `roleHome`; this should be validated during implementation rather than treated as a code task.
- Keep the page as a server component unless new client-only behavior is introduced later.
- Future extension point: nested questionnaire pages under `/superadmin/questionnaires/*` will inherit active sidebar highlighting automatically because `NavMain` uses `pathname.startsWith(...)`.
