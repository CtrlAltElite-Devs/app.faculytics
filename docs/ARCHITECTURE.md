# Faculytics v2 Frontend Architecture

**Stack:** Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Axios, Zustand, React Hook Form, Zod
**App type:** Multi-role faculty evaluation platform
**Status:** Current repository architecture after the feature-slice migration

---

## 1. Purpose

This document is the **authoritative source of truth** for how the frontend is organized. Every rule here is mandatory — not a suggestion.

It defines:

- the current file structure
- what each top-level folder owns
- when code MUST live in `app/`, `components/`, `features/`, `lib/`, or `stores/`
- the rules for adding new code
- the boundaries that MUST NOT be crossed

All contributors — human and AI — MUST follow these rules. If a rule blocks progress, update this document first and explain why.

---

## 2. Architecture Rules

The repo uses a **feature-sliced frontend structure** with a small shared core.

### Folder ownership (mandatory)

| Folder | Owns | MUST NOT contain |
|--------|------|-----------------|
| `app/` | Routing, layouts, guards, route-local `_components/`, route-level composition | Request functions, feature-wide logic, reusable feature components, component-local state (form, filter, toggle) |
| `components/ui/` | shadcn primitives only | Feature logic, route logic, app-specific composed components |
| `components/shared/` | Reusable composed app-specific components | shadcn primitives, feature business logic, route composition |
| `components/layout/` | App shell (sidebar, header, nav, role switcher, theme) | Feature API calls, page content |
| `constants/` | App-wide shared constants reused across multiple features | Feature-specific enums/defaults, route-local display maps, transport endpoints |
| `features/<feature>/` | Domain code: API requests, hooks, components, lib, schemas, store, types | Nothing outside its domain |
| `lib/` | Cross-feature pure utilities (no React, no features) | Feature-specific logic, request modules, React imports |
| `network/` | Shared Axios client + endpoint enum | Feature request modules, feature DTOs |
| `stores/` | App-global Zustand stores only | Feature-local state, React Query cache duplicates |
| `providers/` | App-level providers (Query, Theme, Tooltip, Toaster) | Feature logic, route logic |

---

## 3. Page Rules

Pages MUST be **thin composition layers**. A page file wires route params, calls hooks, and renders components. It MUST NOT contain business logic, data transformation, or complex orchestration.

### MUST

- Keep page files focused on **routing, guards, and composition**
- Extract data-fetching orchestration into feature hooks when a page needs 3+ queries
- Extract form/submission logic into a separate component or hook
- Use `_components/` for route-only UI

### MUST NOT

- Let a page file exceed ~120 lines of component code (excluding imports/types)
- Put request functions in `app/`
- Put feature-wide serializers or validators in pages
- Lift component-local interaction state (form, filters, toggles) into pages unless it directly controls route flow (redirects, URL params, unsaved-changes guards)
- Let pages grow into "feature dumping grounds"

### When to extract a hook from a page

Extract a custom hook when a page:

- Chains 3+ queries in a waterfall (query B depends on query A)
- Contains conditional query enabling logic (enabled depends on prior results)
- Mixes data resolution with UI rendering in the same component

The hook MUST return a clear result shape (prefer discriminated unions for multi-state flows). The page MUST only switch on the result and render.

---

## 4. Component Rules

### MUST

- Keep `components/ui/` generic — no domain knowledge
- Keep feature UI inside its feature slice (`features/<feature>/components/`)
- Keep route-only UI in `_components/` near its route
- Let components own the interaction state they directly render
- Use `memo()` on components that receive stable props but re-render due to parent changes

### MUST NOT

- Call feature request modules directly from presentation components
- Place domain-specific UI in `components/ui/`
- Place reusable app-specific composed UI in `components/ui/` (use `components/shared/`)
- Pass `useForm` instances, filter state, or visibility toggles down from pages when only one child uses them

---

## 5. Hook Rules

### MUST

- Keep `useQuery` and `useMutation` inside feature hooks (`features/<feature>/hooks/`)
- Let hooks own query invalidation and side-effect orchestration
- Keep hooks close to the feature they serve
- Use `useCallback`/`useMemo` when passing callbacks or computed values to memoized children
- Use refs for values that should NOT trigger re-renders or recreate callbacks (e.g., mutation objects, latest-callback patterns)

### MUST NOT

- Put React Query logic directly in page files when the hook is reusable
- Mix transport logic directly into route components
- Include unstable objects (mutation instances, inline objects) in `useCallback` dependency arrays — use refs instead

---

## 6. API Layer Rules

### MUST

- Keep feature request modules thin (call API, return `response.data`)
- Keep transport config centralized in `network/`
- Place feature request functions in `features/<feature>/api/`

### MUST NOT

- Create shared `network/requests/` folders for feature requests
- Add React imports to request modules
- Hide feature logic in the shared transport layer

---

## 7. State Rules

### MUST

- Put state in the **lowest component** that owns the behavior
- Use React Query for all server state
- Use Zustand only for app-global client state (`stores/`)
- Use feature-local Zustand stores inside the feature slice when needed

### MUST NOT

- Duplicate server state in Zustand (React Query owns it)
- Move request code into Zustand stores
- Store feature-local state in root `stores/`

### State placement decision order

1. Only this component uses it → component-local `useState`/`useReducer`
2. Multiple components in one route need it → lift to nearest shared parent or route-local context
3. Multiple routes need client state → `stores/` (Zustand)
4. It comes from the server → React Query (feature hook)

---

## 8. Feature Slice Rules

A feature slice MAY contain these folders:

```text
features/<feature>/
  api/           # Request functions
  components/    # Feature-owned UI
  constants/     # Feature-specific constants
  hooks/         # Feature hooks (queries, mutations, orchestration)
  lib/           # Feature-specific pure logic (serializers, validators)
  schemas/       # Zod schemas
  store/         # Feature-local Zustand store
  types/         # Feature types and DTOs
  index.ts       # Barrel — public export surface
```

Not every feature needs every folder.

### Barrel export rule

`features/*/index.ts` is the feature's public API surface.

- MUST export stable shared entry points
- MUST NOT over-export internal request functions, store internals, or implementation details
- MUST NOT create name collisions between types and components

### When to use a feature slice

- The code belongs to a **domain**, not a single route
- The domain has hooks, API calls, types, or schemas that should stay together
- The code will likely have multiple files

### When to use route-local `_components/`

- The UI is used by exactly **one route**
- Extracting a full feature component would be heavier than the reuse justifies
- The component needs local interaction state that doesn't affect routing

---

## 9. Import Rules

### MUST

- Use `@/*` path alias for any import that crosses folders or feature boundaries
- Use relative imports only for tightly colocated route-local files (`./_components/...`)
- Keep external imports first, internal imports second

### MUST NOT

- Use deep relative imports like `../../../` across features or app sections
- Import feature internals from outside the feature without going through the barrel or a direct feature path

---

## 10. Current File Structure

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
            _components/
              evaluation-page-shell.tsx
              evaluation-states.tsx
              evaluation-already-submitted.tsx
              evaluation-no-faculty.tsx
            page.tsx
        page.tsx
    faculty/
    dean/
      dashboard/
        page.tsx
      faculties/
        [facultySlug]/
          analysis/
            _components/
            page.tsx
        page.tsx
      layout.tsx
      page.tsx
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
  shared/
    ...
  ui/
    ...

features/
  dean/
    components/
      dean-charts.tsx
      dean-dashboard-header.tsx
      dean-faculty-analysis-table.tsx
      dean-metrics-grid.tsx
    lib/
      analytics-sample-data.ts
    types/
      index.ts
    index.ts
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
    constants/
      builder.ts
      index.ts
    api/
      questionnaire.requests.ts
    components/
      builder/
        ...
      form/
        questionnaire-form-matrix.tsx
        questionnaire-form-stacked.tsx
        questionnaire-form-section.tsx
        questionnaire-form-renderer.tsx
        questionnaire-form-progress.tsx
        questionnaire-form-qualitative.tsx
      ...
    hooks/
      use-evaluation-data.ts
      use-active-questionnaire-version.ts
      use-check-submission.ts
      use-evaluation-draft.ts
      use-save-draft.ts
      use-submit-evaluation.ts
      ...
    lib/
      builder-serializer.ts
      builder-deserializer.ts
      ...
    schemas/
      ...
    store/
      questionnaire-builder-store.ts
    types/
      index.ts
      builder.ts
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

## 11. Hard Constraints

These are **non-negotiable**. Breaking them is a blocking code review issue.

1. MUST NOT reintroduce root `hooks/<feature>/` folders for migrated features
2. MUST NOT reintroduce root `network/requests/*` feature files
3. MUST NOT reintroduce root `types/<feature>/` or `schemas/<feature>/` for migrated features
4. MUST NOT keep feature-local code in `lib/` once a feature slice exists
5. MUST NOT import feature request functions directly into shared shell components
6. MUST NOT duplicate server state in Zustand
7. MUST NOT mix product redesign with structural refactor in the same change unless explicitly planned
8. MUST NOT let page files grow into orchestration-heavy components — extract hooks
9. MUST NOT add React imports to request modules
10. MUST NOT put component-local state in pages unless it controls route flow

---

## 12. How To Place New Code

Follow this decision order strictly:

1. **Route file, guard, or route-only component?** → `app/`
2. **Generic UI primitive?** → `components/ui/`
3. **App shell?** → `components/layout/`
4. **Reusable app-specific composed component?** → `components/shared/`
5. **Feature-specific?** → `features/<feature>/`
6. **Shared pure helper with no feature ownership?** → `lib/`
7. **App-global client state?** → `stores/`

If used by exactly one route → prefer route-local `_components/` before creating a shared home.

---

## 13. Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | `PascalCase` | `QuestionnaireFormMatrix` |
| Hooks | `useXxx` | `useEvaluationData` |
| Request modules | `*.requests.ts` | `questionnaire.requests.ts` |
| Store files | `*-store.ts` | `auth-store.ts` |
| Constants files | `kebab-case.ts` | `builder.ts` |
| Feature folders | Domain name (singular/plural per existing usage) | `questionnaires/`, `auth/` |

One feature folder per domain, not per file type.

---

## 14. Quality Gates

Before merging any architecture or file-structure change:

1. MUST pass `bun run typecheck`
2. MUST pass `bun run lint` for touched areas
3. MUST manually verify touched user flows
4. SHOULD run full `bun run build` for significant changes

---

## 15. Refactoring Rules

Refactoring MUST NOT introduce breaking changes. Every refactor MUST preserve existing behavior exactly.

### Before refactoring

1. **Audit the existing flow** — read the full component/hook and list every data dependency, guard condition, side effect, and prop being passed
2. **Identify the public contract** — what props does the component accept? What does the hook return? What callbacks fire and with what arguments?

### During refactoring

1. MUST preserve the exact same guard order (loading → error → edge cases → ready)
2. MUST preserve every prop/context being passed to child components (e.g., a shell showing course info during loading states)
3. MUST NOT silently drop data from payloads (e.g., removing `courseId` from a submit payload)
4. MUST NOT change the shape of return types in ways that lose information (e.g., a loading state that previously carried context MUST still carry context)
5. MUST NOT change query keys, `enabled` conditions, or query dependency chains — these control when and whether data fetches happen
6. MUST NOT reorder hooks or add conditional hook calls — this breaks React's rules of hooks

### After refactoring

1. MUST pass `bun run typecheck`
2. MUST manually compare the before/after for every render path and confirm identical behavior
3. MUST verify that every API call sends the same payload shape as before

If a refactor intentionally changes behavior, it is not a refactor — it is a feature change. Label it as such in the commit message.

---

## 16. Updating This Document

This document MUST stay in sync with the actual repository structure. When the structure changes:

1. Update the relevant section
2. Update the file tree in Section 10
3. Note the change in your commit message

If a rule needs to change, update the rule **before** writing code that violates it. Document the reasoning in the commit or PR description.
