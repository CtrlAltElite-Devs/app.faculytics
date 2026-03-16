---
title: 'Superadmin Questionnaire Builder'
slug: 'superadmin-questionnaire-builder'
created: '2026-03-14T00:00:00+08:00'
status: 'completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack:
  - 'Next.js App Router'
  - 'React 19'
  - 'TypeScript'
  - 'shadcn/ui'
  - 'React Hook Form'
  - 'Zod'
  - 'Axios'
  - 'React Query'
  - 'Zustand persist'
files_to_modify:
  - 'app/(dashboard)/superadmin/questionnaires/new/page.tsx'
  - 'app/(dashboard)/superadmin/questionnaires/new/preview/page.tsx'
  - 'app/(dashboard)/superadmin/questionnaires/page.tsx'
  - 'components/faculytics/questionnaires/questionnaire-builder-shell.tsx'
  - 'components/faculytics/questionnaires/questionnaire-outline-panel.tsx'
  - 'components/faculytics/questionnaires/questionnaire-section-editor.tsx'
  - 'components/faculytics/questionnaires/questionnaire-question-editor.tsx'
  - 'components/faculytics/questionnaires/questionnaire-qualitative-editor.tsx'
  - 'components/faculytics/questionnaires/questionnaire-preview-renderer.tsx'
  - 'network/requests/questionnaires.ts'
  - 'network/endpoints.ts'
  - 'hooks/questionnaires/use-create-questionnaire.ts'
  - 'hooks/questionnaires/use-create-questionnaire-version.ts'
  - 'hooks/questionnaires/use-save-questionnaire-builder.ts'
  - 'schemas/questionnaires/questionnaire-builder.schema.ts'
  - 'schemas/questionnaires/index.ts'
  - 'types/questionnaires/index.ts'
  - 'types/questionnaires/builder.ts'
  - 'lib/questionnaires/builder-serializer.ts'
  - 'lib/questionnaires/builder-validator.ts'
  - 'stores/questionnaire-builder-store.ts'
code_patterns:
  - 'Route-level page composes feature components and keeps loading/error states explicit'
  - 'Request functions stay thin in network/requests and return response.data'
  - 'Handwritten API and UI types live in types/*'
  - 'shadcn/ui primitives are preferred for interactive form building'
  - 'Role protection is inherited from route segment layouts via RoleGuard'
  - 'React Query hooks are token-gated and keyed by scope inputs'
  - 'Client persistence already uses Zustand persist with createJSONStorage(localStorage)'
  - 'Feature schemas are organized under schemas/<feature>/ with index re-exports'
test_patterns:
  - 'npm run lint'
  - 'npx tsc --noEmit'
  - 'Manual verification for loading, empty, error, unauthorized, and publish-gated visibility states'
---

# Tech-Spec: Superadmin Questionnaire Builder

**Created:** 2026-03-14T00:00:00+08:00

## Overview

### Problem Statement

The application currently exposes questionnaire listing for superadmins and a placeholder route at `/superadmin/questionnaires/new`, but there is no authoring workflow for creating the questionnaire schema used by the student faculty evaluation form. The backend already supports questionnaire creation and version creation, but the frontend does not yet provide a builder that matches the backend request flow or the product rules around nested quantitative sections, leaf-only weights, and a final optional qualitative comment area.

### Solution

Build a Google Forms-inspired questionnaire builder for the `SUPER_ADMIN` role at `/superadmin/questionnaires/new`. The builder will let superadmins define questionnaire metadata, create nested quantitative sections and subsections, add `LIKERT_1_5` and `YES_NO` questions only on leaf sections, configure one optional global qualitative comment section at the end, preview the questionnaire in a superadmin-only student-view simulation while building, preserve unsaved builder state locally, and save by creating the questionnaire record only when the selected type has no questionnaire yet, otherwise creating a new version for the existing questionnaire mapped to that type.

### Scope

**In Scope:**
- Add the superadmin questionnaire builder at `/superadmin/questionnaires/new`
- Support questionnaire metadata required by `POST /api/v1/questionnaires` (`title`, `type`)
- Treat questionnaire type as a single questionnaire root with multiple versions
- Preserve the rule that students can only access published/active questionnaire versions
- Support nested quantitative section trees in the frontend builder model
- Enforce that only leaf sections may contain questions
- Enforce that only leaf sections may carry weights
- Support quantitative question types limited to `LIKERT_1_5` and `YES_NO`
- Place one optional global qualitative comment section at the end of the questionnaire
- Add a superadmin-only preview experience at `/superadmin/questionnaires/new/preview` that renders the current draft from the student perspective without submission behavior or student exposure before publication
- Preserve unsaved builder state locally so in-progress authoring is not lost on accidental refresh/navigation
- Add frontend request helpers, types, and hooks needed to create a questionnaire and its initial version
- Align the submitted version payload with the backend `schema` object contract while preserving nested subsection structure in the frontend model

**Out of Scope:**
- Student draft-answer APIs under `/api/v1/questionnaires/drafts`
- Publishing and deprecating questionnaire versions
- Questionnaire analytics, scoring dashboards, or reporting views
- Backend API changes or new backend validation rules
- Replacing the existing student evaluation submission flow beyond preview-oriented reuse

## Context for Development

### Codebase Patterns

- The existing questionnaires area already lives under the superadmin dashboard routes and uses feature components under `components/faculytics/questionnaires/`.
- The questionnaires list page uses client-side state, React Query hooks, thin request wrappers, and handwritten questionnaire types.
- The questionnaire builder itself is a confirmed clean slate: the target route is still a placeholder and there are no existing builder-specific components, hooks, or schemas to preserve.
- The backend flow is split: `POST /api/v1/questionnaires` creates the questionnaire shell, then `POST /api/v1/questionnaires/{id}/versions` persists the first schema version.
- The product rule for this feature is one questionnaire root per type. A builder save for a type with an existing questionnaire should create a new version, not a duplicate questionnaire root.
- Student-facing evaluation must continue to use only published/active questionnaire versions; draft versions remain limited to superadmin authoring and preview flows.
- The provided backend example schema in `context/questionnaire_version.json` is flat, but product requirements require the builder to support nested subsections in the frontend model.
- The current student evaluation page is a placeholder that already establishes the intended student-facing instructional tone and page framing that can inform preview mode.
- Superadmin access is enforced at the route segment level by `app/(dashboard)/superadmin/layout.tsx` via `RoleGuard`, so a preview route nested under `/superadmin/questionnaires/new/*` will inherit the same protection pattern.
- Existing feature data hooks use `useQuery` with auth-token-gated `enabled` flags and stable array query keys that include scope inputs.
- Existing form validation uses `react-hook-form` with `zodResolver` for bounded inputs, and existing client persistence uses Zustand `persist` with `createJSONStorage(() => localStorage)`.
- `shadcn/ui` textarea and radiogroup components are already available and should be reused for the qualitative comment block and quantitative preview interactions.
- `shadcn/ui` dialog is available and should be used before destructive structure changes, especially converting a question-bearing leaf section into a parent section.
- `sonner` is already available in `components/ui` and should be the preferred global feedback surface for blocking validation and save-result messages.
- A `Table` is not the right primary interaction for authoring nested questionnaire content; an outline-first hierarchical editor should be the main pattern, with table-like summary views only if needed for compact review.
- The current questionnaire table already hints at future row actions for preview/publish/deprecate, which makes redirecting back to questionnaire management after save a natural fit.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `app/(dashboard)/superadmin/questionnaires/new/page.tsx` | Current placeholder route for the builder |
| `app/(dashboard)/superadmin/questionnaires/new/preview/page.tsx` | New preview route to create under the guarded superadmin questionnaire segment |
| `app/(dashboard)/superadmin/questionnaires/page.tsx` | Existing questionnaires feature patterns and route styling |
| `app/(dashboard)/superadmin/layout.tsx` | Superadmin segment guard that will also protect preview |
| `app/(dashboard)/_guards/role-guard.tsx` | Client-side role enforcement pattern for protected dashboard routes |
| `app/(dashboard)/student/courses/[courseId]/evaluation/page.tsx` | Student-facing questionnaire framing useful for preview mode |
| `hooks/questionnaires/use-questionnaire-types.ts` | Query hook pattern for token-gated questionnaire data reads |
| `hooks/questionnaires/use-questionnaire-versions.ts` | Query hook pattern for type-scoped questionnaire version reads |
| `network/requests/questionnaires.ts` | Existing request-layer conventions for questionnaire APIs |
| `network/endpoints.ts` | Central endpoint definitions to extend for create/version APIs |
| `network/axios.ts` | Shared auth-aware axios client used by all questionnaire requests |
| `stores/auth-store.ts` | Existing `localStorage` persistence pattern via Zustand `persist` |
| `schemas/auth/auth.schema.ts` | Feature schema organization pattern using Zod |
| `types/questionnaires/index.ts` | Existing questionnaire domain types to expand |
| `context/schema.d.ts` | Backend OpenAPI reference for questionnaire endpoints |
| `context/questionnaire_version.json` | Example questionnaire schema payload |

### Technical Decisions

- The builder will be a client component boundary because it requires rich local editing, conditional rendering, and preview toggling.
- The frontend will maintain a canonical nested builder state model in a persisted Zustand store even though the provided example schema is flat; this preserves the product requirement for parent/child sections and leaf-only questions and gives the builder, preview route, and save flow a single source of truth.
- The generated backend `schema` must be produced through a dedicated serialization transform layer instead of being assembled inline in route components.
- Save flow will branch by questionnaire type: create questionnaire then create first version if the type has no questionnaire root yet; otherwise create a new version for the existing questionnaire root.
- `GET /api/v1/questionnaires/types/{type}/versions` already returns both `questionnaireId` and `questionnaireTitle`, so the builder can determine whether to create a questionnaire root or only create a version without an extra discovery endpoint.
- `POST /api/v1/questionnaires/{id}/versions` is documented as accepting only `{ schema }` and can return `409 Draft version already exists`, so the UI must be prepared for the backend to enforce a single draft-version-at-a-time rule per questionnaire root.
- Title editing should be enabled only when the selected questionnaire type has no existing questionnaire root. For existing questionnaire roots, title should render as read-only inherited metadata until backend support exists for updates.
- Qualitative feedback remains a single global section rendered after all quantitative content and configured independently from the quantitative tree.
- Preview will live at `/superadmin/questionnaires/new/preview`, reuse the same builder state transformed into a student-view render model, rather than depending on a saved backend version, and should exclude admin-only actions while remaining accessible only to superadmins.
- The preview route should read from the currently active persisted builder draft context, wait for persisted-store hydration before deciding between render and empty state, look intentionally read-only, and provide a clear return path back to the builder without losing draft state.
- The authoring UI should use an outline-first layout for section structure editing.
- The builder should preserve unsaved progress locally in `localStorage` through the persisted Zustand store; drafts should be keyed by questionnaire type, with one active type-specific draft context loaded into the builder at a time. Smaller local form helpers may be used for bounded inputs, but they must not become a second source of truth for the questionnaire tree.
- On builder load, fresh server metadata for the selected questionnaire type is authoritative for read-only title, questionnaire root identity, and version context; persisted draft state restores only authoring content such as sections, questions, weights, and qualitative configuration.
- Builder load sequencing should fetch server metadata first, then hydrate the active type draft into the authoring view once metadata is confirmed valid for that type.
- If the selected questionnaire type can no longer resolve to valid server metadata, the builder should discard the invalid active context for that type and show an error or empty state instead of restoring stale root-derived metadata.
- Successful save must clear the local builder draft; failed save must preserve it; explicit discard/reset must clear it and return the builder to a clean state.
- A leaf section is any section node with no child sections; only leaf sections may have weights and direct questions.
- Leaf-section weights are required and must total exactly 100 across the quantitative questionnaire.
- The implementation should keep three distinct models: a canonical builder tree model for authoring, a serialized API schema model for backend submission, and a student preview render model for route rendering.
- The serializer should prefer preserving the nested authoring structure in the outgoing `schema`, but if backend compatibility requires a flatter payload it should fall back to a flat `sections[]` shape containing only leaf sections, where each section includes `id`, `order`, `title`, `weight`, `parentPath`, and `questions[]`.
- In the flat fallback shape, `parentPath` should be a `string[]` of ancestor section IDs ordered from the root section to the immediate parent.
- Validation should prevent invalid authoring states before submission, especially parent sections with questions, non-leaf weights, and missing required leaf/question content. Global blocking feedback should use `sonner` toasts, while section/question-specific invalid states should still render local repair cues in the builder.
- `schemas/questionnaires/questionnaire-builder.schema.ts` should handle bounded field/form validation, while `lib/questionnaires/builder-validator.ts` should enforce cross-tree business rules that depend on the full nested draft state.
- When a leaf section with direct questions is about to become a parent section, the UI must warn the user in a confirmation dialog that those direct questions will be removed before continuing.
- The current documented backend contract does not expose an endpoint to rename an existing questionnaire root during version creation; title changes for existing questionnaire types are therefore blocked in the UI and tracked as follow-up backend support work.
- Existing questionnaire-root titles should be displayed as intentionally locked inherited metadata, not as an ambiguous disabled input field.
- If a superadmin changes questionnaire type while the current draft context has unsaved changes, the UI must show a confirmation dialog before replacing the active draft context with the selected type's draft or clean state.
- Switching types should preserve the previously active type draft untouched in storage; only the active in-memory builder context should change after confirmation.
- Multi-tab draft consistency is out of scope for this spec; the persisted draft model is defined for a single active browser context.
- Accumulation of abandoned type-keyed drafts in `localStorage` is an accepted tradeoff for the current scope; cleanup beyond save/discard is future work.
- The current student evaluation flow does not yet consume questionnaire APIs; when that integration happens it should use `GET /api/v1/questionnaires/{id}/latest-active-version` or equivalent published-only resolution, keeping draft builder output isolated from student access.

## Implementation Plan

### Tasks

- [x] Task 1: Define builder domain contracts and schema helpers
  - File: `types/questionnaires/builder.ts`
  - Action: Add the canonical builder-state types for questionnaire metadata, nested section nodes, quantitative question nodes, qualitative feedback config, preview state, and serializer-ready payload shapes.
  - Notes: Keep the builder tree model separate from both API submission shape and preview render shape.
- [x] Task 2: Expand shared questionnaire domain types for create/version flows
  - File: `types/questionnaires/index.ts`
  - Action: Add handwritten request/response types for questionnaire creation, version creation, and any type/version metadata needed by the builder save flow.
  - Notes: Preserve existing list-page types and export patterns.
- [x] Task 3: Add questionnaire builder validation schema entrypoints
  - File: `schemas/questionnaires/questionnaire-builder.schema.ts`
  - Action: Define Zod schemas or validation helpers for bounded builder inputs such as metadata, question text, and qualitative feedback configuration.
  - Notes: Do not make this schema the source of truth for the full nested draft tree; persisted state remains in the builder store and RHF/Zod should stay limited to bounded form surfaces.
- [x] Task 4: Re-export questionnaire schemas through feature index
  - File: `schemas/questionnaires/index.ts`
  - Action: Re-export questionnaire builder schema utilities using the same feature-schema pattern already used under `schemas/auth`.
  - Notes: Keep feature imports simple for route and component consumers.
- [x] Task 5: Implement builder serializer for backend submission
  - File: `lib/questionnaires/builder-serializer.ts`
  - Action: Map the canonical nested builder state into the backend `schema` object accepted by `POST /api/v1/questionnaires/{id}/versions`.
  - Notes: This module must encode nested authoring semantics into a backend-compatible payload while preserving quantitative-first and qualitative-last ordering, and must also implement the flat fallback `sections[]` shape using leaf-only sections plus `parentPath: string[]` metadata.
- [x] Task 6: Implement builder validation rules outside UI components
  - File: `lib/questionnaires/builder-validator.ts`
  - Action: Add business-rule validation for leaf-only questions, leaf-only weights, exact total weight of 100, allowed question types, qualitative comment placement, and destructive section conversion checks.
  - Notes: Return structured errors that can drive both `sonner` toasts and local repair cues in the builder UI.
- [x] Task 7: Create persisted builder store as the single draft source of truth
  - File: `stores/questionnaire-builder-store.ts`
  - Action: Add a Zustand persisted store for questionnaire metadata, nested tree mutations, preview state, reset/discard behavior, hydration, active questionnaire-type context, and per-type draft lifecycle keyed by questionnaire type.
  - Notes: Use `createJSONStorage(() => localStorage)` to match existing persistence patterns, load one active type-specific draft context at a time, and clear only the relevant type draft on successful save or explicit discard.
- [x] Task 8: Extend questionnaire endpoints for create/version mutations
  - File: `network/endpoints.ts`
  - Action: Add endpoint constants for questionnaire creation and questionnaire version creation.
  - Notes: Reuse the current enum pattern and keep endpoint names verb-neutral and consistent.
- [x] Task 9: Implement questionnaire create/version request helpers
  - File: `network/requests/questionnaires.ts`
  - Action: Add thin request wrappers for `POST /api/v1/questionnaires` and `POST /api/v1/questionnaires/{id}/versions`.
  - Notes: Return `response.data`, rely on `apiClient`, and preserve the current request-layer style.
- [x] Task 10: Add mutation hook for questionnaire root creation
  - File: `hooks/questionnaires/use-create-questionnaire.ts`
  - Action: Add a React Query mutation hook that wraps the create-questionnaire request and exposes typed mutation state.
  - Notes: Keep query invalidation or refetch hooks aligned with the questionnaire list page.
- [x] Task 11: Add mutation hook for questionnaire version creation
  - File: `hooks/questionnaires/use-create-questionnaire-version.ts`
  - Action: Add a React Query mutation hook that wraps the create-version request and exposes typed mutation state, including `409` handling.
  - Notes: Keep the hook token-safe by relying on the centralized axios client.
- [x] Task 12: Add orchestration hook for the full builder save flow
  - File: `hooks/questionnaires/use-save-questionnaire-builder.ts`
  - Action: Compose store state, serializer output, validator results, and create/create-version mutations into one save action.
  - Notes: Branch by whether the selected type already has a questionnaire root, block editing title for existing roots, route `409` to a resolve-existing-draft toast plus redirect, and clear persisted draft state only on successful save.
- [x] Task 13: Build the questionnaire builder shell route
  - File: `app/(dashboard)/superadmin/questionnaires/new/page.tsx`
  - Action: Replace the placeholder page with the client-side builder route that loads questionnaire type context, binds to the persisted store, handles active draft-context switching, and composes the builder UI.
  - Notes: Keep explicit loading/error/empty states consistent with the current questionnaires area, fetch server metadata before hydrating persisted authoring content, and block silent type switching when the current draft is dirty.
- [x] Task 14: Create the overall builder shell component
  - File: `components/faculytics/questionnaires/questionnaire-builder-shell.tsx`
  - Action: Compose metadata header, outline/editor regions, qualitative editor, save/discard actions, and validation state into the main authoring surface.
  - Notes: Present existing-root titles as intentionally locked inherited metadata, not a generic disabled input.
- [x] Task 15: Create the outline-first section tree component
  - File: `components/faculytics/questionnaires/questionnaire-outline-panel.tsx`
  - Action: Render the nested section/subsection hierarchy with controls for add, select, reorder, and convert-to-parent actions.
  - Notes: The outline should make parent/leaf status obvious and surface local repair cues for invalid nodes.
- [x] Task 16: Create the section editor component
  - File: `components/faculytics/questionnaires/questionnaire-section-editor.tsx`
  - Action: Render section title, order, and leaf-only weight controls for the currently selected section.
  - Notes: Hide or replace weight inputs on non-leaf sections and integrate the destructive conversion dialog path.
- [x] Task 17: Create the quantitative question editor component
  - File: `components/faculytics/questionnaires/questionnaire-question-editor.tsx`
  - Action: Render add/edit/remove controls for `LIKERT_1_5` and `YES_NO` questions on leaf sections only.
  - Notes: Parent sections must never render active question-entry controls.
- [x] Task 18: Create the qualitative feedback editor component
  - File: `components/faculytics/questionnaires/questionnaire-qualitative-editor.tsx`
  - Action: Render configuration controls for the single optional final comment section.
  - Notes: Reuse `Textarea`-related patterns where appropriate and keep the qualitative block structurally separate from the quantitative tree.
- [x] Task 19: Build the superadmin-only preview route
  - File: `app/(dashboard)/superadmin/questionnaires/new/preview/page.tsx`
  - Action: Add the preview page that reads from the currently active persisted builder draft context and renders the draft in student-view format.
  - Notes: The route must inherit superadmin protection from the surrounding segment, wait for persisted-store hydration before resolving UI state, and handle missing/stale draft state gracefully.
- [x] Task 20: Create the preview renderer component
  - File: `components/faculytics/questionnaires/questionnaire-preview-renderer.tsx`
  - Action: Render the student-view preview using `RadioGroup` for quantitative questions and `Textarea` for the final comment section.
  - Notes: Make the preview intentionally read-only, with no save affordance and a clear “Back to builder” action.
- [x] Task 21: Integrate post-save and conflict navigation into questionnaire management
  - File: `app/(dashboard)/superadmin/questionnaires/page.tsx`
  - Action: Ensure successful builder completion and `409` conflict recovery land the user back on the questionnaires management page with clear context.
  - Notes: The current scope only requires redirecting the user back to `/superadmin/questionnaires`; explicit draft-row selection or resolution UI remains future work.

### Known Constraints / Open Questions

- Known constraint: existing questionnaire-root titles are read-only in the UI because the documented create-version endpoint only accepts `schema`.
- Known constraint: students must only access published/active questionnaire versions; draft builder output remains superadmin-only.
- Known constraint: backend may reject version creation with `409 Draft version already exists`, and the UI should redirect the user to `/superadmin/questionnaires` to resolve the existing draft.
- Known constraint: only one questionnaire-type draft context is active in the builder at a time, even though persisted drafts may exist for multiple types.
- Known constraint: multi-tab draft consistency is out of scope; the builder defines behavior only for a single active browser context.
- Known constraint: abandoned type-keyed drafts may accumulate in `localStorage` until the user saves or discards them; automatic draft cleanup is future work.
- Backend compatibility strategy: the serializer should first attempt to preserve nested structure in `schema`, with a flat fallback where `sections[]` contains only leaf sections and each section includes `id`, `order`, `title`, `weight`, `parentPath`, and `questions[]`.

### Acceptance Criteria

- [ ] AC 1: Given a superadmin visits `/superadmin/questionnaires/new`, when the page loads, then the builder shows questionnaire metadata controls and an outline-first quantitative authoring surface.
- [ ] AC 2: Given a questionnaire type with no existing questionnaire root is selected, when the builder loads, then the title input is editable, required, and included in the create-questionnaire request before the first version is created.
- [ ] AC 3: Given a questionnaire type with an existing questionnaire root is selected, when the builder loads, then the inherited title is displayed as read-only metadata and is not editable in the UI.
- [ ] AC 4: Given a superadmin adds sections and subsections, when a section has child sections, then that section cannot contain direct quantitative questions and only leaf sections can render question-entry controls.
- [ ] AC 5: Given a superadmin edits leaf sections, when configuring weights, then weight controls are available only on leaf sections and the combined quantitative leaf-section weights must total exactly 100 before save is allowed.
- [ ] AC 6: Given the leaf-section weight total is not exactly 100, when the superadmin attempts to save, then the builder blocks submission, shows a `sonner` toast describing the required total, and keeps local repair cues visible on the relevant sections.
- [ ] AC 7: Given a superadmin adds quantitative questions to a leaf section, when selecting a question type, then only `LIKERT_1_5` and `YES_NO` options are available.
- [ ] AC 8: Given a superadmin configures qualitative feedback, when the draft is rendered, then one optional global comment section appears after all quantitative content and does not appear inside the quantitative section tree.
- [ ] AC 9: Given a superadmin adds a subsection to a section that already contains direct questions, when that action would convert the section into a parent, then the UI shows a confirmation dialog warning that direct questions will be removed before continuing.
- [ ] AC 10: Given a superadmin confirms conversion of a question-bearing leaf section into a parent section, when the subsection is added, then the removed direct questions no longer appear in the builder state, preview state, or serialized payload.
- [ ] AC 11: Given a superadmin refreshes or accidentally leaves the builder before saving, when they return to the builder, then the persisted draft state is restored until they save successfully or explicitly discard/reset it.
- [ ] AC 12: Given the builder loads for a selected questionnaire type, when both persisted draft content and fresh server metadata exist, then read-only title and questionnaire identity use the latest server metadata while authoring content restores from the persisted draft.
- [ ] AC 13: Given the builder loads for a selected questionnaire type, when server metadata for that type is missing or invalid, then the builder does not restore stale root-derived metadata and instead shows an error or empty state for that type.
- [ ] AC 14: Given a superadmin changes questionnaire type while the current draft context has unsaved changes, when they attempt the switch, then the UI shows a confirmation dialog before replacing the active draft context.
- [ ] AC 15: Given a superadmin cancels the questionnaire-type switch confirmation, when the dialog closes, then the current type and draft context remain unchanged.
- [ ] AC 16: Given a superadmin confirms the questionnaire-type switch, when the dialog completes, then the builder replaces the active draft context with the selected type’s saved draft or clean state for that type while preserving the previous type draft in storage.
- [ ] AC 17: Given a superadmin opens `/superadmin/questionnaires/new/preview` with valid persisted active draft state, when the preview route renders after hydration completes, then it shows the questionnaire in an intentionally read-only student-view layout with a clear return-to-builder action.
- [ ] AC 18: Given a superadmin opens `/superadmin/questionnaires/new/preview` without readable active draft state, when the route renders after hydration completes, then it shows a graceful empty/error state with a path back to the builder.
- [ ] AC 19: Given a questionnaire exists only as a draft or unpublished version, when a student opens the existing evaluation flow, then unpublished questionnaire content remains invisible and the student continues to see only the unavailable/not-configured state until a version is published.
- [ ] AC 20: Given the selected questionnaire type has no questionnaire root yet, when the superadmin saves a valid builder draft, then the frontend creates the questionnaire first and then creates its first questionnaire version using the serialized `schema`.
- [ ] AC 21: Given the selected questionnaire type already has a questionnaire root, when the superadmin saves a valid builder draft, then the frontend creates only a new questionnaire version under that existing root and does not create a duplicate questionnaire.
- [ ] AC 22: Given the backend returns `409 Draft version already exists` during version creation, when the save flow stops, then the UI preserves the current draft, shows a `sonner` resolve-existing-draft message, and redirects the superadmin to `/superadmin/questionnaires`.
- [ ] AC 23: Given any create or version request fails for reasons other than the expected `409` conflict, when the save flow stops, then the UI preserves current draft state and surfaces an error without discarding work.
- [ ] AC 24: Given save succeeds, when the full create/create-version flow completes, then the user is redirected or returned to questionnaire management and the persisted local draft state is cleared only for the active questionnaire type.
- [ ] AC 25: Given a superadmin explicitly discards or resets the builder, when the action is confirmed, then the persisted local draft is cleared only for the active questionnaire type and the builder returns to a clean initial state.

## Additional Context

### Dependencies

- Existing `shadcn/ui` primitives, especially `Textarea`, `RadioGroup`, `Button`, `Card`, form controls, and any dialog/sheet components already installed
- Existing `sonner` toast surface from `components/ui`
- Existing axios client and auth interceptor in `network/axios.ts`
- Existing dashboard route protection for superadmin access
- `context/schema.d.ts` for endpoint contract reference
- `context/questionnaire_version.json` for schema shape reference
- Questionnaire type/version data from `GET /api/v1/questionnaires/types` and `GET /api/v1/questionnaires/types/{type}/versions`

### Testing Strategy

- Automated checks:
  - Run `npm run lint`
  - Run `npx tsc --noEmit`
- Manual verification:
  - Load `/superadmin/questionnaires/new` as a superadmin and confirm the builder replaces the placeholder state.
  - Verify existing questionnaire types show locked inherited title metadata, while types without a questionnaire root allow title entry.
  - Verify fresh server metadata overrides stale persisted read-only metadata while authoring content still restores from the saved draft.
  - Verify invalid or missing server metadata for a selected type yields an error or empty state instead of restoring stale root-derived metadata.
  - Verify changing questionnaire type with unsaved changes opens a confirmation dialog.
  - Verify canceling type switch keeps the current type and draft context unchanged.
  - Verify confirming type switch loads the selected type's saved draft or clean state while preserving the previous type draft in storage.
  - Add, edit, and remove nested sections/subsections and confirm only leaf sections can hold weights and quantitative questions.
  - Confirm leaf-section weights must total exactly 100, and invalid totals trigger a `sonner` toast plus local repair cues.
  - Confirm only `LIKERT_1_5` and `YES_NO` quantitative questions can be created.
  - Confirm the qualitative comment block stays optional and always renders after quantitative sections.
  - Confirm converting a question-bearing leaf into a parent section triggers the confirmation dialog and removes direct questions only after confirmation.
  - Verify the preview route reflects unsaved builder edits, looks intentionally read-only, and provides a clear return-to-builder action.
  - Verify the preview route handles missing or stale persisted draft state gracefully.
  - Verify draft builder output is visible only to superadmin preview and not to the student evaluation flow before publication.
  - Verify successful save for a new questionnaire type performs questionnaire creation followed by version creation and clears persisted draft state.
  - Verify successful save for an existing questionnaire type creates only a new version and leaves the title read-only.
  - Verify a `409 Draft version already exists` response shows a `sonner` resolve-existing-draft message, preserves the draft, and redirects to `/superadmin/questionnaires`.
  - Verify generic save failures preserve the draft and surface error feedback without losing work.
  - Verify explicit discard/reset clears only the active type draft state and returns the builder to a clean initial state.

### Notes

- Product direction explicitly prefers a Google Forms-like authoring experience.
- An outline-first hierarchical editor is preferred over a `shadcn` table for authoring; table layouts may still be useful for compact summaries but should not be the main builder interaction.
- The backend sample schema is flat, so the serializer must explicitly define how nested authoring structure is represented inside `schema` while remaining backend-compatible.
- The most implementation-sensitive risk is serializer compatibility: the frontend authoring model is nested while the documented example payload is flat.
- The most important backend constraint is the documented single-draft-version conflict (`409`) for questionnaire version creation.
- The core implementation spine is persisted store -> validator/serializer -> save orchestration hook -> builder and preview routes; many of the listed files are intentionally small supporting modules around that path.
- The most important state-management risk is active draft-context switching between questionnaire types; the builder should always make that transition explicit through confirmation.
- The persisted draft model is intentionally type-keyed; root-level identity should not introduce a second draft-key system unless backend behavior changes later.
- RHF/Zod should remain limited to bounded metadata or editor inputs; the persisted store remains the only source of truth for the nested questionnaire tree.
- The `409` redirect currently returns the user to questionnaire management only; explicit draft-resolution actions on that page are future work.
- Stale local drafts that are never saved or discarded are an accepted localStorage tradeoff for the current scope.
- Future publish/deprecate actions can build on the same questionnaire management area but remain out of scope for this spec.

## Review Notes

- Adversarial review completed.
- Findings: 10 total, 9 fixed, 1 skipped.
- Resolution approach: auto-fix.
