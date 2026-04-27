---
title: 'Render Faculty Rankings in Overview Dashboards'
slug: 'render-faculty-rankings-in-overview-dashboards'
created: '2026-04-27T11:06:25+08:00'
status: 'Completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['Next.js App Router', 'React 19', 'TypeScript strict mode', 'React Query', 'Tailwind CSS 4', 'shadcn UI primitives']
files_to_modify: ['features/faculty-analytics/lib/scoped-analytics-view-model.ts', 'features/faculty-analytics/hooks/use-scoped-analytics-dashboard-view-model.ts', 'features/faculty-analytics/components/scoped-dashboard-section-types.ts', 'features/faculty-analytics/components/scoped-analytics-dashboard-screen.tsx', 'features/faculty-analytics/components/department-dashboard-sections.tsx', 'features/faculty-analytics/components/program-dashboard-sections.tsx', 'features/faculty-analytics/components/campus-dashboard-sections.tsx', 'features/faculty-analytics/components/scoped-faculty-rankings-table.tsx']
code_patterns: ['Feature-owned analytics components live under features/faculty-analytics/components', 'Authenticated API data flows through React Query hooks and typed DTOs', 'Dashboard sections receive narrow view-model props instead of raw API responses', 'Dense lists use shadcn Table plus global data-table-* classes', 'Internal imports use @/* aliases']
test_patterns: ['No dedicated test framework or matching test files found', 'Validate with bun run lint and bun run typecheck', 'Manual dashboard verification for Department, Program, Campus, empty states, sorting, and responsive overflow']
---

# Tech-Spec: Render Faculty Rankings in Overview Dashboards

**Created:** 2026-04-27T11:06:25+08:00

## Overview

### Problem Statement

The Department Overview, Program Overview, and Campus Overview dashboards receive a `faculty` array from the analytics overview response, but the current UI only renders summary metrics and sentiment charts. Faculty ranking data such as `facultyName`, `departmentCode`, `avgNormalizedScore`, `percentileRank`, submissions, analyzed count, sentiment counts, topic count, and deltas is not visible on any overview dashboard.

### Solution

Add a reusable faculty rankings presentation component under `features/faculty-analytics/components/`, pass the overview `faculty` list through the scoped dashboard view model and section props, and render the full list in Department, Program, and Campus overview sections. The UI will locally sort rows by `percentileRank` and then `avgNormalizedScore`, without adding faculty detail links or redirects in this change.

### Scope

**In Scope:**
- Render the full `faculty[]` ranking list on Department Overview, Program Overview, and Campus Overview.
- Sort ranking rows in the UI by `percentileRank` first and `avgNormalizedScore` second, with `facultyName` as a deterministic tie-breaker.
- Display ranking-relevant fields from the existing response: faculty name, department code, average normalized score, percentile/rank, submission/comment/analyzed counts, sentiment counts or rate, topic count, and score/sentiment deltas where useful.
- Preserve existing semester, program, and campus department filtering behavior from `useScopedAnalyticsDashboardViewModel`.
- Reuse existing feature structure, shadcn UI primitives, and loading/error/empty-state conventions.
- Render ranking rows in a scan-friendly table layout with responsive overflow or a compact responsive treatment for smaller screens.
- Treat the displayed row rank as local UI order only; it is not a persisted or backend-canonical rank.

**Out of Scope:**
- Backend/API endpoint changes.
- New ranking algorithm or backend sorting contract changes.
- Faculty row navigation or redirects to detail/analysis pages.
- Pagination unless deeper investigation shows the response size creates an immediate UI risk.

## Context for Development

### Codebase Patterns

- Overview dashboards are composed by `ScopedAnalyticsDashboardScreen`, which selects `DepartmentDashboardSections`, `ProgramDashboardSections`, or `CampusDashboardSections` by `scopeLabel`.
- Analytics overview data is fetched in `useScopedAnalyticsDashboardViewModel` through `useDepartmentOverview`.
- The overview response type already includes `DepartmentOverviewFacultyDto[]` as `DepartmentOverviewResponseDto["faculty"]`.
- Campus overview currently filters `overview.faculty` by selected department code and recomputes summary totals from the filtered faculty list.
- Shared dashboard section props currently expose summary, sentiment, attention, and filter metadata, but not the faculty ranking rows.
- Existing table-based feature UI should be preferred for dense faculty comparison because the full list contains multiple sortable/comparable metrics.
- Existing dense tables use `components/ui/table` with `.data-table-wrapper`, `.data-table-header`, `.data-table-head`, `.data-table-row`, and `.data-table-cell` classes from `app/globals.css`.
- `components/ui/table.tsx` already wraps tables in `overflow-x-auto`; the ranking table should keep column widths stable and avoid clickable row affordances.
- Overview API access is already typed through `fetchDepartmentOverview`, `useDepartmentOverview`, and `DepartmentOverviewResponseDto`; no request-layer changes are needed.
- The view model currently maps only `summary` and `overallSentiment`; the faculty ranking rows should be prepared either in the same view model or a small feature lib helper imported by that hook/component.
- React Query data should be treated as immutable. Any ranking sort must clone `overview.faculty` before sorting so the cached response array is not mutated.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `features/faculty-analytics/hooks/use-scoped-analytics-dashboard-view-model.ts` | Source of scoped overview data, filtering, and dashboard return values. |
| `features/faculty-analytics/types/index.ts` | Existing DTO definitions for `DepartmentOverviewFacultyDto` and overview response shape. |
| `features/faculty-analytics/components/scoped-dashboard-section-types.ts` | Shared prop contracts for overview dashboard sections. |
| `features/faculty-analytics/components/scoped-analytics-dashboard-screen.tsx` | Composes the three overview dashboard variants and common props. |
| `features/faculty-analytics/components/department-dashboard-sections.tsx` | Department overview layout. |
| `features/faculty-analytics/components/program-dashboard-sections.tsx` | Program overview layout. |
| `features/faculty-analytics/components/campus-dashboard-sections.tsx` | Campus overview layout. |
| `features/faculty-analytics/components/scoped-faculty-analysis-table.tsx` | Existing faculty table pattern using shadcn table primitives and data-table classes. |
| `components/ui/table.tsx` | Shared table primitive with horizontal overflow wrapper. |
| `app/globals.css` | Defines `data-table-*` table styling utilities used across feature tables. |
| `features/faculty-analytics/lib/scoped-analytics-view-model.ts` | Existing scoped dashboard view-model mapping and percentage formatting style. |
| `features/faculty-analytics/api/faculty-analytics.requests.ts` | Confirms overview response is already typed and returned as `DepartmentOverviewResponseDto`. |
| `features/faculty-analytics/hooks/use-department-overview.ts` | React Query hook for the overview endpoint. |

### Technical Decisions

- Render a full faculty rankings list, not only top/bottom subsets.
- Do not add links, row click handlers, or redirects for faculty rows in this pass.
- Do not style ranking rows as clickable while navigation remains out of scope.
- Perform UI sorting locally by `percentileRank` descending, then `avgNormalizedScore` descending, then `facultyName` ascending.
- Display the backend-provided `percentileRank` as a percentage, even when campus department filtering narrows the visible rows; the percentile value may have been computed against a broader backend scope.
- Keep ranking UI in `features/faculty-analytics/components/` because it is reusable across the three scoped overview dashboards.
- Pass a narrow `facultyRankings` value through dashboard section props instead of passing the raw `overview` object into section components.
- Use a shadcn-style table for the full faculty ranking list. Cards are out of scope for the primary layout because they make cross-faculty metric comparison harder as the list grows.
- Prefer a small row view-model type for rankings rather than passing raw DTOs through component props.
- Keep mapper and table responsibilities separate: the mapper returns raw normalized numeric/string fields for sorting and rendering, while the table component owns display formatting.
- Keep the table non-interactive: no `<Link>`, no row click handler, no action column, and no added interactive row affordances.
- Preserve campus filtering at the existing `filteredOverview` layer; rankings should consume the already-filtered `overview.faculty` data so summary and rows stay aligned.
- Avoid adding pagination in this change unless implementation reveals severe rendering issues; the current requested behavior is the full list.
- Use a plain presentational component for the rankings table; add `"use client"` only if the implementation introduces hooks, browser APIs, or client-only behavior.

## Implementation Plan

### Tasks

- [x] Task 1: Add a ranking row view-model and mapper.
  - File: `features/faculty-analytics/lib/scoped-analytics-view-model.ts`
  - Action: Export a `ScopedFacultyRankingRow` type and a mapper such as `mapDepartmentOverviewFacultyToRankingRows(faculty)`.
  - Notes: The mapper must clone the input array before sorting. Sort by `percentileRank` descending, then `avgNormalizedScore` descending, then `facultyName` ascending. Return raw normalized fields for local display rank number, faculty id, faculty name, department code, average score, percentile rank, submission count, comment count, analyzed count, positive/neutral/negative counts, positive sentiment rate, topic count, score delta, and sentiment delta. Do not return preformatted display strings except the numeric local display rank if desired. The local display rank is the row position after UI sorting, not a backend-canonical rank.

- [x] Task 2: Expose sorted ranking rows from the scoped dashboard view model.
  - File: `features/faculty-analytics/hooks/use-scoped-analytics-dashboard-view-model.ts`
  - Action: Build `facultyRankings` from `filteredOverview?.faculty ?? []` and include it in the hook return object.
  - Notes: Add the ranking mapper to the existing import from `@/features/faculty-analytics/lib/scoped-analytics-view-model`. Use `useMemo` so the clone/sort mapping only reruns when `filteredOverview?.faculty` changes. Use the already-filtered `filteredOverview` so campus department filtering and program filtering remain aligned with summary totals.

- [x] Task 3: Add faculty rankings to shared dashboard section props.
  - File: `features/faculty-analytics/components/scoped-dashboard-section-types.ts`
  - Action: Add `facultyRankings: ReturnType<typeof useScopedAnalyticsDashboardViewModel>["facultyRankings"]` to `DashboardCommonSectionProps`.
  - Notes: Keep this as a narrow prop; do not pass the raw `overview` object into section components.

- [x] Task 4: Pass rankings through the dashboard screen composition.
  - File: `features/faculty-analytics/components/scoped-analytics-dashboard-screen.tsx`
  - Action: Destructure `facultyRankings` from `useScopedAnalyticsDashboardViewModel(scopeLabel)` and add it to `commonSectionProps`.
  - Notes: Campus currently passes only `summary` and `overallSentiment`; update `CampusDashboardSections` props so it can receive and render the rankings while preserving its lean layout.

- [x] Task 5: Create the reusable shadcn ranking table component.
  - File: `features/faculty-analytics/components/scoped-faculty-rankings-table.tsx`
  - Action: Create a presentational component that accepts `facultyRankings`, renders a `Card` with fixed title `Faculty Rankings` and description `Sorted by percentile and normalized score for the selected filters.`, and uses `components/ui/table` plus `data-table-*` classes for the full rankings table.
  - Notes: Suggested columns are `Rank`, `Faculty`, `Dept`, `Score`, `Pct`, `Subs`, `Analyzed`, `Sentiment`, `Topics`, `Score +/-`, and `Sent +/-`. Keep rows non-interactive: no links, no action column, no click handlers. Use horizontal overflow for small screens, compact headers, stable minimum column widths, `min-w-[900px]` or an equivalent stable table width, and tabular numeric styling for numeric columns. The component should omit `"use client"` if it only renders props.

- [x] Task 6: Implement table formatting and empty state.
  - File: `features/faculty-analytics/components/scoped-faculty-rankings-table.tsx`
  - Action: Format scores to 2 decimals, percentile as 0-100%, deltas with signed values, and unavailable deltas as an em dash or ASCII fallback consistent with existing files. Render an empty dashed-state inside the card when `facultyRankings.length === 0`.
  - Notes: Positive sentiment rate should be derived from positive/neutral/negative counts and shown compactly, for example `68.5% positive` plus counts if space allows. Format `scoreDelta` as signed score points to 2 decimals. Treat `sentimentDelta` as a 0-1 fractional rate under the current sample contract and display it as signed percentage points. Avoid `any`; use the exported `ScopedFacultyRankingRow` type.

- [x] Task 7: Render rankings in all overview section layouts.
  - Files: `features/faculty-analytics/components/department-dashboard-sections.tsx`, `features/faculty-analytics/components/program-dashboard-sections.tsx`, `features/faculty-analytics/components/campus-dashboard-sections.tsx`
  - Action: Import `ScopedFacultyRankingsTable` and render it after the existing metrics/sentiment/attention/recommendation sections.
  - Notes: Department and Program can pass through `facultyRankings` from `DashboardCommonSectionProps`. Campus should update its prop type to `Pick<DashboardCommonSectionProps, "summary" | "overallSentiment" | "facultyRankings">`, then render the table below the sentiment chart. In all three section components, render the rankings table as a full-width section after existing grids, not inside a narrow two-column grid.

- [x] Task 8: Validate the implementation.
  - Files: no source changes expected.
  - Action: Run `bun run typecheck` and `bun run lint`.
  - Notes: If lint/typecheck fails due to unrelated pre-existing issues, document the exact blocker and still verify the touched files manually.

### Acceptance Criteria

- [ ] AC 1: Given a Department Overview response with `faculty[]`, when the Department dashboard loads, then a faculty rankings table renders the full response list after local sorting.
- [ ] AC 2: Given a Program Overview response with `faculty[]`, when the Program dashboard loads, then a faculty rankings table renders the full response list without row links, click handlers, or an action column.
- [ ] AC 3: Given a Campus Overview response with multiple department codes, when the selected campus department changes, then the ranking table only shows rows whose `departmentCode` matches the selected department and remains consistent with the recomputed summary totals.
- [ ] AC 4: Given faculty rows with different `percentileRank` values, when the ranking table renders, then rows are ordered by `percentileRank` descending.
- [ ] AC 5: Given faculty rows tied on `percentileRank`, when the ranking table renders, then tied rows are ordered by `avgNormalizedScore` descending.
- [ ] AC 6: Given faculty rows tied on both `percentileRank` and `avgNormalizedScore`, when the ranking table renders, then tied rows are ordered by `facultyName` ascending.
- [ ] AC 7: Given the mapper receives `overview.faculty`, when it sorts rankings, then it clones the array before sorting and does not mutate the React Query response data.
- [ ] AC 8: Given a rendered ranking row, when the user reads the `Rank` column, then it represents local sorted display order and not a backend-canonical rank.
- [ ] AC 9: Given a faculty row with null `scoreDelta` and `sentimentDelta`, when the ranking table renders, then those delta cells show a non-crashing unavailable placeholder.
- [ ] AC 10: Given an overview response with an empty `faculty[]`, when any overview dashboard loads, then the rankings card shows a clear empty state instead of a blank table.
- [ ] AC 11: Given an overview response with summary and sentiment data but empty `faculty[]`, when any overview dashboard loads, then the existing summary and sentiment sections still render while the rankings card shows its empty state.
- [ ] AC 12: Given a small viewport, when the rankings table renders, then the table remains readable through horizontal overflow or compact responsive treatment and visible text does not overlap.
- [ ] AC 13: Given the dashboard is loading or errors at the overview query level, when the dashboard renders, then existing `ScopedAnalyticsAsyncContent` loading/error behavior remains unchanged.

## Additional Context

### Dependencies

- No new npm/bun dependencies are required.
- Depends on the existing `/analytics/overview` response shape already represented by `DepartmentOverviewResponseDto`.
- Depends on existing `components/ui/table`, `components/ui/card`, and global `data-table-*` classes.
- Does not require backend, endpoint, route, auth, or request-layer changes.

### Testing Strategy

- Run `bun run typecheck`.
- Run `bun run lint`.
- Manual verification:
  - Department Overview renders full faculty ranking rows for the selected semester/program filter.
  - Program Overview renders full faculty ranking rows for the selected semester/program context.
  - Campus Overview renders full faculty ranking rows for the selected semester and selected department filter.
  - Ranking order is `percentileRank` descending, then `avgNormalizedScore` descending, then `facultyName` ascending.
  - Code review confirms the mapper clones before sorting and does not mutate the original overview faculty array.
  - Empty `faculty[]` displays an empty state instead of a blank table.
  - Summary and sentiment sections still render when `faculty[]` is empty but summary data exists.
  - Small viewport keeps the ranking table readable with horizontal overflow and no overlapping text.
  - Dashboard header and last updated label behavior remains unchanged.

### Notes

- `percentileRank` in the sample response is a 0-1 value; display it as a 0-100 percentage while sorting by the raw numeric value.
- `percentileRank` should be treated as backend-provided context, not recalculated after local filtering.
- `avgNormalizedScore` appears to be a normalized 0-100 score; display to 2 decimals unless an existing formatter is adopted.
- `scoreDelta` appears to be score-point scale. Under the current sample contract, `sentimentDelta` is treated as fractional sentiment-rate scale and displayed as signed percentage points.
- The sample response can include faculty from multiple departments. Campus filtering already narrows `filteredOverview.faculty`; do not duplicate filtering inside the table component unless required for presentation.
- The table should not introduce pagination in this change because the requested behavior is to render the full list.
- Future enhancement: add row navigation to faculty analysis pages once the product decision is made; keep this explicitly out of the current implementation.

## Review Notes

- Adversarial review completed.
- Findings: 4 total, 4 fixed, 0 skipped.
- Resolution approach: auto-fix.
