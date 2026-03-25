"use client";

import { useEffect, useMemo } from "react";

import {
  getAvailableRoles,
  resolveActiveRole,
  resolveHomeFromRoles,
} from "@/features/auth/lib/role-route";
import { useAuthStore } from "@/stores/auth-store";

import { useMe } from "@/features/auth/hooks/use-me";

export function useActiveRole() {
  const { data: me, isPending, isError } = useMe();
  const storedActiveRole = useAuthStore((state) => state.activeRole);
  const setActiveRole = useAuthStore((state) => state.setActiveRole);
  const rawRoles = useMemo(() => me?.roles ?? [], [me?.roles]);

  const availableRoles = useMemo(() => getAvailableRoles(rawRoles), [rawRoles]);
  const activeRole = useMemo(
    () => resolveActiveRole(availableRoles, storedActiveRole),
    [availableRoles, storedActiveRole]
  );
  const roleHome = useMemo(
    () => resolveHomeFromRoles(availableRoles, storedActiveRole),
    [availableRoles, storedActiveRole]
  );

  useEffect(() => {
    if (isPending || isError) return;

    if (storedActiveRole !== activeRole) {
      setActiveRole(activeRole);
    }
  }, [activeRole, isError, isPending, setActiveRole, storedActiveRole]);

  return {
    me,
    roles: availableRoles,
    isPending,
    isError,
    activeRole,
    availableRoles,
    roleHome,
    setActiveRole,
  };
}
