"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { type QuestionnaireTypeManagementFilter } from "@/features/questionnaires/constants";
import { QuestionnaireTypeManagementAsyncContent } from "@/features/questionnaires/components/questionnaire-type-management-async-content";
import { QuestionnaireTypeManagementTable } from "@/features/questionnaires/components/questionnaire-type-management-table";
import { QuestionnaireTypeManagementToolbar } from "@/features/questionnaires/components/questionnaire-type-management-toolbar";
import type { QuestionnaireTypeManagementEntity } from "@/features/questionnaires/types";

type QuestionnaireTypeListScreenProps = {
  rows: QuestionnaireTypeManagementEntity[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onCreateClick: () => void;
  onEdit: (row: QuestionnaireTypeManagementEntity) => void;
  onDelete: (row: QuestionnaireTypeManagementEntity) => void;
};

export function QuestionnaireTypeListScreen({
  rows,
  isLoading,
  isError,
  onRetry,
  onCreateClick,
  onEdit,
  onDelete,
}: QuestionnaireTypeListScreenProps) {
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState<QuestionnaireTypeManagementFilter>("ALL");
  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearch = deferredSearchValue.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesFilter =
        filter === "ALL" || (filter === "SYSTEM" ? row.isSystem : !row.isSystem);
      const haystack = [
        row.name,
        row.code,
        row.description ?? "",
        row.isSystem ? "system" : "custom",
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = normalizedSearch.length === 0 || haystack.includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [filter, normalizedSearch, rows]);

  const emptyState = useMemo(() => {
    if (rows.length === 0) {
      return {
        description: "No questionnaire types found yet.",
      };
    }

    if (filteredRows.length === 0) {
      return {
        description: "No matching questionnaire types.",
        actionLabel: "Clear filters",
        onAction: () => {
          setSearchValue("");
          setFilter("ALL");
        },
      };
    }

    return null;
  }, [filteredRows.length, rows.length]);

  return (
    <div className="space-y-6">
      <QuestionnaireTypeManagementToolbar
        searchValue={searchValue}
        filter={filter}
        onSearchChange={setSearchValue}
        onFilterChange={setFilter}
        onCreateClick={onCreateClick}
      />

      <QuestionnaireTypeManagementAsyncContent
        isLoading={isLoading}
        isError={isError}
        emptyState={emptyState}
        onRetry={onRetry}
      >
        <div className="space-y-4">
          <QuestionnaireTypeManagementTable
            rows={filteredRows}
            onEdit={onEdit}
            onDelete={onDelete}
          />

          <div className="flex justify-end">
            <p className="text-sm text-muted-foreground">
              {filteredRows.length} of {rows.length} questionnaire type
              {rows.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </QuestionnaireTypeManagementAsyncContent>
    </div>
  );
}
