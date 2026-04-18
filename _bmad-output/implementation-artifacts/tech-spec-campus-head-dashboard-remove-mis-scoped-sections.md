---
title: 'Campus Head Dashboard Remove Mis-Scoped Sections'
slug: 'campus-head-dashboard-remove-mis-scoped-sections'
created: '2026-04-18T00:00:00+08:00'
status: 'Implementation Complete'
stepsCompleted: [1, 2, 3, 4]
tech_stack:
  - 'Next.js App Router'
  - 'React 19 client components'
  - 'TypeScript strict mode'
  - 'Tailwind CSS'
  - 'TanStack Query'
files_to_modify:
  - 'features/faculty-analytics/components/scoped-analytics-dashboard-screen.tsx'
  - 'features/faculty-analytics/components/scoped-attention-card.tsx'
  - 'features/faculty-analytics/components/recommendations-card.tsx'
code_patterns:
  - 'Role-specific dashboard routes reuse the shared ScopedAnalyticsDashboardScreen with a scopeLabel prop'
  - 'Role-specific visibility is handled inside shared feature components rather than duplicating route pages'
  - 'Dashboard sections are composed conditionally from hook-driven query state inside feature-owned screen components'
  - 'Feature UI remains in features/faculty-analytics and pages stay thin'
test_patterns:
  - 'No dedicated automated test framework is configured'
  - 'Validation gate is bun run lint and bun run typecheck'
  - 'Manual role-based UI verification is required for campus head, dean, and chairperson dashboards'
---

# Tech-Spec: Campus Head Dashboard Remove Mis-Scoped Sections

**Created:** 2026-04-18T00:00:00+08:00

## Overview

### Problem Statement

The campus head dashboard now supports department-level filtering, but it still renders sections that imply dean-level or operational ownership: `Faculty Requiring Attention`, `Suggested Actions`, and the `Analytics Pipeline` trigger. This creates role confusion because campus head is positioned as an oversight user, not the actor who manages faculty-level interventions or analytics operations.

### Solution

Restrict the campus head dashboard to summary-oriented content by removing those three sections only from the `Campus` scope within the shared scoped dashboard screen. Keep the rest of the dashboard intact, preserve existing dean and chairperson behavior, and adjust any campus-head-only empty-state copy so it no longer instructs the user to trigger analysis manually.

### Scope

**In Scope:**
- remove the `PipelineTriggerCard` from the campus head dashboard
- remove the `Faculty Requiring Attention` panel from the campus head dashboard
- remove the `Suggested Actions` panel from the campus head dashboard
- keep existing campus head dashboard metrics, filters, charts, and themes behavior otherwise unchanged
- update campus-head-specific empty-state copy if it currently references running analysis or waiting for suggested actions
- preserve dean and chairperson dashboard behavior

**Out of Scope:**
- adding replacement sections such as `Department Health Overview` or `Departments Needing Review`
- changing backend permissions or API contracts
- changing dean or chairperson dashboard scope/content
- removing top themes or other existing non-targeted dashboard sections
- redesigning the campus head dashboard layout beyond what is necessary after removing the sections

## Context for Development

### Codebase Patterns

- The route entry points are thin and role-specific pages pass a `scopeLabel` into the shared `ScopedAnalyticsDashboardScreen`; campus head uses `scopeLabel="Campus"` at [page.tsx](/home/aya/Codes/THESIS/app.faculytics/app/(dashboard)/campus-head/dashboard/page.tsx:1).
- Shared dashboard composition lives in feature-owned components, consistent with `docs/ARCHITECTURE.md`; the campus head change should stay inside `features/faculty-analytics/components/*`.
- `ScopedAnalyticsDashboardScreen` already branches on `scopeLabel` for campus-specific behavior such as the pipeline trigger, so it is the correct place to add or tighten visibility rules.
- `ScopedAttentionCard` and `RecommendationsCard` are reusable across scope variants; if edited, changes must preserve dean/program labels and content.
- Pipeline queries currently serve two different concerns in the shared screen: showing the campus trigger and gating qualitative themes/recommendations. Removing the trigger must not accidentally suppress existing theme rendering if pipeline results already exist.
- The current empty insights placeholder is two-column and includes a `Suggested Actions` card plus copy telling the user to run analysis; that is inconsistent once the campus trigger is removed.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| [app/(dashboard)/campus-head/dashboard/page.tsx](/home/aya/Codes/THESIS/app.faculytics/app/(dashboard)/campus-head/dashboard/page.tsx:1) | Confirms campus head uses the shared scoped dashboard with `scopeLabel="Campus"` |
| [app/(dashboard)/dean/dashboard/page.tsx](/home/aya/Codes/THESIS/app.faculytics/app/(dashboard)/dean/dashboard/page.tsx:1) | Confirms dean uses the same shared screen with `scopeLabel="Department"` |
| [app/(dashboard)/chairperson/dashboard/page.tsx](/home/aya/Codes/THESIS/app.faculytics/app/(dashboard)/chairperson/dashboard/page.tsx:1) | Confirms chairperson uses the same shared screen with `scopeLabel="Program"` |
| [features/faculty-analytics/components/scoped-analytics-dashboard-screen.tsx](/home/aya/Codes/THESIS/app.faculytics/features/faculty-analytics/components/scoped-analytics-dashboard-screen.tsx:1) | Primary composition file for campus/dean/chairperson analytics dashboard sections |
| [features/faculty-analytics/components/scoped-attention-card.tsx](/home/aya/Codes/THESIS/app.faculytics/features/faculty-analytics/components/scoped-attention-card.tsx:1) | Faculty attention panel with scope-specific copy |
| [features/faculty-analytics/components/recommendations-card.tsx](/home/aya/Codes/THESIS/app.faculytics/features/faculty-analytics/components/recommendations-card.tsx:1) | Suggested actions panel rendered when recommendations are available |
| [features/faculty-analytics/hooks/use-scoped-analytics-dashboard-view-model.ts](/home/aya/Codes/THESIS/app.faculytics/features/faculty-analytics/hooks/use-scoped-analytics-dashboard-view-model.ts:1) | Confirms campus head department filtering and attention data are prepared in the shared view model |
| [docs/ARCHITECTURE.md](/home/aya/Codes/THESIS/app.faculytics/docs/ARCHITECTURE.md:1) | Governing rule for keeping this work inside the feature slice rather than in route pages |

### Technical Decisions

- The change is campus-head-only and should be keyed off `scopeLabel === "Campus"`.
- The campus head route stays on the shared screen component; do not fork a separate campus-specific page implementation for this removal-only change.
- `PipelineTriggerCard` should stop rendering for campus head, but pipeline-backed themes may still render if data already exists from backend or prior runs.
- `ScopedAttentionCard` should not render for campus head. Dean and chairperson should keep current behavior.
- `RecommendationsCard` should not render for campus head even if recommendations data exists. The underlying data fetching may remain for now unless a small cleanup is obvious and safe.
- The campus-head empty insights state must not mention `Suggested Actions` or instruct the user to run analysis, since the trigger is being removed and no replacement action UI is being added.
- Avoid broad refactors. This is a visibility and copy-adjustment change, not a dashboard redesign.

## Implementation Plan

### Tasks

- [x] Task 1: Remove the campus-head analytics trigger card from the shared dashboard composition
  - File: `features/faculty-analytics/components/scoped-analytics-dashboard-screen.tsx`
  - Action: Stop rendering `PipelineTriggerCard` when `scopeLabel === "Campus"`.
  - Notes: Preserve existing dean/program behavior and avoid breaking any remaining pipeline-status-driven theme display logic.

- [x] Task 2: Remove the campus-head attention panel from the shared dashboard layout
  - File: `features/faculty-analytics/components/scoped-analytics-dashboard-screen.tsx`
  - Action: Prevent `ScopedAttentionCard` from rendering for `Campus` scope while keeping the sentiment chart and surrounding layout coherent.
  - Notes: If the two-column layout becomes awkward after the card is removed, collapse or rebalance only as much as needed to keep the existing chart presentation clean.

- [x] Task 3: Remove campus-head suggested actions while preserving top themes
  - File: `features/faculty-analytics/components/scoped-analytics-dashboard-screen.tsx`
  - Action: Prevent `RecommendationsCard` from rendering for `Campus` scope, but keep `ThemesRankedList` behavior intact for available qualitative insights.
  - Notes: Ensure the layout does not reserve an empty second column for campus head when only themes remain.

- [x] Task 4: Update campus-head empty-state copy to match the removal-only decision
  - File: `features/faculty-analytics/components/scoped-analytics-dashboard-screen.tsx`
  - Action: Adjust `EmptyInsightsPlaceholder` so the campus-head variant no longer includes a `Suggested Actions` placeholder or copy telling the user to run analysis.
  - Notes: The placeholder can remain richer for non-campus scopes if needed; campus copy should be passive and summary-oriented.

- [x] Task 5: Verify shared component copy and surface area remain correct for dean and chairperson
  - Files:
    - `features/faculty-analytics/components/scoped-attention-card.tsx`
    - `features/faculty-analytics/components/recommendations-card.tsx`
  - Action: Make only minimal edits if needed to support campus-only suppression cleanly, otherwise leave these reusable components unchanged.
  - Notes: Do not rewrite labels or semantics for department/program scopes as part of this spec.

### Acceptance Criteria

- [ ] AC 1: Given an authenticated campus head user on `/campus-head/dashboard`, when the dashboard renders, then the `Analytics Pipeline` trigger card is not shown.
- [ ] AC 2: Given an authenticated campus head user on `/campus-head/dashboard`, when the dashboard renders, then the `Faculty Requiring Attention` section is not shown.
- [ ] AC 3: Given an authenticated campus head user on `/campus-head/dashboard`, when the dashboard renders, then the `Suggested Actions` section is not shown.
- [ ] AC 4: Given an authenticated campus head user on `/campus-head/dashboard`, when qualitative theme data exists, then `Top Themes` can still render without a companion `Suggested Actions` panel.
- [ ] AC 5: Given an authenticated campus head user on `/campus-head/dashboard`, when no qualitative insights are available yet, then the empty state does not instruct the user to run analysis and does not show a `Suggested Actions` placeholder.
- [ ] AC 6: Given an authenticated dean user on `/dean/dashboard`, when the dashboard renders, then existing attention and suggested-actions sections continue to behave as before.
- [ ] AC 7: Given an authenticated chairperson user on `/chairperson/dashboard`, when the dashboard renders, then existing shared dashboard sections continue to behave as before.
- [ ] AC 8: Given an authenticated campus head user changes the department filter, when the dashboard rerenders, then the removed sections remain hidden and the remaining campus dashboard content continues to update normally.
- [ ] AC 9: Given this change is implemented, when `bun run lint` and `bun run typecheck` are run, then the touched files pass the project’s minimum quality gate without introducing new errors.

## Additional Context

### Dependencies

- Existing scoped analytics dashboard composition in `features/faculty-analytics`
- Existing `scopeLabel` role differentiation across campus, dean, and chairperson dashboards
- Existing pipeline/recommendation queries, which may still feed top themes even after action-oriented campus widgets are removed
- No backend changes are required for this spec

### Testing Strategy

- Run `bun run lint`
- Run `bun run typecheck`
- Manual verification:
  - log in as a campus head user and confirm `/campus-head/dashboard` no longer shows `Faculty Requiring Attention`
  - confirm the campus head dashboard no longer shows `Suggested Actions`
  - confirm the campus head dashboard no longer shows the pipeline trigger card
  - confirm campus head still sees the remaining dashboard metrics and charts
  - confirm the department filter still updates the remaining campus dashboard content
  - confirm any campus empty-state copy no longer tells the user to run analysis
  - log in as a dean user and confirm attention and suggested-actions panels still render
  - log in as a chairperson user and confirm shared dashboard behavior is unchanged

### Notes

- This spec intentionally avoids introducing replacement sections. Empty space reduction or simple layout rebalancing is allowed only where required to avoid visually broken composition.
- Risk: removing the pipeline trigger while retaining theme queries can expose copy or gating assumptions that previously depended on the trigger being visible. Review placeholder and loading states carefully.
- Risk: because the same screen is shared by three roles, broad conditional edits can unintentionally regress dean or chairperson dashboards. Keep role checks narrow and explicit.
- If implementation reveals that `RecommendationsCard` or `ScopedAttentionCard` can remain untouched by handling all visibility in the parent screen, prefer that smaller change.
