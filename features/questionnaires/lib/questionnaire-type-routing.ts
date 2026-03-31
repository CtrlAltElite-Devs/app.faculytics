export function normalizeTypeSearchParam({
  isResolved,
  currentTypeParam,
  normalizedType,
  pathname,
  searchParams,
  router,
}: {
  isResolved: boolean;
  currentTypeParam: string | null;
  normalizedType: string;
  pathname: string;
  searchParams: URLSearchParams | ReadonlyURLSearchParamsLike;
  router: {
    replace: (href: string) => void;
  };
}) {
  if (!isResolved) {
    return;
  }

  if (currentTypeParam === normalizedType) {
    return;
  }

  const params = new URLSearchParams(searchParams.toString());
  params.set("type", normalizedType);
  router.replace(`${pathname}?${params.toString()}`);
}

type ReadonlyURLSearchParamsLike = {
  toString(): string;
};
