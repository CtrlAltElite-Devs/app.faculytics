"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { QuestionnaireAsyncContent } from "@/features/questionnaires/components/questionnaire-async-content";
import { QuestionnaireListToolbar } from "@/features/questionnaires/components/questionnaire-list-toolbar";
import { QuestionnaireTable } from "@/features/questionnaires/components/questionnaire-table";
import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import { useQuestionnaireVersions } from "@/features/questionnaires/hooks/use-questionnaire-versions";

import {
  DEFAULT_QUESTIONNAIRE_TYPE,
  QUESTIONNAIRE_TYPES,
  type QuestionnaireVersionItem,
  type QuestionnaireStatusFilter as StatusFilter,
  type QuestionnaireType,
} from "@/features/questionnaires/types";

function resolveSelectedType(value: string | null): QuestionnaireType {
  if (value && QUESTIONNAIRE_TYPES.includes(value as QuestionnaireType)) {
    return value as QuestionnaireType;
  }

  return DEFAULT_QUESTIONNAIRE_TYPE;
}

export default function SuperAdminQuestionnairesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const deferredSearchValue = useDeferredValue(searchValue);
  const selectedType = resolveSelectedType(searchParams.get("type"));

  const questionnaireTypesQuery = useQuestionnaireTypes();
  const typeSummaries = questionnaireTypesQuery.data ?? [];
  const fetchedTypes = typeSummaries.map((summary) => summary.type);
  const availableTypes =
    fetchedTypes.length > 0
      ? QUESTIONNAIRE_TYPES.filter((type) => fetchedTypes.includes(type))
      : [...QUESTIONNAIRE_TYPES];
  const activeType = availableTypes.includes(selectedType)
    ? selectedType
    : (availableTypes[0] ?? DEFAULT_QUESTIONNAIRE_TYPE);
  const questionnaireVersionsQuery = useQuestionnaireVersions(activeType, {
    enabled: questionnaireTypesQuery.isSuccess,
  });

  useEffect(() => {
    const builderStatus = searchParams.get("builder");

    if (!builderStatus) {
      return;
    }

    if (builderStatus === "saved") {
      toast.success("Questionnaire draft saved successfully.");
    }

    if (builderStatus === "conflict") {
      toast.error("A draft version already exists for that questionnaire type.");
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("builder");

    router.replace(
      params.toString().length > 0
        ? `/superadmin/questionnaires?${params.toString()}`
        : "/superadmin/questionnaires"
    );
  }, [router, searchParams]);

  const handleTypeChange = (nextType: QuestionnaireType) => {
    setSearchValue("");
    setStatusFilter("ALL");
    router.replace(`/superadmin/questionnaires?type=${nextType}`);
  };

  const handleEditDraft = (row: QuestionnaireVersionItem) => {
    router.push(`/superadmin/questionnaires/new?type=${activeType}&versionId=${row.id}`);
  };

  const handleViewVersion = (row: QuestionnaireVersionItem) => {
    router.push(`/superadmin/questionnaires/preview?versionId=${row.id}`);
  };

  const selectedSummary = typeSummaries.find((summary) => summary.type === activeType);
  const normalizedSearch = deferredSearchValue.trim().toLowerCase();
  const versionRows = questionnaireVersionsQuery.data?.versions ?? [];
  const filteredRows = versionRows.filter((row) => {
    const matchesStatus = statusFilter === "ALL" || row.status === statusFilter;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      `v${row.versionNumber}`.toLowerCase().includes(normalizedSearch) ||
      row.status.toLowerCase().includes(normalizedSearch) ||
      (row.isActive ? "active" : "inactive").includes(normalizedSearch);

    return matchesStatus && matchesSearch;
  });

  const isLoading = questionnaireTypesQuery.isLoading || questionnaireVersionsQuery.isLoading;
  const isError = questionnaireTypesQuery.isError || questionnaireVersionsQuery.isError;
  const hasQuestionnaire = Boolean(selectedSummary?.questionnaireId);
  const hasVersions = versionRows.length > 0;
  const hasFilters = normalizedSearch.length > 0 || statusFilter !== "ALL";
  const hasDraftVersion = versionRows.some((row) => row.status === "DRAFT");
  const emptyState = !hasQuestionnaire
    ? {
        description: "No questionnaire for this type yet.",
      }
    : !hasVersions
      ? {
          description: "No versions yet.",
        }
      : filteredRows.length === 0 && hasFilters
        ? {
            description: "No matching versions.",
            actionLabel: "Clear filters",
            onAction: () => {
              setSearchValue("");
              setStatusFilter("ALL");
            },
          }
        : null;

  return (
    <section className="space-y-6 px-4 py-5 sm:px-6 md:p-8">
      <div>
        <h1 className="font-playfair text-2xl font-semibold">Questionnaires</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse questionnaire types, search versions, and filter by lifecycle status.
        </p>
      </div>

      <QuestionnaireListToolbar
        availableTypes={availableTypes}
        activeType={activeType}
        statusFilter={statusFilter}
        searchValue={searchValue}
        hasDraftVersion={hasDraftVersion}
        onTypeChange={handleTypeChange}
        onStatusFilterChange={setStatusFilter}
        onSearchChange={setSearchValue}
      />

      <QuestionnaireAsyncContent
        isLoading={isLoading}
        isError={isError}
        emptyState={emptyState}
        onRetry={() => {
          void questionnaireTypesQuery.refetch();
          void questionnaireVersionsQuery.refetch();
        }}
      >
        <div className="space-y-4">
          <QuestionnaireTable
            rows={filteredRows}
            onEditDraft={handleEditDraft}
            onViewVersion={handleViewVersion}
          />

          <div className="flex justify-end">
            <p className="text-sm text-muted-foreground">
              {filteredRows.length} of {versionRows.length} version
              {versionRows.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </QuestionnaireAsyncContent>
    </section>
  );
}
