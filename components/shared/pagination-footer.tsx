"use client";

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
import { DEFAULT_PAGE_SIZE_OPTIONS, getPaginationItems } from "@/lib/pagination";

type PaginationFooterProps = {
  itemCount: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemLabel: string;
  onPageChange?: (page: number) => void;
  buildPageHref?: (page: number) => string;
  rowsPerPage?: number;
  onRowsPerPageChange?: (value: number) => void;
};

export function PaginationFooter({
  itemCount,
  totalItems,
  currentPage,
  totalPages,
  itemLabel,
  onPageChange,
  buildPageHref,
  rowsPerPage,
  onRowsPerPageChange,
}: PaginationFooterProps) {
  const safeCurrentPage = currentPage > 0 ? currentPage : 1;
  const safeTotalPages = Math.max(totalPages, 1);
  const paginationItems = getPaginationItems(safeCurrentPage, safeTotalPages);
  const showRowsPerPage = typeof rowsPerPage === "number" && Boolean(onRowsPerPageChange);
  const getPageHref = (page: number) => buildPageHref?.(page) ?? "#";

  return (
    <div className="flex flex-col gap-3 pt-4 font-sans text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="text-xs sm:text-sm">
        Showing {itemCount} of {totalItems} {itemLabel}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-6">
        {showRowsPerPage ? (
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
                  <span>{rowsPerPage}</span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-16">
                <DropdownMenuRadioGroup
                  value={String(rowsPerPage)}
                  onValueChange={(value) => {
                    onRowsPerPageChange?.(Number(value));
                  }}
                >
                  {DEFAULT_PAGE_SIZE_OPTIONS.map((option) => (
                    <DropdownMenuRadioItem
                      key={option}
                      value={String(option)}
                      className="font-sans text-sm"
                    >
                      {option}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <span>
            Page {safeCurrentPage} of {safeTotalPages}
          </span>
          <Pagination className="mx-0 w-auto justify-start sm:justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={getPageHref(Math.max(safeCurrentPage - 1, 1))}
                  aria-disabled={safeCurrentPage === 1}
                  tabIndex={safeCurrentPage === 1 ? -1 : undefined}
                  className={safeCurrentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                  onClick={(event) => {
                    if (onPageChange) {
                      event.preventDefault();
                    }
                    if (safeCurrentPage > 1 && onPageChange) {
                      onPageChange(Math.max(safeCurrentPage - 1, 1));
                    }
                  }}
                />
              </PaginationItem>

              {paginationItems.map((item, index) =>
                item === "..." ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href={getPageHref(item)}
                      isActive={item === safeCurrentPage}
                      aria-disabled={item === safeCurrentPage}
                      tabIndex={item === safeCurrentPage ? -1 : undefined}
                      className={item === safeCurrentPage ? "pointer-events-none" : undefined}
                      onClick={(event) => {
                        if (onPageChange) {
                          event.preventDefault();
                          onPageChange(item);
                        }
                      }}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href={getPageHref(Math.min(safeCurrentPage + 1, safeTotalPages))}
                  aria-disabled={safeCurrentPage === safeTotalPages}
                  tabIndex={safeCurrentPage === safeTotalPages ? -1 : undefined}
                  className={
                    safeCurrentPage === safeTotalPages
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                  onClick={(event) => {
                    if (onPageChange) {
                      event.preventDefault();
                    }
                    if (safeCurrentPage < safeTotalPages && onPageChange) {
                      onPageChange(Math.min(safeCurrentPage + 1, safeTotalPages));
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
