"use client";

import { useEffect, useMemo, useState } from "react";

import { useDimensionList } from "@/features/dimensions/hooks/use-dimension-list";
import { useDimensionListRouteState } from "@/features/dimensions/hooks/use-dimension-list-route-state";
import { useDimensionToggleFlow } from "@/features/dimensions/hooks/use-dimension-toggle-flow";
import type { Dimension, ListDimensionsRequest } from "@/features/dimensions/types";
import { useQuestionnaireTypes } from "@/features/questionnaires/hooks/use-questionnaire-types";
import {
  buildQuestionnaireTypeOptions,
  resolveActiveQuestionnaireType,
} from "@/features/questionnaires/lib/questionnaire-type-options";
import type { QuestionnaireTypeSummary } from "@/features/questionnaires/types";
import { normalizeTypeSearchParam } from "@/features/questionnaires/lib/questionnaire-type-routing";

const EMPTY_TYPE_SUMMARIES: QuestionnaireTypeSummary[] = [];

export function useDimensionListPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editDimension, setEditDimension] = useState<Dimension | null>(null);
  const {
    dimensionAction,
    toggleDialogConfig,
    isTogglePending,
    setDimensionAction,
    onConfirmToggle,
  } = useDimensionToggleFlow();

  // Fetch questionnaire types to resolve code → UUID
  const questionnaireTypesQuery = useQuestionnaireTypes();
  const typeSummaries = questionnaireTypesQuery.data ?? EMPTY_TYPE_SUMMARIES;
  const availableTypeOptions = useMemo(
    () => buildQuestionnaireTypeOptions(typeSummaries),
    [typeSummaries]
  );
  const routeState = useDimensionListRouteState();
  const { statusFilter, page, pageSize, searchValue } = routeState;
  const activeTypeFilter = resolveActiveQuestionnaireType({
    requestedType: routeState.typeFilter,
    availableTypeOptions,
    isResolved: questionnaireTypesQuery.isSuccess,
  });
  const typeFilterId = useMemo(
    () => typeSummaries.find((summary) => summary.code === activeTypeFilter)?.id ?? null,
    [activeTypeFilter, typeSummaries]
  );

  useEffect(() => {
    normalizeTypeSearchParam({
      isResolved: questionnaireTypesQuery.isSuccess,
      currentTypeParam: routeState.searchParams.get("type"),
      normalizedType: activeTypeFilter,
      pathname: routeState.pathname,
      searchParams: routeState.searchParams,
      router: routeState.router,
    });
  }, [
    activeTypeFilter,
    questionnaireTypesQuery.isSuccess,
    routeState.pathname,
    routeState.router,
    routeState.searchParams,
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
    isTogglePending,
    setCreateOpen,
    setEditDimension,
    setDimensionAction,
    onTypeFilterChange: routeState.onTypeFilterChange,
    onStatusFilterChange: routeState.onStatusFilterChange,
    onSearchChange: routeState.onSearchChange,
    onPageSizeChange: routeState.onPageSizeChange,
    onClearFilters: routeState.onClearFilters,
    onConfirmToggle,
    onRetry: () => {
      void questionnaireTypesQuery.refetch();
      void dimensionListQuery.refetch();
    },
  };
}
