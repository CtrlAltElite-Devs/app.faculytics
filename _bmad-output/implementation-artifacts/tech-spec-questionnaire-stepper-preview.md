---
title: 'Questionnaire Stepper Preview'
slug: 'questionnaire-stepper-preview'
created: '2026-03-20'
status: 'ready-for-dev'
stepsCompleted: [1, 2, 3, 4]
tech_stack:
  - 'Next.js 16 (App Router)'
  - 'React 19'
  - 'TypeScript (strict)'
  - 'shadcn/ui primitives (Button, Badge, Card, RadioGroup, Label, Textarea)'
  - 'Tailwind CSS 4'
  - 'Zustand 5 (builder store)'
  - 'React Query 5 (version fetching)'
  - 'lucide-react (icons)'
files_to_modify:
  - 'components/shared/stepper/stepper-context.tsx [NEW]'
  - 'components/shared/stepper/stepper-indicator.tsx [NEW]'
  - 'components/shared/stepper/stepper-navigation.tsx [NEW]'
  - 'components/shared/stepper/index.ts [NEW]'
  - 'features/questionnaires/components/questionnaire-stepper.tsx [NEW]'
  - 'features/questionnaires/components/questionnaire-step-section.tsx [NEW]'
  - 'features/questionnaires/components/questionnaire-step-qualitative.tsx [NEW]'
  - 'features/questionnaires/components/questionnaire-step-question.tsx [NEW]'
  - 'app/(dashboard)/superadmin/questionnaires/new/preview/page.tsx [MODIFY]'
  - 'app/(dashboard)/superadmin/questionnaires/preview/page.tsx [MODIFY]'
  - 'features/questionnaires/index.ts [MODIFY - add new component exports]'
code_patterns:
  - 'Shared components use hyphenated file names: confirmation-dialog.tsx, app-loading-screen.tsx'
  - 'Preview pages use useSearchParams for type/versionId params — add step param to existing pattern'
  - 'Preview state cards use min-h-[55vh] centered layout for loading/error/empty states'
  - 'Tree utilities (isLeafSection, sortSections, collectLeafSections) in builder-validator.ts'
  - 'QuestionnaireBuilderPreviewModel.sections gives depth-0 sections; recursive children within'
  - 'Barrel exports in features/questionnaires/index.ts re-export all public API'
  - 'Brand tokens: font-playfair for headings, brand-yellow for instructional cards'
test_patterns:
  - 'bun run lint + npx tsc --noEmit as mandatory pre-handoff checks'
  - 'Manual verification for loading, empty, error, and step navigation states'
  - 'No test framework configured — manual testing only'
---

# Tech-Spec: Questionnaire Stepper Preview

**Created:** 2026-03-20

## Overview

### Problem Statement

The questionnaire preview renders all sections as a single long-scrolling page, which becomes overwhelming for long questionnaires and doesn't reflect the actual evaluation experience students will have.

### Solution

Convert the preview into a multi-step stepper flow where each top-level section becomes a step. Built as a two-layer UI library: generic stepper primitives in `components/shared/stepper/` composed with dedicated questionnaire step components in `features/questionnaires/components/`. Custom implementation using existing shadcn primitives — no external stepper dependency.

### Scope

**In Scope:**
- Generic stepper primitives (`stepper-context`, `stepper-indicator`, `stepper-navigation`) in `components/shared/stepper/`
- Dedicated questionnaire step components (`questionnaire-stepper`, `questionnaire-step-section`, `questionnaire-step-qualitative`, `questionnaire-step-question`) in `features/questionnaires/components/`
- Depth-0 sections map to steps; nested children render inline within each step
- Qualitative feedback as its own final step (N+1) when enabled
- `mode: "preview" | "response"` prop API designed; only `preview` implemented
- `allowFreeNavigation` prop — `true` for preview, `false` for response (future)
- `renderQuestion` slot for future form wiring
- Responsive step indicator (horizontal on desktop, compact on mobile) with overflow handling for 6+ sections
- Step indicator shows section titles (not just numbers) and three visual states: upcoming, current, completed (checkmark)
- Completion state after final step: "End of preview" screen in preview mode (future: review/submit in response mode)
- Questionnaire summary header above stepper: "N sections · M questions"
- Both preview routes updated (builder preview + version preview)
- Single-section fallback: when total computed steps ≤ 1, render single-page layout instead of stepper (e.g., 1 section + no qualitative = 1 step = no stepper; 1 section + qualitative = 2 steps = stepper)
- Active step clamped to valid range reactively (handles live data changes in builder preview)
- Rating scale instructions rendered above stepper indicator (always visible)
- URL step state sync via `?step=N` search param (1-indexed in URL, 0-indexed internally). Must preserve existing search params (`type`, `versionId`) when updating
- Scroll-to-top on every step transition
- Empty step state when a section has no content yet in builder preview

**Out of Scope:**
- `response` mode form wiring (React Hook Form integration)
- Student submission behavior
- Step validation gating (future for response mode)
- Animation/transitions between steps
- Modifying existing `PreviewSection` / `QuestionnairePreviewRenderer`
- View mode toggle (stepper vs. full-scroll) — potential fast-follow enhancement
- Expanding preview access to non-SuperAdmin roles (architecture is already role-agnostic by design)

## Context for Development

### Codebase Patterns

- Feature-sliced architecture: domain code in `features/<feature>/`, shared primitives in `components/shared/`
- shadcn/ui primitives (`Button`, `Badge`, `Card`, `RadioGroup`, `Label`, `Textarea`) are the base UI layer
- `@/*` path alias for all cross-folder imports
- Client components use `"use client"` directive; default to server components where possible
- Preview model is built via `buildQuestionnairePreviewModel(draft)` from `builder-serializer.ts`
- Two data sources: Zustand store (builder preview) and React Query (version preview)
- Shared components follow hyphenated naming: `confirmation-dialog.tsx`, `app-loading-screen.tsx`
- Preview state cards use `min-h-[55vh]` centered layout pattern for loading/error/empty states
- Questionnaire routes use `useSearchParams` — builder preview uses `type`, version preview uses `versionId`. New `step` param follows the same convention
- Tree traversal utilities in `builder-validator.ts` (`isLeafSection()`, `sortSections()`, `collectLeafSections()`) are typed for `QuestionnaireBuilderSectionNode[]` — NOT compatible with `QuestionnaireBuilderPreviewSection[]`. The stepper must implement its own inline question counting function for the preview model
- Brand tokens: `font-playfair` for headings, `brand-yellow` for instructional accent cards
- Barrel export in `features/questionnaires/index.ts` re-exports all hooks, types, schemas, validators, serializers, store

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `features/questionnaires/types/builder.ts` | All types including `QuestionnaireBuilderPreviewModel`, `QuestionnaireBuilderPreviewSection`, `QuestionnaireBuilderPreviewQuestion` |
| `features/questionnaires/lib/builder-serializer.ts` | `buildQuestionnairePreviewModel(draft)` — transforms draft into preview model with recursive sections |
| `features/questionnaires/lib/builder-validator.ts` | Tree utilities: `isLeafSection()`, `sortSections()`, `collectLeafSections()` |
| `features/questionnaires/lib/builder-deserializer.ts` | `deserializeQuestionnaireVersionToDraft()` — server schema to draft conversion for version preview |
| `features/questionnaires/components/builder/questionnaire-preview-renderer.tsx` | Current flat-scroll preview renderer — reference for question rendering patterns (Likert grid, Yes/No grid) |
| `features/questionnaires/components/questionnaire-rating-scale-instructions.tsx` | Yellow instructional card with 5-point rating scale — renders above stepper |
| `features/questionnaires/store/questionnaire-builder-store.ts` | Zustand store with `drafts[type]` and `hydrated` state |
| `features/questionnaires/constants/builder.ts` | `MAX_SECTION_NESTING_LEVEL = 4`, `BUILDER_QUESTION_TYPES`, `DEFAULT_QUALITATIVE_MAX_LENGTH` |
| `app/(dashboard)/superadmin/questionnaires/new/preview/page.tsx` | Builder preview route — reads draft from Zustand, converts to preview model |
| `app/(dashboard)/superadmin/questionnaires/preview/page.tsx` | Version preview route — fetches via React Query, deserializes to draft, converts to preview model |
| `app/(dashboard)/superadmin/questionnaires/_components/questionnaire-preview-state-card.tsx` | Reusable error/empty state card for preview pages |
| `app/(dashboard)/superadmin/questionnaires/_components/questionnaire-preview-loading-card.tsx` | Loading state with spinner for preview pages |
| `components/shared/confirmation-dialog.tsx` | Reference for shared component structure and naming convention |

### Technical Decisions

- **Custom stepper over library:** Stepperize assumes static step definitions; our steps are runtime-dynamic from questionnaire data. shadcn has no official stepper. Custom implementation is ~80 lines of logic with zero new dependencies.
- **Two-layer architecture:** Generic stepper knows nothing about questionnaires. Domain layer composes generic stepper with questionnaire content. This enables future reuse (e.g., multi-step enrollment).
- **Dedicated step components over reusing PreviewSection:** The stepper context changes the rendering hierarchy — top-level section IS the step (no card wrapper needed), nested children get cards. Different composition than the flat scroll layout.
- **`renderQuestion` slot:** Enables future `response` mode to inject controlled form inputs without modifying stepper or section components.
- **`allowFreeNavigation` prop:** Preview mode allows clicking any step indicator for superadmin convenience. Response mode enforces linear progression.
- **Single-section fallback:** When total computed steps ≤ 1 (sections.length + qualitative count), skip the stepper entirely and render a single-page layout. Example: 1 section + no qualitative = 1 step = no stepper. 1 section + qualitative = 2 steps = stepper. Avoids "Step 1 of 1" absurdity.
- **Reactive step clamping:** In builder preview, the draft can change while the stepper is mounted (sections added/deleted). The context value must expose `Math.min(activeStep, totalSteps - 1)` as the `activeStep` — not raw state — to prevent a one-frame render of invalid state. Additionally, a `useEffect` watching `totalSteps` should call `setActiveStep(prev => Math.min(prev, totalSteps - 1))` to persist the clamped value.
- **Rating scale instructions placement:** `QuestionnaireRatingScaleInstructions` renders above the stepper indicator, outside the step content area, so it's always visible regardless of active step.
- **URL step state:** Sync active step to `?step=N` via `useSearchParams`. URL uses **1-indexed** values (user-friendly). Internal state is 0-indexed. Conversion: `initialStep = parseInt(step) - 1` on read, `params.set("step", String(activeStep + 1))` on write. **Must preserve existing search params** (`type`, `versionId`) when updating — use `new URLSearchParams(searchParams.toString())` then set `step`, then `router.replace(\`?\${params.toString()}\`, { scroll: false })`. Enables deep-linking and preserves position on page refresh.
- **Step indicator overflow:** When `steps.length > 6` on desktop, use horizontal scroll with `overflow-x-auto` and gradient fade masks on edges to hint at scrollability. Mobile always uses compact "Step N of M: {title}" format regardless of count.
- **Scroll-to-top on transition:** The stepper context's `next()`, `prev()`, and `goTo()` trigger `scrollTo(0, 0)` to reset viewport position on step change. Must include `typeof window !== "undefined"` SSR guard.
- **Empty step state:** When a section step has no children and no questions (builder preview of incomplete draft), render a contextual empty state: "No questions added to this section yet."
- **Step indicator with section titles:** The indicator must display section titles (not just "Step N") so superadmins can map steps to builder sections. Three visual states: upcoming (muted), current (active/highlighted), completed (checkmark). Critical for the builder-preview workflow loop.
- **Completion/review terminal state:** After the final step (qualitative or last section), render an "End of preview" screen. In preview mode this confirms the questionnaire ends here. In future response mode this becomes the review/submit screen. This is a virtual step — not counted in the step indicator.
- **Questionnaire summary header:** A lightweight line above the stepper: "N sections · M questions" computed from the preview model. Gives reviewers scope context at a glance.

## Implementation Plan

### Tasks

#### Layer 1: Generic Stepper Primitives (no questionnaire knowledge)

- [ ] Task 1: Create `components/shared/stepper/stepper-context.tsx`
  - File: `components/shared/stepper/stepper-context.tsx` [NEW]
  - Action: Create a React context + provider + hook for stepper state management.
  - Details:
    - `StepperProvider` accepts: `totalSteps: number`, `initialStep?: number` (default 0), `allowFreeNavigation?: boolean` (default true), `onStepChange?: (step: number) => void`
    - **`initialStep` is read once** via `useState(() => Math.min(Math.max(initialStep ?? 0, 0), totalSteps - 1))` — clamped on init, not reactive to prop changes afterward
    - Context value exposes: `activeStep` (always `Math.min(rawState, totalSteps - 1)` — pre-render clamped), `totalSteps`, `isFirstStep`, `isLastStep`, `next()`, `prev()`, `goTo(index)`, `allowFreeNavigation`
    - `next()` / `prev()` / `goTo()` clamp to `[0, totalSteps - 1]` range
    - All navigation methods trigger `if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "instant" })` after state update (SSR-safe)
    - `useEffect` watching `totalSteps`: when it shrinks, persist clamped value via `setActiveStep(prev => Math.min(prev, totalSteps - 1))`
    - All navigation methods call `onStepChange` callback when step actually changes (not on no-op same-step)
    - Export `useStepper()` hook that throws if used outside provider
    - `"use client"` directive

- [ ] Task 2: Create `components/shared/stepper/stepper-indicator.tsx`
  - File: `components/shared/stepper/stepper-indicator.tsx` [NEW]
  - Action: Create the visual step progress indicator component.
  - Details:
    - Consumes `useStepper()` context
    - Props: `steps: Array<{ label: string }>`, `completedSteps?: Set<number>`
    - Three visual states per step: upcoming (muted text + border), current (active highlight + ring), completed (checkmark icon + success color)
    - Desktop (≥ md): Horizontal bar with numbered circles and step labels. If `steps.length > 6`, use `overflow-x-auto` with gradient fade masks on edges for horizontal scroll
    - Mobile (< md): Compact "Step N of M: {label}" single-line header
    - When `allowFreeNavigation` is true (from context), step circles are clickable `<button>` elements calling `goTo(index)`. When false, render as inert `<div>`
    - Use `Check` icon from `lucide-react` for completed state
    - **Accessibility:** Container has `role="tablist"`, each step has `role="tab"`, active step has `aria-current="step"`. Step content area in the parent should use `role="tabpanel"`
    - `"use client"` directive

- [ ] Task 3: Create `components/shared/stepper/stepper-navigation.tsx`
  - File: `components/shared/stepper/stepper-navigation.tsx` [NEW]
  - Action: Create Back/Next navigation buttons component.
  - Details:
    - Consumes `useStepper()` context
    - Props: `nextLabel?: string` (default "Next"), `prevLabel?: string` (default "Back"), `finalLabel?: string` (default "Finish"), `onFinish?: () => void`, `showBackOnFirst?: boolean` (default false)
    - Renders: Back button (hidden or disabled on first step based on `showBackOnFirst`), Next button (shows `finalLabel` on last step)
    - On last step, Next button calls `onFinish` instead of `next()`
    - Uses shadcn `Button` component. Back = `variant="outline"`, Next = `variant="default"`
    - Layout: `flex justify-between` with back on left, next on right
    - `"use client"` directive

- [ ] Task 4: Create `components/shared/stepper/index.ts`
  - File: `components/shared/stepper/index.ts` [NEW]
  - Action: Barrel export for stepper primitives.
  - Details: Re-export `StepperProvider`, `useStepper`, `StepperIndicator`, `StepperNavigation` and their prop types

#### Layer 2: Questionnaire Domain Components

- [ ] Task 5: Create `features/questionnaires/components/questionnaire-step-question.tsx`
  - File: `features/questionnaires/components/questionnaire-step-question.tsx` [NEW]
  - Action: Create the single question renderer — the composable leaf unit.
  - Details:
    - Props: `question: QuestionnaireBuilderPreviewQuestion`, `disabled?: boolean` (default true)
    - Renders question prompt, descriptive subtitle ("Students will answer on a 1 to 5 scale." / "Students will answer yes or no.")
    - Likert: `RadioGroup` with 5 options in `sm:grid-cols-5` grid, each as `Label` with `RadioGroupItem` — match exact markup from current `questionnaire-preview-renderer.tsx`
    - Yes/No: `RadioGroup` with 2 options in `sm:grid-cols-2` grid
    - All inputs disabled when `disabled=true` (preview mode)
    - `"use client"` directive

- [ ] Task 6: Create `features/questionnaires/components/questionnaire-step-section.tsx`
  - File: `features/questionnaires/components/questionnaire-step-section.tsx` [NEW]
  - Action: Create the section step content renderer.
  - Details:
    - Props: `section: QuestionnaireBuilderPreviewSection`, `isTopLevel?: boolean` (default false), `mode?: "preview" | "response"` (default "preview"), `renderQuestion?: (question: QuestionnaireBuilderPreviewQuestion, defaultRender: ReactNode) => ReactNode`
    - Top-level rendering (isTopLevel=true): No card wrapper. Renders section title as `h2` with `font-playfair`, weight badge if present, then content
    - Nested rendering (isTopLevel=false): Wraps in `Card`-style bordered container with title + weight badge
    - If section has children: recursively renders `QuestionnaireStepSection` for each child (isTopLevel=false), passing `renderQuestion` through at every level
    - **Depth guard:** Add `depth?: number` prop (default 0). If `depth > MAX_SECTION_NESTING_LEVEL` (imported from constants), return `null`. Increment depth on each recursive call
    - If section is a leaf (no children, has questions): maps questions through `renderQuestion` slot if provided, otherwise renders `QuestionnaireStepQuestion` for each
    - Empty state: if no children and no questions, render muted text "No questions added to this section yet."
    - `"use client"` directive

- [ ] Task 7: Create `features/questionnaires/components/questionnaire-step-qualitative.tsx`
  - File: `features/questionnaires/components/questionnaire-step-qualitative.tsx` [NEW]
  - Action: Create the qualitative feedback step content.
  - Details:
    - Props: `qualitative: QuestionnaireBuilderQualitativeConfig`, `mode?: "preview" | "response"` (default "preview")
    - Renders `Card` with `CardHeader` ("Comments" title + required badge if applicable) and `CardContent` containing `Textarea`
    - `Textarea` disabled when `mode="preview"`, placeholder "Add your comments here.", `maxLength` from config
    - Match existing qualitative rendering from `questionnaire-preview-renderer.tsx`
    - `"use client"` directive

- [ ] Task 8: Create `features/questionnaires/components/questionnaire-stepper.tsx`
  - File: `features/questionnaires/components/questionnaire-stepper.tsx` [NEW]
  - Action: Create the main orchestrator that composes generic stepper with questionnaire domain.
  - Details:
    - Props: `model: QuestionnaireBuilderPreviewModel`, `mode?: "preview" | "response"` (default "preview"), `allowFreeNavigation?: boolean` (default true), `backHref: string`, `backLabel: string`, `renderQuestion?: (question: QuestionnaireBuilderPreviewQuestion, defaultRender: ReactNode) => ReactNode`, `initialStep?: number`
    - **Step computation:** Build steps array from `model.sections` (depth-0). If `model.qualitative.enabled`, append a virtual qualitative step. Total steps = `sections.length + (qualitative enabled ? 1 : 0)`
    - **Single-section fallback:** If total steps ≤ 1 (only 1 section or 0 sections + qualitative), render single-page layout without stepper (render section content + qualitative inline, no StepperProvider)
    - **Question counting:** Write an inline `countQuestions(sections: QuestionnaireBuilderPreviewSection[]): number` helper that recursively walks `children` and sums `questions.length` on leaf sections. Do NOT use `collectLeafSections` from `builder-validator.ts` — it is typed for `QuestionnaireBuilderSectionNode[]`, not the preview model type
    - **Summary header:** Above everything, render page title (`h1`, `font-playfair`), subtitle, back button, and summary line: "{N} sections · {M} questions" where M is computed via the inline `countQuestions` helper
    - **Rating scale instructions:** Render `QuestionnaireRatingScaleInstructions` below summary, above stepper indicator
    - **Stepper layout:** Wrap step content in `StepperProvider` with computed `totalSteps`, `initialStep` from URL `?step=N` param (1-indexed in URL, convert: `parseInt(step) - 1`), and `allowFreeNavigation`
    - **Step indicator:** `StepperIndicator` with `steps` array built from section titles (+ "Comments" for qualitative step). Pass `completedSteps` as a `Set<number>` — managed via `visitedSteps` state: initialize as `new Set([initialStep])`, add `activeStep` to set on every `onStepChange` callback. Step content area should have `role="tabpanel"`
    - **Step content:** Conditionally render based on `activeStep`: if index < sections.length, render `QuestionnaireStepSection` with `isTopLevel=true`. If index === sections.length (qualitative step), render `QuestionnaireStepQualitative`. Focus the step content container via `ref.focus()` on step transition for accessibility
    - **Navigation:** `StepperNavigation` at the bottom
    - **Completion state:** Manage via local `const [showCompletion, setShowCompletion] = useState(false)`. Pass `onFinish={() => setShowCompletion(true)}` to `StepperNavigation`. When `showCompletion` is true, render the completion card instead of stepper content: "End of preview — This is how the questionnaire ends for students." with back-to-builder/questionnaires button and a "Back to last step" button that calls `setShowCompletion(false)`
    - **URL sync:** Read `?step=N` from `useSearchParams` on mount for `initialStep` (1-indexed, convert to 0-indexed). On step change via `onStepChange`, update URL preserving existing params: `const params = new URLSearchParams(searchParams.toString()); params.set("step", String(activeStep + 1)); router.replace(\`?\${params.toString()}\`, { scroll: false })`. The `initialStep` prop is consumed once by `StepperProvider` via `useState` initializer — subsequent URL changes from `onStepChange` do NOT re-trigger initialization (no infinite loop)
    - **Reactive clamping:** Handled by `StepperProvider` (Task 1) — exposes pre-render clamped `activeStep`. No additional clamping needed here
    - `"use client"` directive

#### Layer 3: Route Integration

- [ ] Task 9: Update builder preview page
  - File: `app/(dashboard)/superadmin/questionnaires/new/preview/page.tsx` [MODIFY]
  - Action: Replace `QuestionnairePreviewRenderer` with `QuestionnaireStepper`
  - Details:
    - Import `QuestionnaireStepper` from `@/features/questionnaires/components/questionnaire-stepper`
    - Keep existing loading/empty/error state handling unchanged
    - Replace the `<QuestionnairePreviewRenderer model={...} />` call with `<QuestionnaireStepper model={buildQuestionnairePreviewModel(draft)} mode="preview" allowFreeNavigation={true} backHref={\`/superadmin/questionnaires/new?type=\${requestedType}\`} backLabel="Back to builder" />`
    - Remove the outer `<section className="space-y-6 px-0 py-5 sm:px-6 md:p-8">` wrapper around the success state only (keep loading/empty state `<section>` wrappers with their existing padding). `QuestionnaireStepper` manages its own layout for the success case
    - `QuestionnaireStepper` handles URL `?step=N` sync internally — no need to pass `initialStep` from the page

- [ ] Task 10: Update version preview page
  - File: `app/(dashboard)/superadmin/questionnaires/preview/page.tsx` [MODIFY]
  - Action: Replace `QuestionnairePreviewRenderer` with `QuestionnaireStepper`
  - Details:
    - Import `QuestionnaireStepper` from `@/features/questionnaires/components/questionnaire-stepper`
    - Keep existing loading/empty/error state handling unchanged
    - Replace the `<QuestionnairePreviewRenderer model={...} />` call with `<QuestionnaireStepper model={buildQuestionnairePreviewModel(draft)} mode="preview" allowFreeNavigation={true} backHref="/superadmin/questionnaires" backLabel="Back to questionnaires" />`
    - Remove the outer `<section>` wrapper

#### Layer 4: Barrel Export

- [ ] Task 11: Update barrel export
  - File: `features/questionnaires/index.ts` [MODIFY]
  - Action: Add exports for new stepper components
  - Details: Add re-exports for `questionnaire-stepper`, `questionnaire-step-section`, `questionnaire-step-qualitative`, `questionnaire-step-question`

### Acceptance Criteria

#### Happy Path

- [ ] AC-1: Given a questionnaire with 3+ top-level sections, when user opens builder preview, then the stepper renders with one step per top-level section, the first step is active, and the step indicator shows section titles with "upcoming" visual state for all but the first
- [ ] AC-2: Given the stepper is on step 1, when user clicks "Next", then step 2 content renders, the step indicator updates (step 1 shows completed checkmark, step 2 shows current), and the page scrolls to top
- [ ] AC-3: Given the stepper is on step 2, when user clicks "Back", then step 1 content re-renders and the indicator updates accordingly
- [ ] AC-4: Given `allowFreeNavigation=true` (preview mode), when user clicks step 4 in the indicator, then step 4 content renders immediately (skipping 2 and 3)
- [ ] AC-5: Given a questionnaire with qualitative feedback enabled, when user navigates to the last step, then the qualitative comments section renders as its own dedicated step with a disabled `Textarea`
- [ ] AC-6: Given the user is on the final step and clicks "Finish", then an "End of preview" completion card renders with a back navigation button

#### Summary & Instructions

- [ ] AC-7: Given a questionnaire with 4 sections and 28 questions, when the stepper renders, then a summary line reads "4 sections · 28 questions" above the stepper indicator
- [ ] AC-8: Given the stepper renders, then `QuestionnaireRatingScaleInstructions` (yellow card) appears above the step indicator and remains visible on all steps

#### URL State

- [ ] AC-9: Given the stepper is on the 3rd step (0-indexed: 2), when user copies the URL, then it contains `?step=3` (1-indexed) and pasting that URL into a new tab opens the preview at the 3rd step. Existing params (`type` or `versionId`) are preserved in the URL
- [ ] AC-10: Given the user is in builder preview on step 3, when they navigate to the builder and return to preview, then the preview restores to step 3 via the URL param

#### Edge Cases

- [ ] AC-11: Given a questionnaire with exactly 1 top-level section and no qualitative feedback (total steps = 1), when the preview renders, then it renders as a single-page layout without stepper UI (no step indicator, no Back/Next buttons). But if qualitative IS enabled (total steps = 2), then the stepper renders normally
- [ ] AC-12: Given the user is on step 3 in builder preview and deletes section 3 in the builder (Zustand updates), when the preview re-renders, then `activeStep` clamps to the new last valid step without crashing
- [ ] AC-13: Given a questionnaire with 8 top-level sections viewed on a 375px mobile viewport, then the step indicator renders as a compact "Step N of 8: {title}" format instead of an overflowing horizontal bar
- [ ] AC-14: Given a section with no children and no questions in builder preview, when that step renders, then it shows "No questions added to this section yet." empty state text
- [ ] AC-15: Given the stepper is on step 3 and user clicks "Next", when step 4 has a long section with many nested children, then the viewport scrolls to the top of step 4 content

- [ ] AC-15b: Given a URL with `?step=10` but the questionnaire only has 3 steps, when the page loads, then `initialStep` clamps to the last valid step (step 3) instead of crashing

#### Accessibility

- [ ] AC-20: Given the stepper renders, then the step indicator container has `role="tablist"`, each step has `role="tab"`, the active step has `aria-current="step"`, and the step content area has `role="tabpanel"`
- [ ] AC-21: Given the user navigates to the next step, then keyboard focus moves to the step content area

#### Question Rendering

- [ ] AC-16: Given a leaf section with LIKERT_1_5 questions, when the step renders, then each question shows a 5-option radio grid (Strongly disagree → Strongly agree) with all inputs disabled in preview mode
- [ ] AC-17: Given a leaf section with YES_NO questions, when the step renders, then each question shows a 2-option radio grid (Yes / No) with all inputs disabled in preview mode

#### Integration

- [ ] AC-18: Given the version preview route with a valid `?versionId`, when the page loads, then it fetches the version via React Query, deserializes to draft, builds preview model, and renders the stepper
- [ ] AC-19: Given `bun run lint` and `npx tsc --noEmit` are run after all changes, then both pass with zero errors

## Additional Context

### Dependencies

No new npm dependencies required. All implementation uses:
- Existing shadcn primitives: `Button`, `Badge`, `Card`, `CardHeader`, `CardTitle`, `CardContent`, `RadioGroup`, `RadioGroupItem`, `Label`, `Textarea`
- Existing icon library: `lucide-react` (`Check`, `ChevronLeft`, `ChevronRight`)
- Existing questionnaire utilities: `buildQuestionnairePreviewModel`, `deserializeQuestionnaireVersionToDraft` (note: `collectLeafSections`, `sortSections`, `isLeafSection` are typed for builder nodes, NOT preview model — stepper writes its own inline `countQuestions` helper)
- Existing types: `QuestionnaireBuilderPreviewModel`, `QuestionnaireBuilderPreviewSection`, `QuestionnaireBuilderPreviewQuestion`, `QuestionnaireBuilderQualitativeConfig`
- Next.js: `useSearchParams`, `useRouter` (for URL step sync)

### Testing Strategy

**Automated checks:**
- `bun run lint` — ESLint passes on all new and modified files
- `npx tsc --noEmit` — TypeScript strict mode passes with no errors

**Manual verification matrix:**

| Scenario | Builder Preview | Version Preview |
|----------|----------------|-----------------|
| 3+ sections, stepper renders | Verify | Verify |
| Next/Back navigation | Verify | Verify |
| Free navigation (click step) | Verify | Verify |
| Qualitative as final step | Verify | Verify |
| Completion screen | Verify | Verify |
| Single-section fallback | Verify | Verify |
| URL step persistence | Verify | Verify |
| Mobile responsive indicator | Verify | Verify |
| Empty section state | Verify (builder only) | N/A |
| Step clamping on section delete | Verify (builder only) | N/A |
| 6+ section overflow | Verify | Verify |
| Stale URL `?step=10` on 3-step questionnaire | Verify | Verify |
| Accessibility: aria roles, focus management | Verify | Verify |

### Notes

**High-risk items (from pre-mortem):**
- Reactive step clamping in builder preview is the most subtle edge case — test by adding/removing sections while preview is open in a separate tab
- URL step sync must use `router.replace()` not `router.push()` to avoid polluting browser history with every step change
- URL param update must preserve existing search params (`type`, `versionId`) — use `new URLSearchParams(searchParams.toString())` pattern
- `initialStep` is consumed once by `useState` initializer in `StepperProvider` — subsequent `useSearchParams` changes do NOT re-initialize (prevents infinite loop)

**Future considerations (out of scope):**
- `response` mode with React Hook Form — the `renderQuestion` slot and `mode` prop are designed to support this without modifying stepper internals
- View mode toggle (stepper vs. full-scroll) for dean/superadmin review workflows
- Step validation gating in response mode — `StepperNavigation` can accept a `canProceed` prop in the future
- Animation/transitions between steps — CSS transitions on step content opacity/transform

**Architecture note:**
- The generic stepper in `components/shared/stepper/` has zero questionnaire knowledge and can be reused for any multi-step flow (enrollment, onboarding, etc.)
- Existing `QuestionnairePreviewRenderer` and `PreviewSection` are NOT modified — they remain available for any flat-scroll use case
