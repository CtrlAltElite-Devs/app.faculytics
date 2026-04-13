"use client";

import { useEffect, useMemo } from "react";
import { ChevronDown, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PaginationFooter } from "@/components/shared/pagination-footer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeanAnalyticsEmptyState } from "@/features/faculty-analytics/components/dean-analytics-empty-state";
import { DeanAnalyticsErrorState } from "@/features/faculty-analytics/components/dean-analytics-error-state";
import { DeanAnalyticsLoadingState } from "@/features/faculty-analytics/components/dean-analytics-loading-state";
import { useFacultyReportComments } from "@/features/faculty-analytics/hooks/use-faculty-report-comments";
import { useFacultyReport } from "@/features/faculty-analytics/hooks/use-faculty-report";
import type { FacultyReportSectionDto } from "@/features/faculty-analytics/types";
import { formatDateTime } from "@/lib/date";
import { resolvePageSizeOption } from "@/lib/pagination";
import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import {
  resolveQuestionnaireType,
  resolveQuestionnaireTypeLabel,
} from "@/features/questionnaires/types";

type FacultyReportScreenProps = {
  facultyId: string;
};

function setSearchParams(
  pathname: string,
  currentParams: URLSearchParams,
  updates: Record<string, string | null>
) {
  const nextParams = new URLSearchParams(currentParams);

  Object.entries(updates).forEach(([key, value]) => {
    if (value && value.trim().length > 0) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
  });

  const query = nextParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function resolvePositiveNumber(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function formatScore(value: number | null) {
  if (value === null) {
    return "N/A";
  }

  return Number(value.toFixed(2)).toString();
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card px-5 py-5 shadow-sm">
      <div className="min-w-0">
        <p className="font-sans text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 font-playfair text-3xl font-semibold text-foreground">{value}</p>
        <p className="mt-4 font-sans text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function TextMetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card px-5 py-5 shadow-sm">
      <div className="min-w-0">
        <p className="font-sans text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 font-playfair text-3xl font-semibold text-foreground">{value}</p>
        <p className="mt-4 font-sans text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function ReportSectionTable({ section }: { section: FacultyReportSectionDto }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Section {section.order}
            </p>
            <h2 className="mt-1 font-playfair text-xl font-semibold text-foreground">
              {section.title}
            </h2>
          </div>
          <div className="text-left font-sans text-sm text-muted-foreground sm:text-right">
            <div>Weight: {section.weight}%</div>
            <div>Average: {formatScore(section.sectionAverage)}</div>
            <div>{section.sectionInterpretation}</div>
          </div>
        </div>
      </div>
      <div className="data-table-wrapper">
        <Table className="w-full table-fixed [&_td]:whitespace-normal [&_th]:whitespace-normal">
          <TableHeader className="data-table-header">
            <TableRow>
              <TableHead className="data-table-head w-[62%] px-3 text-xs">
                <div className="flex flex-col gap-1">
                  <span>Question</span>
                </div>
              </TableHead>
              <TableHead className="data-table-head w-[16%] px-3 text-xs text-right">
                Average
              </TableHead>
              <TableHead className="data-table-head w-[22%] px-3 text-xs">Interpretation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {section.questions.map((question) => (
              <TableRow key={question.questionId} className="data-table-row">
                <TableCell className="data-table-cell px-3 font-sans text-sm">
                  {question.text}
                </TableCell>
                <TableCell className="data-table-cell px-3 text-right font-sans text-sm">
                  {formatScore(question.average)}
                </TableCell>
                <TableCell className="data-table-cell px-3 font-sans text-sm">
                  {question.interpretation}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </article>
  );
}

export function FacultyReportScreen({ facultyId }: FacultyReportScreenProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const facultyNameParam = searchParams.get("facultyName") ?? "";
  const semesterId = searchParams.get("semesterId") ?? "";
  const semesterLabelParam = searchParams.get("semesterLabel") ?? "Selected semester";
  const questionnaireTypeCode = resolveQuestionnaireType(searchParams.get("questionnaireTypeCode"));
  const commentsPage = resolvePositiveNumber(searchParams.get("page"), 1);
  const commentsLimit = resolvePageSizeOption(searchParams.get("limit"), [5, 10, 20]);

  const questionnaireTypesQuery = useQuestionnaireTypes();
  const questionnaireTypes = useMemo(
    () => questionnaireTypesQuery.data ?? [],
    [questionnaireTypesQuery.data]
  );
  const selectedQuestionnaireType =
    questionnaireTypes.find((type) => type.code === questionnaireTypeCode) ?? null;

  const reportQuery = useFacultyReport(
    {
      facultyId,
      semesterId,
      questionnaireTypeCode,
    },
    { enabled: Boolean(semesterId) }
  );
  const commentsQuery = useFacultyReportComments(
    {
      facultyId,
      semesterId,
      questionnaireTypeCode,
      page: commentsPage,
      limit: commentsLimit,
    },
    { enabled: Boolean(semesterId) }
  );

  useEffect(() => {
    if (questionnaireTypes.length === 0) {
      return;
    }

    const hasSelectedType = questionnaireTypes.some((type) => type.code === questionnaireTypeCode);
    if (hasSelectedType) {
      return;
    }

    const fallbackType = questionnaireTypes[0];
    const nextHref = setSearchParams(pathname, new URLSearchParams(searchParamsString), {
      questionnaireTypeCode: fallbackType?.code ?? null,
      page: "1",
    });

    router.replace(nextHref, { scroll: false });
  }, [pathname, questionnaireTypeCode, questionnaireTypes, router, searchParamsString]);

  const reportTitle = reportQuery.data?.faculty.name || facultyNameParam || "Faculty report";
  const semesterLabel =
    reportQuery.data?.semester.label ||
    (semesterLabelParam.trim().length > 0 ? semesterLabelParam : "Selected semester");
  const questionnaireTypeLabel = resolveQuestionnaireTypeLabel(
    reportQuery.data?.questionnaireType.code ?? questionnaireTypeCode,
    reportQuery.data?.questionnaireType.name ?? selectedQuestionnaireType?.name
  );
  const commentsMeta = commentsQuery.data?.meta;

  const availableQuestionnaireTypes = useMemo(
    () =>
      questionnaireTypes.map((type) => ({
        code: type.code,
        label: resolveQuestionnaireTypeLabel(type.code, type.name),
      })),
    [questionnaireTypes]
  );

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const nextHref = setSearchParams(pathname, new URLSearchParams(searchParamsString), updates);
    router.replace(nextHref, { scroll: false });
  };

  const retryAll = () => {
    void questionnaireTypesQuery.refetch();
    void reportQuery.refetch();
    void commentsQuery.refetch();
  };

  if (!semesterId) {
    return (
      <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
        <div className="flex justify-end">
          <Button asChild variant="outline" className="font-sans">
            <Link href="/dean/faculties">Back to Faculties</Link>
          </Button>
        </div>
        <DeanAnalyticsErrorState
          onRetry={() => router.push("/dean/faculties")}
          message="Missing semester context. Start from the faculties list to open a faculty report."
        />
      </section>
    );
  }

  if (reportQuery.isLoading) {
    return (
      <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
              {reportTitle}
            </h1>
            <p className="mt-3 font-sans text-sm text-muted-foreground">
              Loading the faculty evaluation report for {semesterLabel}.
            </p>
          </div>
        </div>
        <DeanAnalyticsLoadingState message="Loading faculty report..." />
      </section>
    );
  }

  if (reportQuery.isError || !reportQuery.data) {
    return (
      <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
        <div className="flex justify-end">
          <Button asChild variant="outline" className="font-sans">
            <Link href="/dean/faculties">Back to Faculties</Link>
          </Button>
        </div>
        <DeanAnalyticsErrorState
          onRetry={retryAll}
          message="Unable to load the faculty evaluation report."
        />
      </section>
    );
  }

  return (
    <section className="max-w-full space-y-6 overflow-x-hidden px-1 pb-4 md:p-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h1 className="font-playfair text-2xl font-semibold tracking-tight sm:text-3xl">
            {reportQuery.data.faculty.name}
          </h1>
          <p className="mt-4 max-w-3xl font-sans text-sm text-muted-foreground">
            Review per-question faculty evaluation results for {semesterLabel}.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 font-sans text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-3 py-1">{semesterLabel}</span>
            <span className="rounded-full bg-muted px-3 py-1">{questionnaireTypeLabel}</span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end xl:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full min-w-0 justify-between px-4 py-2.5 font-sans text-sm sm:w-64"
                disabled={
                  questionnaireTypesQuery.isLoading || availableQuestionnaireTypes.length === 0
                }
              >
                <span className="truncate">{questionnaireTypeLabel}</span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0"
            >
              <DropdownMenuRadioGroup
                value={questionnaireTypeCode}
                onValueChange={(value) => {
                  updateSearchParams({
                    questionnaireTypeCode: value,
                    page: "1",
                  });
                }}
              >
                {availableQuestionnaireTypes.map((type) => (
                  <DropdownMenuRadioItem
                    key={type.code}
                    value={type.code}
                    className="font-sans text-sm"
                  >
                    {type.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="outline"
            className="w-full px-4 py-2.5 font-sans text-sm sm:w-auto"
            onClick={retryAll}
            disabled={reportQuery.isFetching || commentsQuery.isFetching}
          >
            <RefreshCw
              className={`mr-2 size-4 ${
                reportQuery.isFetching || commentsQuery.isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full px-4 py-2.5 font-sans text-sm sm:w-auto"
          >
            <Link href="/dean/faculties">Back to Faculties</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Submissions"
          value={String(reportQuery.data.submissionCount)}
          description="Submitted evaluation responses included in this report context"
        />
        <MetricCard
          label="Overall Rating"
          value={formatScore(reportQuery.data.overallRating)}
          description="Weighted average score across all sections in this report"
        />
        <MetricCard
          label="Comments"
          value={String(commentsMeta?.totalItems ?? commentsQuery.data?.items.length ?? 0)}
          description="Qualitative comments submitted for this faculty report"
        />
        <TextMetricCard
          label="Overall Interpretation"
          value={reportQuery.data.overallInterpretation ?? "No interpretation available"}
          description="Performance label derived from the overall weighted rating"
        />
      </div>

      {reportQuery.data.sections.length === 0 ? (
        <DeanAnalyticsEmptyState description="No report sections are available for the selected faculty, semester, and questionnaire type." />
      ) : (
        <div className="space-y-4">
          {reportQuery.data.sections.map((section) => (
            <ReportSectionTable key={section.sectionId} section={section} />
          ))}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="border-b border-border/70 px-5 py-4">
          <h2 className="font-playfair text-xl font-semibold text-foreground">
            Qualitative Comments
          </h2>
          <p className="mt-1 font-sans text-sm text-muted-foreground">
            Student comments for the selected faculty report context.
          </p>
        </div>

        {commentsQuery.isLoading ? (
          <div className="px-5 py-8">
            <DeanAnalyticsLoadingState message="Loading qualitative comments..." />
          </div>
        ) : null}

        {!commentsQuery.isLoading && commentsQuery.isError ? (
          <div className="px-5 py-8">
            <DeanAnalyticsErrorState
              onRetry={() => void commentsQuery.refetch()}
              message="Unable to load qualitative comments."
            />
          </div>
        ) : null}

        {!commentsQuery.isLoading &&
        !commentsQuery.isError &&
        (commentsQuery.data?.items.length ?? 0) === 0 ? (
          <div className="px-5 py-8">
            <DeanAnalyticsEmptyState description="No qualitative comments were submitted for this report context." />
          </div>
        ) : null}

        {!commentsQuery.isLoading &&
        !commentsQuery.isError &&
        (commentsQuery.data?.items.length ?? 0) > 0 ? (
          <div className="space-y-4 px-5 py-5">
            {commentsQuery.data?.items.map((comment, index) => (
              <article
                key={`${comment.submittedAt}-${index}`}
                className="rounded-2xl border border-border/70 bg-background/60 px-4 py-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <p className="max-w-3xl font-sans text-sm leading-6 text-foreground">
                    {comment.text}
                  </p>
                  <p className="shrink-0 font-sans text-xs text-muted-foreground sm:text-right">
                    Submitted {formatDateTime(comment.submittedAt)}
                  </p>
                </div>
              </article>
            ))}

            <PaginationFooter
              itemCount={commentsQuery.data?.meta.itemCount ?? 0}
              totalItems={commentsQuery.data?.meta.totalItems ?? 0}
              currentPage={commentsQuery.data?.meta.currentPage ?? commentsPage}
              totalPages={commentsQuery.data?.meta.totalPages ?? 1}
              itemLabel="comments"
              rowsPerPage={commentsLimit}
              onRowsPerPageChange={(value) => {
                updateSearchParams({
                  page: "1",
                  limit: String(value),
                });
              }}
              onPageChange={(page) => {
                updateSearchParams({
                  page: String(page),
                  limit: String(commentsLimit),
                });
              }}
            />
          </div>
        ) : null}
      </section>
    </section>
  );
}
