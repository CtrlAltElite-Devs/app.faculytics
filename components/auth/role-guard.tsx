"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/api/use-me";
import { resolveHomePathFromRoles } from "@/lib/auth-roles";

type RoleGuardProps = {
  allowedRoles: string[];
  children: ReactNode;
};

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const { data, isPending, isError } = useMe();

  const roles = useMemo(() => data?.roles ?? [], [data?.roles]);
  const isAllowed = roles.some((role) => allowedRoles.includes(role));

  useEffect(() => {
    if (!isPending && isError) {
      router.replace("/auth");
      return;
    }

    if (!isPending && data && !isAllowed) {
      router.replace(resolveHomePathFromRoles(roles));
    }
  }, [data, isAllowed, isError, isPending, roles, router]);

  if (isPending) {
    return <div className="p-4 text-sm text-muted-foreground">Checking permissions...</div>;
  }

  if (!data || !isAllowed) {
    return null;
  }

  return <>{children}</>;
}
