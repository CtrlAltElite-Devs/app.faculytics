# Dean Feature — API Migration Guide

This feature currently uses **hardcoded mock data** (`lib/analytics-sample-data.ts`). This guide documents how to wire it to the real backend API.

> **Note:** Types in `types/index.ts` are temporary — derived from mock data shapes. Replace them with types matching the backend DTOs once migration begins.

---

## Backend Endpoints

All endpoints require JWT and are scoped to `DEAN` or `SUPER_ADMIN` roles. Deans see only their department; superadmins see all.

### Analytics Module (`/api/v1/analytics`)

| Method | Path                   | Query Params                                                       | Response DTO                    |
| ------ | ---------------------- | ------------------------------------------------------------------ | ------------------------------- |
| GET    | `/analytics/overview`  | `semesterId` (required), `programCode?`                            | `DepartmentOverviewResponseDto` |
| GET    | `/analytics/attention` | `semesterId` (required), `programCode?`                            | `AttentionListResponseDto`      |
| GET    | `/analytics/trends`    | `semesterId?`, `minSemesters?` (default 3), `minR2?` (default 0.5) | `FacultyTrendsResponseDto`      |

### Curriculum Module (`/api/v1/curriculum`)

| Method | Path                   | Query Params                                                           | Response DTO             |
| ------ | ---------------------- | ---------------------------------------------------------------------- | ------------------------ |
| GET    | `/curriculum/programs` | `semesterId` (required), `departmentId?`, `search?`, `page?`, `limit?` | `ProgramListResponseDto` |

### Faculty Module (`/api/v1/faculty`)

| Method | Path                                   | Query Params                                                                                                           | Response DTO                 |
| ------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| GET    | `/faculty`                             | `semesterId` (required), `departmentId?`, `programId?`, `search?`, `page?` (default 1), `limit?` (default 20, max 100) | `FacultyListResponseDto`     |
| GET    | `/faculty/:facultyId/submission-count` | `semesterId` (required)                                                                                                | `SubmissionCountResponseDto` |

---

## Response Shapes (from backend DTOs)

### DepartmentOverviewResponseDto

```ts
{
  summary: {
    totalFaculty: number;
    totalSubmissions: number;
    totalAnalyzed: number;
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
  }
  faculty: Array<{
    facultyId: string;
    facultyName: string;
    departmentCode: string;
    submissionCount: number;
    commentCount: number;
    avgNormalizedScore: number; // 0–100
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
    analyzedCount: number;
    topicCount: number;
    percentileRank: number; // 0–1
    scoreDelta: number | null; // vs previous semester
    sentimentDelta: number | null;
  }>;
  lastRefreshedAt: string | null; // ISO 8601
}
```

### AttentionListResponseDto

```ts
{
  items: Array<{
    facultyId: string;
    facultyName: string;
    departmentCode: string;
    flags: Array<{
      type: "declining_trend" | "quant_qual_gap" | "low_coverage";
      description: string;
      metrics: Record<string, number>;
    }>;
  }>;
  lastRefreshedAt: string | null;
}
```

### FacultyTrendsResponseDto

```ts
{
  items: Array<{
    facultyId: string;
    facultyName: string;
    departmentCode: string;
    semesterCount: number;
    latestAvgScore: number | null;
    latestPositiveRate: number | null;
    scoreSlope: number | null;
    scoreR2: number | null;
    sentimentSlope: number | null;
    sentimentR2: number | null;
    trendDirection: "improving" | "declining" | "stable";
  }>;
  lastRefreshedAt: string | null;
}
```

### FacultyListResponseDto

```ts
{
  data: Array<{
    id: string;
    fullName: string;
    profilePicture: string | null;
    subjects: string[]; // sorted alphabetically
  }>;
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }
}
```

### ProgramListResponseDto

```ts
{
  data: Array<{
    id: string;
    code: string;
    name: string | null;
    departmentId: string;
  }>;
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }
}
```

### SubmissionCountResponseDto

```ts
{
  count: number;
}
```

---

## Migration Steps

### 1. Add endpoints to `network/endpoints.ts`

```ts
// Analytics (Dean)
analyticsOverview = "/api/v1/analytics/overview",
analyticsAttention = "/api/v1/analytics/attention",
analyticsTrends = "/api/v1/analytics/trends",

// Curriculum
curriculumPrograms = "/api/v1/curriculum/programs",

// Faculty
faculty = "/api/v1/faculty",
facultySubmissionCount = "/api/v1/faculty/:facultyId/submission-count",
```

### 2. Create `features/faculty-analytics/api/dean.requests.ts`

Request functions for each endpoint. Keep them thin — call API, return `response.data`.

### 3. Create `features/faculty-analytics/types/index.ts` (replace current temporary types)

Define proper frontend DTOs matching the backend response shapes above. Drop the mock-data types (`QuantitativeMetricScore`, `QualitativeTheme`, etc.) once they are no longer needed.

### 4. Create hooks in `features/faculty-analytics/hooks/`

| Hook                         | Wraps                               | Used by                                       |
| ---------------------------- | ----------------------------------- | --------------------------------------------- |
| `use-department-overview.ts` | `GET /analytics/overview`           | Dashboard metrics grid, charts, faculty table |
| `use-attention-list.ts`      | `GET /analytics/attention`          | (future) attention flags UI                   |
| `use-program-options.ts`     | `GET /curriculum/programs`          | Scoped dean/chairperson program filters       |
| `use-faculty-trends.ts`      | `GET /analytics/trends`             | (future) trends visualization                 |
| `use-faculty-list.ts`        | `GET /faculty`                      | Faculty table with pagination + search        |
| `use-submission-count.ts`    | `GET /faculty/:id/submission-count` | Faculty detail page                           |

### 5. Wire components to real data

Replace `deanAnalyticsSampleData` imports in each component with hook calls:

- **`dean-metrics-grid.tsx`** — Use `summary` from `useDepartmentOverview()`
- **`dean-charts.tsx`** — Sentiment data comes from the overview response (calculate from positive/negative/neutral counts)
- **`dean-dashboard-header.tsx`** — Semester selector should drive the `semesterId` query param passed to hooks
- **`dean-dashboard-header.tsx` / `dean-faculty-analytics-screen.tsx`** — Program selector should come from `GET /curriculum/programs`; analytics queries use `programCode`, faculty list uses `programId`
- **`dean-faculty-analysis-table.tsx`** — Use `faculty` array from overview, or `useFacultyList()` for paginated search

### 6. Clean up

- Delete `features/faculty-analytics/lib/analytics-sample-data.ts` once all components use real data
- Remove temporary mock types from `features/faculty-analytics/types/`
- Update `features/faculty-analytics/index.ts` barrel to export hooks and new types

---

## Key Differences: Mock vs Real

| Mock data                                         | Real API                                                         |
| ------------------------------------------------- | ---------------------------------------------------------------- |
| Faculty identified by `facultySlug` (string)      | Faculty identified by `facultyId` (UUID)                         |
| Hardcoded `subjects` array                        | `subjects` from enrollment join (course shortnames)              |
| `averageRating` (1–5 scale)                       | `avgNormalizedScore` (0–100 scale)                               |
| `overallPositiveRate` (string like "89.4%")       | Compute from `positiveCount / (positive + negative + neutral)`   |
| Qualitative themes, insights, action plans inline | Comes from analysis pipeline recommendations (separate endpoint) |
| No semester filtering                             | `semesterId` required on all analytics queries                   |
| Static feedback records                           | Real submissions from `QuestionnaireSubmission` entity           |

---

## Backend Source Files (Reference)

- Controller: `api.faculytics/src/modules/analytics/analytics.controller.ts`
- Service: `api.faculytics/src/modules/analytics/analytics.service.ts`
- DTOs: `api.faculytics/src/modules/analytics/dto/`
- Faculty controller: `api.faculytics/src/modules/faculty/faculty.controller.ts`
- Faculty DTOs: `api.faculytics/src/modules/faculty/dto/`
- Analysis pipelines: `api.faculytics/src/modules/analysis/analysis.controller.ts`
