"use client";

import { useDeferredValue, useState } from "react";

import { QuestionnaireEmptyState } from "@/components/faculytics/questionnaires/questionnaire-empty-state";
import { QuestionnaireErrorState } from "@/components/faculytics/questionnaires/questionnaire-error-state";
import { QuestionnaireLoadingState } from "@/components/faculytics/questionnaires/questionnaire-loading-state";
import { QuestionnaireSearchInput } from "@/components/faculytics/questionnaires/questionnaire-search-input";
import { QuestionnaireStatusFilter } from "@/components/faculytics/questionnaires/questionnaire-status-filter";
import { QuestionnaireTable } from "@/components/faculytics/questionnaires/questionnaire-table";
import { QuestionnaireTypeButtonGroup } from "@/components/faculytics/questionnaires/questionnaire-type-button-group";
import { useQuestionnaireTypes } from "@/hooks/questionnaires/use-questionnaire-types";
import { useQuestionnaireVersions } from "@/hooks/questionnaires/use-questionnaire-versions";
import {
  DEFAULT_QUESTIONNAIRE_TYPE,
  QUESTIONNAIRE_TYPES,
  type QuestionnaireStatusFilter as StatusFilter,
  type QuestionnaireType,
} from "@/types/questionnaires";

export default function SuperAdminQuestionnairesPage() {
  const [selectedType, setSelectedType] = useState<QuestionnaireType>(DEFAULT_QUESTIONNAIRE_TYPE);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const deferredSearchValue = useDeferredValue(searchValue);

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

  const handleTypeChange = (nextType: QuestionnaireType) => {
    setSelectedType(nextType);
    setSearchValue("");
    setStatusFilter("ALL");
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

  return (
    <section className="space-y-6 px-4 py-5 sm:px-6 md:p-8">
      <div>
        <h1 className="font-playfair text-2xl font-semibold">Questionnaires</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse questionnaire types, search versions, and filter by lifecycle status.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        <QuestionnaireTypeButtonGroup
          types={availableTypes}
          value={activeType}
          onValueChange={handleTypeChange}
        />
        <QuestionnaireStatusFilter
          value={statusFilter}
          onValueChange={setStatusFilter}
          className="w-full justify-between gap-3"
        />
        <QuestionnaireSearchInput
          value={searchValue}
          onChange={setSearchValue}
          className="relative w-full"
        />
      </div>

      <div className="hidden md:flex md:flex-col md:gap-4 lg:flex-row lg:items-end lg:justify-between">
        <QuestionnaireTypeButtonGroup
          types={availableTypes}
          value={activeType}
          onValueChange={handleTypeChange}
        />

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
          <QuestionnaireSearchInput value={searchValue} onChange={setSearchValue} />
          <QuestionnaireStatusFilter value={statusFilter} onValueChange={setStatusFilter} />
        </div>
      </div>

      {isLoading ? (
        <QuestionnaireLoadingState />
      ) : isError ? (
        <QuestionnaireErrorState
          onRetry={() => {
            void questionnaireTypesQuery.refetch();
            void questionnaireVersionsQuery.refetch();
          }}
        />
      ) : !hasQuestionnaire ? (
        <QuestionnaireEmptyState
          description="No questionnaire for this type yet."
        />
      ) : !hasVersions ? (
        <QuestionnaireEmptyState
          description="No versions yet."
        />
      ) : filteredRows.length === 0 && hasFilters ? (
        <QuestionnaireEmptyState
          description="No matching versions."
          actionLabel="Clear filters"
          onAction={() => {
            setSearchValue("");
            setStatusFilter("ALL");
          }}
        />
      ) : (
        <div className="space-y-4">
          <QuestionnaireTable rows={filteredRows} />

          <div className="flex justify-end">
            <p className="text-sm text-muted-foreground">
              {filteredRows.length} of {versionRows.length} version
              {versionRows.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
