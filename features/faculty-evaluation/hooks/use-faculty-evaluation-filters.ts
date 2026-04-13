"use client";

import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ALL_PROGRAMS_VALUE } from "@/features/faculty-analytics/constants/filters";

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

type SyncEvaluationFiltersOptions = {
  selectedSemesterId: string | null;
  selectedProgramId: string | null;
};

export function useFacultyEvaluationFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const selectedSemesterIdParam = searchParams.get("semesterId");
  const selectedProgramIdParam = searchParams.get("programId");
  const searchParamValue = searchParams.get("search") ?? "";

  const [searchValue, setSearchValueState] = useState(searchParamValue);
  const deferredSearchValue = useDeferredValue(searchValue.trim());

  useEffect(() => {
    setSearchValueState(searchParamValue);
  }, [searchParamValue]);

  const replaceParams = useCallback(
    (updates: Record<string, string | null>) => {
      const nextHref = setSearchParams(pathname, new URLSearchParams(searchParamsString), updates);
      router.replace(nextHref, { scroll: false });
    },
    [pathname, router, searchParamsString]
  );

  const syncFilters = useCallback(
    ({ selectedSemesterId, selectedProgramId }: SyncEvaluationFiltersOptions) => {
      if (!selectedSemesterId) return;

      const nextHref = setSearchParams(pathname, new URLSearchParams(searchParamsString), {
        semesterId: selectedSemesterId,
        programId: selectedProgramId,
        search: searchValue.trim() || null,
      });
      const currentHref = searchParamsString ? `${pathname}?${searchParamsString}` : pathname;

      if (nextHref !== currentHref) {
        router.replace(nextHref, { scroll: false });
      }
    },
    [pathname, router, searchParamsString, searchValue]
  );

  return {
    selectedSemesterIdParam,
    selectedProgramIdParam,
    searchValue,
    deferredSearchValue,
    searchParamsString,
    syncFilters,
    setSearchValue: setSearchValueState,
    setSelectedSemesterId: (value: string) => {
      replaceParams({
        semesterId: value,
        programId: null,
      });
    },
    setSelectedProgramId: (value: string) => {
      replaceParams({
        programId: value === ALL_PROGRAMS_VALUE ? null : value,
      });
    },
  };
}
