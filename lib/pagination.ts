/**
 * Builds a compact pagination bar: shows page numbers near the current page
 * and replaces distant pages with "..." ellipsis markers.
 */
export function getPaginationItems(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

/**
 * Returns a page-sized slice from the given array.
 */
export function paginateArray<T>(items: readonly T[], page: number, pageSize: number): T[] {
  return items.slice((page - 1) * pageSize, page * pageSize);
}
