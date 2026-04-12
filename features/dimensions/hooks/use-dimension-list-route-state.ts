"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type {
  DimensionStatusFilter,
  TypeFilter,
} from "@/features/dimensions/components/dimension-toolbar";
import { DEFAULT_QUESTIONNAIRE_TYPE } from "@/features/questionnaires/constants";
import { resolvePageSizeOption } from "@/lib/pagination";

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

export function useDimensionListRouteState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeFilter = resolveTypeFilter(searchParams.get("type"));
  const statusFilter = resolveStatusFilter(searchParams.get("status"));
  const page = resolvePositiveNumber(searchParams.get("page"), 1);
  const pageSize = resolvePageSizeOption(searchParams.get("pageSize"));
  const urlSearch = searchParams.get("search") ?? "";
  const [searchValue, setSearchValue] = useState(urlSearch);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchValue(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
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
    },
    [pathname, router, searchParams]
  );

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
    [updateSearchParams]
  );

  const handlePageSizeChange = (size: number) => {
    updateSearchParams({
      pageSize: String(size),
      page: "1",
    });
  };

  const handleClearFilters = () => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }

    setSearchValue("");
    updateSearchParams({
      search: null,
      status: null,
      page: "1",
    });
  };

  return {
    pathname,
    router,
    searchParams,
    typeFilter,
    statusFilter,
    page,
    pageSize,
    searchValue,
    onTypeFilterChange: handleTypeFilterChange,
    onStatusFilterChange: handleStatusFilterChange,
    onSearchChange: handleSearchChange,
    onPageSizeChange: handlePageSizeChange,
    onClearFilters: handleClearFilters,
  };
}
