"use client";

import { useDeferredValue, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useDimensionList } from "@/features/dimensions/hooks/use-dimension-list";
import { useToggleDimensionStatus } from "@/features/dimensions/hooks/use-toggle-dimension-status";
import type { Dimension, ListDimensionsRequest } from "@/features/dimensions/types";
import type {
  DimensionStatusFilter,
  TypeFilter,
} from "@/features/dimensions/components/dimension-toolbar";
import {
  QUESTIONNAIRE_TYPES,
  DEFAULT_QUESTIONNAIRE_TYPE,
} from "@/features/questionnaires/constants";

type DimensionAction = { type: "toggle"; dimension: Dimension } | null;

export const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;

function resolveTypeFilter(value: string | null): TypeFilter {
  if (value && QUESTIONNAIRE_TYPES.includes(value as TypeFilter)) {
    return value as TypeFilter;
  }

  return DEFAULT_QUESTIONNAIRE_TYPE;
}

function resolveStatusFilter(value: string | null): DimensionStatusFilter {
  if (value === "ACTIVE" || value === "INACTIVE" || value === "ALL") {
    return value;
  }

  return "ALL";
}

function resolvePositiveNumber(value: string | null, fallback: number) {
  if (!value) return fallback;

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function resolvePageSize(value: string | null) {
  const parsed = resolvePositiveNumber(value, 10);
  return PAGE_SIZE_OPTIONS.includes(parsed as (typeof PAGE_SIZE_OPTIONS)[number]) ? parsed : 10;
}

export function useDimensionListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [editDimension, setEditDimension] = useState<Dimension | null>(null);
  const [dimensionAction, setDimensionAction] = useState<DimensionAction>(null);

  const typeFilter = resolveTypeFilter(searchParams.get("type"));
  const statusFilter = resolveStatusFilter(searchParams.get("status"));
  const searchValue = searchParams.get("search") ?? "";
  const page = resolvePositiveNumber(searchParams.get("page"), 1);
  const pageSize = resolvePageSize(searchParams.get("pageSize"));

  const deferredSearch = useDeferredValue(searchValue);

  // Fetch all dimensions for the questionnaire type so search works across all items
  const queryParams: ListDimensionsRequest = {
    limit: 100,
    questionnaireType: typeFilter,
    ...(statusFilter === "ACTIVE" && { active: true }),
    ...(statusFilter === "INACTIVE" && { active: false }),
  };

  const dimensionListQuery = useDimensionList(queryParams);
  const toggleStatusMutation = useToggleDimensionStatus();

  const allRows = dimensionListQuery.data?.data ?? [];

  const statusFilteredRows =
    statusFilter === "ACTIVE"
      ? allRows.filter((row) => row.active)
      : statusFilter === "INACTIVE"
        ? allRows.filter((row) => !row.active)
        : allRows;

  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const searchFilteredRows =
    normalizedSearch.length > 0
      ? statusFilteredRows.filter(
          (row) =>
            row.displayName.toLowerCase().includes(normalizedSearch) ||
            row.code.toLowerCase().includes(normalizedSearch)
        )
      : statusFilteredRows;

  // Client-side pagination over filtered results
  const totalItems = searchFilteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const filteredRows = searchFilteredRows.slice(startIndex, startIndex + pageSize);

  const meta = {
    page: safePage,
    limit: pageSize,
    totalItems,
    totalPages,
    itemCount: filteredRows.length,
  };

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
        return;
      }

      params.set(key, value);
    });

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handleTypeFilterChange = (value: TypeFilter) => {
    updateSearchParams({
      type: value,
      page: "1",
    });
  };

  const handleStatusFilterChange = (value: DimensionStatusFilter) => {
    updateSearchParams({
      status: value === "ALL" ? null : value,
      page: "1",
    });
  };

  const handleSearchChange = (value: string) => {
    updateSearchParams({
      search: value.trim().length > 0 ? value : null,
      page: "1",
    });
  };

  const handlePageChange = (nextPage: number) => {
    updateSearchParams({
      page: String(nextPage),
    });
  };

  const handlePageSizeChange = (size: number) => {
    updateSearchParams({
      pageSize: String(size),
      page: "1",
    });
  };

  const handleConfirmToggle = async () => {
    if (!dimensionAction) return;

    const { dimension } = dimensionAction;
    const action = dimension.active ? "deactivated" : "activated";

    try {
      await toggleStatusMutation.mutateAsync({
        id: dimension.id,
        active: dimension.active,
      });
      toast.success(`Dimension ${action}.`);
      setDimensionAction(null);
    } catch {
      toast.error(`Unable to ${dimension.active ? "deactivate" : "activate"} dimension.`);
    }
  };

  const toggleDialogConfig = dimensionAction
    ? dimensionAction.dimension.active
      ? {
          title: `Deactivate "${dimensionAction.dimension.displayName}"?`,
          description: "This dimension will no longer be selectable in the questionnaire builder.",
          confirmLabel: "Deactivate",
          confirmVariant: "destructive" as const,
        }
      : {
          title: `Activate "${dimensionAction.dimension.displayName}"?`,
          description: "This dimension will become selectable again in the questionnaire builder.",
          confirmLabel: "Activate",
          confirmVariant: "brand" as const,
        }
    : null;

  return {
    typeFilter,
    statusFilter,
    searchValue,
    page,
    pageSize,
    rows: filteredRows,
    meta,
    isLoading: dimensionListQuery.isLoading,
    isError: dimensionListQuery.isError,
    createOpen,
    editDimension,
    dimensionAction,
    toggleDialogConfig,
    isTogglePending: toggleStatusMutation.isPending,
    setCreateOpen,
    setEditDimension,
    setDimensionAction,
    onTypeFilterChange: handleTypeFilterChange,
    onStatusFilterChange: handleStatusFilterChange,
    onSearchChange: handleSearchChange,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    onConfirmToggle: handleConfirmToggle,
    onRetry: () => {
      void dimensionListQuery.refetch();
    },
  };
}
