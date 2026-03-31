"use client";

import { useDeferredValue, useState } from "react";

import { QuestionnaireListToolbar } from "@/features/questionnaires/components/questionnaire-list-toolbar";
import { QuestionnaireAsyncContent } from "@/features/questionnaires/components/questionnaire-async-content";
import { QuestionnaireTable } from "@/features/questionnaires/components/questionnaire-table";
import type {
  QuestionnaireStatusFilter as StatusFilter,
  QuestionnaireTypeCode,
  QuestionnaireTypeSummary,
  QuestionnaireVersionItem,
} from "@/features/questionnaires/types";

type QuestionnaireListScreenProps = {
  availableTypes: QuestionnaireTypeSummary[];
  activeType: QuestionnaireTypeCode;
  hasDraftVersion: boolean;
  hasQuestionnaire: boolean;
  onTypeChange: (nextType: QuestionnaireTypeCode) => void;
  isLoading: boolean;
  isError: boolean;
  rows: QuestionnaireVersionItem[];
  onRetry: () => void;
  onEditDraft: (row: QuestionnaireVersionItem) => void;
  onViewVersion: (row: QuestionnaireVersionItem) => void;
  onPublishVersion: (row: QuestionnaireVersionItem) => void;
  onDeprecateVersion: (row: QuestionnaireVersionItem) => void;
  disableActions?: boolean;
};

export function QuestionnaireListScreen({
  availableTypes,
  activeType,
  hasDraftVersion,
  hasQuestionnaire,
  onTypeChange,
  isLoading,
  isError,
  rows,
  onRetry,
  onEditDraft,
  onViewVersion,
  onPublishVersion,
  onDeprecateVersion,
  disableActions = false,
}: QuestionnaireListScreenProps) {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearch = deferredSearchValue.trim().toLowerCase();
  const filteredRows = rows.filter((row) => {
    const matchesStatus = statusFilter === "ALL" || row.status === statusFilter;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      `v${row.versionNumber}`.toLowerCase().includes(normalizedSearch) ||
      row.status.toLowerCase().includes(normalizedSearch) ||
      (row.isActive ? "active" : "inactive").includes(normalizedSearch);

    return matchesStatus && matchesSearch;
  });
  const hasFilters = normalizedSearch.length > 0 || statusFilter !== "ALL";
  const emptyState = !hasQuestionnaire
    ? {
        description: "No questionnaire for this type yet.",
      }
    : rows.length === 0
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
    <div className="space-y-6">
      <QuestionnaireListToolbar
        availableTypes={availableTypes}
        activeType={activeType}
        statusFilter={statusFilter}
        searchValue={searchValue}
        hasDraftVersion={hasDraftVersion}
        onTypeChange={(nextType) => {
          setSearchValue("");
          setStatusFilter("ALL");
          onTypeChange(nextType);
        }}
        onStatusFilterChange={setStatusFilter}
        onSearchChange={setSearchValue}
      />

      <QuestionnaireAsyncContent
        isLoading={isLoading}
        isError={isError}
        emptyState={emptyState}
        onRetry={onRetry}
      >
        <div className="space-y-4">
          <QuestionnaireTable
            rows={filteredRows}
            onEditDraft={onEditDraft}
            onViewVersion={onViewVersion}
            onPublishVersion={onPublishVersion}
            onDeprecateVersion={onDeprecateVersion}
            disableActions={disableActions}
          />

          <div className="flex justify-end">
            <p className="text-sm text-muted-foreground">
              {filteredRows.length} of {rows.length} version
              {rows.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </QuestionnaireAsyncContent>
    </div>
  );
}
