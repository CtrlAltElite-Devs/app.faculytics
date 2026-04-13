"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { PaginationFooter } from "@/components/shared/pagination-footer";
import type { DimensionsListMeta } from "@/features/dimensions/types";

type DimensionPaginationProps = {
  meta: DimensionsListMeta;
  currentPage: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
};

export function DimensionPagination({
  meta,
  currentPage,
  pageSize,
  onPageSizeChange,
}: DimensionPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = meta.totalPages || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const buildPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <PaginationFooter
      itemCount={meta.itemCount}
      totalItems={meta.totalItems}
      currentPage={safeCurrentPage}
      totalPages={totalPages}
      itemLabel={`dimension${meta.totalItems === 1 ? "" : "s"}`}
      rowsPerPage={pageSize}
      onRowsPerPageChange={onPageSizeChange}
      buildPageHref={buildPageHref}
    />
  );
}
