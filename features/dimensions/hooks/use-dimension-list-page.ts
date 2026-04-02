"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useDimensionList } from "@/features/dimensions/hooks/use-dimension-list";
import { useToggleDimensionStatus } from "@/features/dimensions/hooks/use-toggle-dimension-status";
import type { Dimension, ListDimensionsRequest } from "@/features/dimensions/types";
import type {
  DimensionStatusFilter,
  TypeFilter,
} from "@/features/dimensions/components/dimension-toolbar";
import { DEFAULT_QUESTIONNAIRE_TYPE } from "@/features/questionnaires/constants";
import { useQuestionnaireTypeId } from "@/features/questionnaires/hooks/use-questionnaire-type-id";
import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import { resolvePageSizeOption } from "@/lib/pagination";
import {
  buildQuestionnaireTypeOptions,
  resolveActiveQuestionnaireType,
} from "@/features/questionnaires/lib/questionnaire-type-options";
import { normalizeTypeSearchParam } from "@/features/questionnaires/lib/questionnaire-type-routing";

type DimensionAction = { type: "toggle"; dimension: Dimension } | null;

function resolveTypeFilter(value: string | null): TypeFilter {
  if (value && value.trim().length > 0) {
    return value;
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

export function useDimensionListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [editDimension, setEditDimension] = useState<Dimension | null>(null);
  const [dimensionAction, setDimensionAction] = useState<DimensionAction>(null);

  const typeFilter = resolveTypeFilter(searchParams.get("type"));
  const statusFilter = resolveStatusFilter(searchParams.get("status"));
  const page = resolvePositiveNumber(searchParams.get("page"), 1);
  const pageSize = resolvePageSizeOption(searchParams.get("pageSize"));

  // Local search state — only syncs to URL after debounce
  const urlSearch = searchParams.get("search") ?? "";
  const [searchValue, setSearchValue] = useState(urlSearch);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state when URL changes externally (e.g. "Clear filters")
  useEffect(() => {
    setSearchValue(urlSearch);
  }, [urlSearch]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  // Fetch questionnaire types to resolve code → UUID
  const questionnaireTypesQuery = useQuestionnaireTypes();
  const typeSummaries = questionnaireTypesQuery.data ?? [];
  const availableTypeOptions = buildQuestionnaireTypeOptions(typeSummaries);
  const activeTypeFilter = resolveActiveQuestionnaireType({
    requestedType: typeFilter,
    availableTypeOptions,
    isResolved: questionnaireTypesQuery.isSuccess,
  });
  const typeFilterId = useQuestionnaireTypeId(activeTypeFilter);

  useEffect(() => {
    normalizeTypeSearchParam({
      isResolved: questionnaireTypesQuery.isSuccess,
      currentTypeParam: searchParams.get("type"),
      normalizedType: activeTypeFilter,
      pathname,
      searchParams,
      router,
    });
  }, [
    activeTypeFilter,
    pathname,
    questionnaireTypesQuery.isSuccess,
    router,
    searchParams,
    typeFilter,
  ]);

  // Fetch all dimensions for the questionnaire type so search works across all items
  const queryParams: ListDimensionsRequest = {
    limit: 100,
    ...(typeFilterId && { questionnaireTypeId: typeFilterId }),
    ...(statusFilter === "ACTIVE" && { active: true }),
    ...(statusFilter === "INACTIVE" && { active: false }),
  };

  const dimensionListQuery = useDimensionList(queryParams, {
    enabled: questionnaireTypesQuery.isSuccess && typeFilterId !== null,
  });
  const toggleStatusMutation = useToggleDimensionStatus();

  const allRows = dimensionListQuery.data?.data ?? [];

  const statusFilteredRows =
    statusFilter === "ACTIVE"
      ? allRows.filter((row) => row.active)
      : statusFilter === "INACTIVE"
        ? allRows.filter((row) => !row.active)
        : allRows;

  const normalizedSearch = searchValue.trim().toLowerCase();
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

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);

      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      searchTimerRef.current = setTimeout(() => {
        updateSearchParams({
          search: value.trim().length > 0 ? value : null,
          page: "1",
        });
      }, 300);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, searchParams]
  );

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
    typeFilter: activeTypeFilter,
    statusFilter,
    searchValue,
    page,
    pageSize,
    rows: filteredRows,
    meta,
    typeSummaries,
    availableTypeOptions,
    isLoading: questionnaireTypesQuery.isLoading || dimensionListQuery.isLoading,
    isError: questionnaireTypesQuery.isError || dimensionListQuery.isError,
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
      void questionnaireTypesQuery.refetch();
      void dimensionListQuery.refetch();
    },
  };
}
