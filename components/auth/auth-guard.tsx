"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/api/use-me";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { data, isPending, isError } = useMe();
  const hasRoles = Boolean(data?.roles?.length);

  useEffect(() => {
    if (!isPending && isError) {
      router.replace("/auth");
    }
  }, [isError, isPending, router]);

  useEffect(() => {
    if (!isPending && data && !hasRoles) {
      router.replace("/auth");
    }
  }, [data, hasRoles, isPending, router]);

  if (isPending) {
    return <div className="p-4 text-sm text-muted-foreground">Checking session...</div>;
  }

  if (!data || !hasRoles) {
    return null;
  }

  return <>{children}</>;
}
