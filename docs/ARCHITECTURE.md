# Faculytics Frontend Architecture

**Stack:** Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Axios, Zustand, React Hook Form, Zod
**App type:** Multi-role faculty evaluation platform
**Status:** Current repository architecture after the feature-slice migration

---

## 1. Purpose

This document is the source of truth for how the frontend is organized today.

It defines:

- the current file structure
- what each top-level folder owns
- when code should live in `app/`, `components/`, `features/`, `lib/`, or `stores/`
- the do's and don'ts for adding new code
- the boundaries that should not be crossed

This is not a theoretical target anymore. It should match the real repository structure.

---

## 2. Architecture Summary

The repo uses a **feature-sliced frontend structure** with a small shared core.

High-level rules:

- `app/` owns routing, layouts, guards, and route-level composition
- `components/ui/` owns low-level reusable UI primitives
- `components/layout/` owns the app shell
- `features/<feature>/` owns domain code
- `lib/` owns cross-feature pure utilities
- `network/` owns shared transport setup only
- `stores/` owns app-global client state only

The current feature slices are:

- `features/auth`
- `features/enrollments`
- `features/questionnaires`

Route-local UI is allowed when a component is used by exactly one route. Example:

- `app/(dashboard)/student/courses/_components/course-card.tsx`
- `app/auth/_components/*`
- `app/(dashboard)/superadmin/questionnaires/_components/*`
- `app/(dashboard)/superadmin/questionnaires/new/_components/*`

---

## 3. Current File Structure

```text
app/
  layout.tsx
  page.tsx
  globals.css
  auth/
    _components/
    layout.tsx
    page.tsx
  (dashboard)/
    layout.tsx
    _guards/
      auth-guard.tsx
      role-guard.tsx
    student/
      courses/
        _components/
          course-card.tsx
        [courseId]/
          evaluation/
            page.tsx
        page.tsx
    faculty/
    dean/
    superadmin/
      questionnaires/
        _components/
        preview/
          page.tsx
        new/
          _components/
          preview/
            page.tsx
          page.tsx

components/
  layout/
    app-sidebar.tsx
    dashboard-header.tsx
    nav-main.tsx
    nav-user.tsx
    role-switcher.tsx
    theme-provider.tsx
    theme-toggle.tsx
  ui/
    ...

features/
  auth/
    api/
      auth.requests.ts
    hooks/
      use-active-role.ts
      use-login.ts
      use-logout.ts
      use-me.ts
    lib/
      role-route.ts
    schemas/
      auth.schema.ts
      index.ts
    types/
      index.ts
    index.ts
  enrollments/
    api/
      enrollment.requests.ts
    hooks/
      use-my-enrollments.ts
    types/
      index.ts
    index.ts
  questionnaires/
    api/
      questionnaire.requests.ts
    components/
      builder/
        ...
      ...
    hooks/
      ...
    lib/
      ...
    schemas/
      ...
    store/
      questionnaire-builder-store.ts
    types/
      ...
    index.ts

constants/
  roles.ts

lib/
  string.ts
  utils.ts

network/
  axios.ts
  endpoints.ts

providers/
  app-provider.tsx
  query-provider.tsx

stores/
  auth-store.ts
  selected-course-store.ts
```

---

## 4. Folder Ownership

### `app/`

**Owns**

- pages
- layouts
- route guards
- route-local redirects
- route-local `_components/`
- route-only composition and wiring
- route-level navigation, redirect, and URL-state orchestration

**Does not own**

- request functions
- feature-wide serializers or validators
- shared UI
- reusable feature components used by multiple routes
- component-local form state
- component-local filter/search state
- purely presentational UI toggles such as show/hide, modal visibility, or inline editing state unless that state directly controls route flow

### `components/ui/`

**Owns**

- shadcn primitives
- low-level controls
- generic form inputs
- shared overlays
- generic layout atoms such as tables, badges, dialogs, sheets

**Does not own**

- feature logic
- route logic
- request orchestration
- role-specific behavior

### `components/layout/`

**Owns**

- sidebar
- dashboard header
- shell navigation
- role switcher
- theme controls
- app shell composition

**Does not own**

- feature API calls
- page-specific content
- domain-specific business rules

### `features/<feature>/`

**Owns**

- feature-specific request functions
- feature hooks
- feature components
- feature-specific pure logic
- feature-specific schemas and types
- feature-local store when needed

**Examples**

- `features/auth` owns login/session-related frontend behavior
- `features/enrollments` owns current-user enrollment retrieval and types
- `features/questionnaires` owns questionnaire list, builder, preview, schema handling, and builder state

### `lib/`

**Owns**

- generic string helpers
- generic utility functions
- cross-feature pure helpers

**Does not own**

- feature-specific validation once a feature slice exists
- request modules
- React code

### `network/`

**Owns**

- shared axios client setup
- endpoint constants

**Does not own**

- feature request modules
- feature DTOs
- feature business logic

### `stores/`

**Owns**

- app-global session state
- app-global selected-course state

**Does not own**

- feature-local server collections
- React Query cache replacements
- feature stores that should live inside a feature slice

---

## 5. Feature Slice Rules

A feature slice may contain these folders:

```text
features/<feature>/
  api/
  components/
  hooks/
  lib/
  schemas/
  store/
  types/
  index.ts
```

Not every feature needs every folder.

Examples:

- `features/enrollments` does not need `components/` today
- `features/questionnaires` needs a local `store/`
- `features/auth` has a `lib/` folder because role-routing logic is auth-specific

### Use a feature slice when

- the code belongs to a domain, not a single route
- the code will likely have multiple files
- the domain has hooks, API calls, types, or schemas that should stay together

### Use route-local `_components/` when

- the UI is only used by one route
- the component is tightly coupled to one page’s behavior
- extracting a full feature slice would be heavier than the actual reuse justifies
- the UI needs local form state, local filter state, or small interaction state that does not affect routing, redirects, or shared data ownership

### State placement rule

Put state in the lowest component that actually owns the behavior.

- keep component-local UI state inside the component that renders and uses it
- keep route pages focused on composition, URL params, redirects, and feature hook wiring
- move `useForm`, input visibility toggles, search text, status filters, and similar local interaction state into route-local or feature components when only that component uses them
- keep state in the page only when it coordinates route transitions, unsaved-changes guards, query-param synchronization, or cross-component orchestration within the route

Examples:

- `app/auth/_components/auth-login-form.tsx` should own its login form state and password visibility toggle
- `app/(dashboard)/superadmin/questionnaires/_components/questionnaire-list-screen.tsx` should own its local search and status filter state
- `app/(dashboard)/superadmin/questionnaires/new/page.tsx` may keep back-navigation/discard-confirmation state because it coordinates route exit behavior

Current example:

- `app/(dashboard)/student/courses/_components/course-card.tsx`
- `app/auth/_components/auth-login-form.tsx`
- `app/(dashboard)/superadmin/questionnaires/_components/questionnaire-list-screen.tsx`
- `app/(dashboard)/superadmin/questionnaires/new/_components/questionnaire-builder-screen.tsx`

---

## 6. Data Flow

Preferred query flow:

```text
route or route-local component
  -> feature hook
  -> feature api request
  -> shared axios client
  -> backend
```

Preferred mutation flow:

```text
form or action component
  -> feature schema
  -> feature hook
  -> feature api request
  -> backend
```

Preferred transformation flow:

```text
backend data
  -> feature lib helper
  -> feature component or route
```

---

## 7. Import Rules

### Allowed patterns

- `@/features/questionnaires/hooks/use-questionnaire-types`
- `@/features/auth/lib/role-route`
- `@/components/ui/button`
- `@/components/layout/app-sidebar`
- `@/app/(dashboard)/student/courses/_components/course-card`

### Preferred rules

- default to `@/*` absolute imports for any import that crosses folders or feature boundaries
- import from `features/<feature>/...` for feature internals
- allow relative imports only for tightly colocated route-local files, such as `./_components/...` or `../_components/...` inside the same route subtree
- do not use deep relative imports like `../../../` across features, shared folders, or app sections
- keep external imports first, internal imports second

### Barrel export rule

`features/*/index.ts` is the feature’s public export surface.

Do:

- export stable shared entry points from it

Do not:

- over-export everything blindly
- create name collisions between types and components
- rely on a barrel when a direct feature path is clearer

---

## 8. Do's and Don'ts

### Routing

Do:

- keep route files focused on composition
- keep guards under route-local folders
- use `_components/` for route-only UI
- keep local form/filter/toggle state out of page files unless it affects route orchestration

Don't:

- put request functions in `app/`
- put feature-wide business logic in pages
- let page files grow into feature dumping grounds
- lift component-local interaction state into pages without a route-level reason

### Components

Do:

- keep `components/ui/` generic
- keep `components/layout/` shell-only
- keep feature UI inside its feature slice
- keep route-only UI near its route
- let route-local and feature components own the interaction state they directly render

Don't:

- call feature request modules directly from presentation components
- place domain-specific UI in `components/ui/`
- keep old root-level domain component folders once a feature slice exists
- pass down `useForm` instances, local filter state, or simple visibility toggles from pages when the child component is the only consumer

### Hooks

Do:

- keep `useQuery` and `useMutation` inside feature hooks
- let hooks own invalidation and side-effect orchestration
- keep hooks close to the feature they serve

Don't:

- put React Query logic in page files when it should be reusable
- mix transport logic directly into route components

### API layer

Do:

- keep feature request modules thin
- return `response.data`
- keep transport config centralized in `network/`

Don't:

- create a new shared `network/requests/` folder
- add React imports to request modules
- hide feature logic in the shared transport layer

### Stores

Do:

- keep app-global state in root `stores/`
- keep feature-local state inside the feature slice

Don't:

- store API collections that React Query already owns
- move request code into Zustand stores

### Types and schemas

Do:

- keep feature DTOs in `features/<feature>/types`
- keep feature validation in `features/<feature>/schemas`

Don't:

- reintroduce root `types/` or `schemas/` folders for feature-local code
- define shared DTOs inline in page files

---

## 9. Hard Constraints

These rules should be treated as architectural constraints, not suggestions.

- Do not reintroduce root `hooks/<feature>/` folders for migrated features.
- Do not reintroduce root `network/requests/*` feature files.
- Do not reintroduce root `types/<feature>/` or `schemas/<feature>/` for migrated features.
- Do not keep feature-local code in `lib/` once a feature slice exists.
- Do not import feature request functions directly into shared shell components.
- Do not duplicate server state in Zustand.
- Do not mix product redesign with structural refactor in the same change unless explicitly planned.

---

## 10. Naming and Conventions

- Components: `PascalCase`
- Hooks: `useXxx`
- Request modules: `*.requests.ts`
- Store files: `*-store.ts`
- Feature folders: singular/plural based on the existing domain name and current usage
- Use one feature folder per domain, not per file type

---

## 11. How To Place New Code

Use this decision order:

1. Is it a route file, guard, or route-only component?
   Put it in `app/`.
2. Is it a generic UI primitive?
   Put it in `components/ui/`.
3. Is it app shell?
   Put it in `components/layout/`.
4. Is it feature-specific?
   Put it in `features/<feature>/`.
5. Is it a shared pure helper with no feature ownership?
   Put it in `lib/`.
6. Is it app-global client state?
   Put it in `stores/`.

If a file is used by exactly one route, prefer route-local `_components/` before creating a new shared home.

---

## 12. Quality Gates

For architecture or file-structure changes:

- run `npx tsc --noEmit`
- run targeted ESLint for touched areas
- run `npm run lint` when practical
- manually verify the touched user flows

At the moment, the repo still has a known full-lint blocker outside the migrated slices. That issue should be treated separately from feature placement decisions.

---

## 13. Current State Summary

The migration away from root-level feature folders is complete for the tracked domains:

- `questionnaires`
- `auth`
- `enrollments`
- app shell

The route-thinning pass is in place for the highest-weight routes through route-local `_components/`
folders in:

- `app/auth`
- `app/(dashboard)/student/courses`
- `app/(dashboard)/superadmin/questionnaires`
- `app/(dashboard)/superadmin/questionnaires/new`

The remaining work is operational, not structural:

- manual runtime verification
- fixing any unrelated repo-wide lint issues

This document should be updated any time the real folder ownership changes.
