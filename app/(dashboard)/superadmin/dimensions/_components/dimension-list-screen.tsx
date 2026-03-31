"use client";

import { DimensionAsyncContent } from "@/features/dimensions/components/dimension-async-content";
import { DimensionPagination } from "@/features/dimensions/components/dimension-pagination";
import { DimensionTable } from "@/features/dimensions/components/dimension-table";
import {
  DimensionToolbar,
  type DimensionStatusFilter,
  type TypeFilter,
} from "@/features/dimensions/components/dimension-toolbar";
import type { Dimension, DimensionsListMeta } from "@/features/dimensions/types";
import type { QuestionnaireTypeSummary } from "@/features/questionnaires/types";

type DimensionListScreenProps = {
  typeOptions: QuestionnaireTypeSummary[];
  typeFilter: TypeFilter;
  statusFilter: DimensionStatusFilter;
  searchValue: string;
  currentPage: number;
  pageSize: number;
  rows: Dimension[];
  meta: DimensionsListMeta;
  isLoading: boolean;
  isError: boolean;
  disableActions: boolean;
  onTypeFilterChange: (value: TypeFilter) => void;
  onStatusFilterChange: (value: DimensionStatusFilter) => void;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (row: Dimension) => void;
  onToggleStatus: (row: Dimension) => void;
  onRetry: () => void;
};

export function DimensionListScreen({
  typeOptions,
  typeFilter,
  statusFilter,
  searchValue,
  currentPage,
  pageSize,
  rows,
  meta,
  isLoading,
  isError,
  disableActions,
  onTypeFilterChange,
  onStatusFilterChange,
  onSearchChange,
  onCreateClick,
  onPageSizeChange,
  onEdit,
  onToggleStatus,
  onRetry,
}: DimensionListScreenProps) {
  const hasFilters = searchValue.trim().length > 0 || statusFilter !== "ALL";
  const emptyState =
    rows.length === 0 && !isLoading && !isError
      ? hasFilters
        ? {
            description: "No matching dimensions.",
            actionLabel: "Clear filters",
            onAction: () => {
              onSearchChange("");
              onStatusFilterChange("ALL");
            },
          }
        : { description: "No dimensions yet. Create one to get started." }
      : null;

  return (
    <div className="space-y-6">
      <DimensionToolbar
        typeOptions={typeOptions}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        searchValue={searchValue}
        onTypeFilterChange={onTypeFilterChange}
        onStatusFilterChange={onStatusFilterChange}
        onSearchChange={onSearchChange}
        onCreateClick={onCreateClick}
      />

      <DimensionAsyncContent
        isLoading={isLoading}
        isError={isError}
        emptyState={emptyState}
        onRetry={onRetry}
      >
        <div className="space-y-4">
          <DimensionTable
            rows={rows}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
            disableActions={disableActions}
          />

          <DimensionPagination
            meta={meta}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      </DimensionAsyncContent>
    </div>
  );
}
