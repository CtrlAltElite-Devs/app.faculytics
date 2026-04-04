"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/lib/pagination";
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
  const visiblePages = getVisiblePages(safeCurrentPage, totalPages);
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
    <div className="flex flex-col gap-3 pt-4 font-sans text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="text-xs sm:text-sm">
        Showing {meta.itemCount} of {meta.totalItems} dimension
        {meta.totalItems === 1 ? "" : "s"}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-6">
        <div className="flex items-center gap-3">
          <span>Rows per page</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="min-w-16 justify-between font-sans"
              >
                <span>{pageSize}</span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-16">
              <DropdownMenuRadioGroup
                value={String(pageSize)}
                onValueChange={(v) => onPageSizeChange(Number(v))}
              >
                {DEFAULT_PAGE_SIZE_OPTIONS.map((size) => (
                  <DropdownMenuRadioItem
                    key={size}
                    value={String(size)}
                    className="font-sans text-sm"
                  >
                    {size}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          <span>
            Page {safeCurrentPage} of {totalPages}
          </span>
          <Pagination className="mx-0 w-auto justify-start sm:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={buildPageHref(safeCurrentPage - 1)}
                  aria-disabled={safeCurrentPage <= 1}
                  tabIndex={safeCurrentPage <= 1 ? -1 : undefined}
                  className={safeCurrentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>

              {visiblePages.map((item, index) =>
                item === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href={buildPageHref(item)}
                      isActive={item === safeCurrentPage}
                      aria-disabled={item === safeCurrentPage}
                      tabIndex={item === safeCurrentPage ? -1 : undefined}
                      className={item === safeCurrentPage ? "pointer-events-none" : undefined}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href={buildPageHref(safeCurrentPage + 1)}
                  aria-disabled={safeCurrentPage >= totalPages}
                  tabIndex={safeCurrentPage >= totalPages ? -1 : undefined}
                  className={
                    safeCurrentPage >= totalPages ? "pointer-events-none opacity-50" : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as const;
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ] as const;
}
