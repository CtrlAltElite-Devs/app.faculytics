"use client";

import { useEffect, useMemo } from "react";

import { getAvailableRoles, resolveActiveRole, resolveHomeFromRoles } from "@/features/auth/lib/role-route";
import { useAuthStore } from "@/stores/auth-store";

import { useMe } from "@/features/auth/hooks/use-me";

export function useActiveRole() {
  const { data: me, isPending, isError } = useMe();
  const storedActiveRole = useAuthStore((state) => state.activeRole);
  const setActiveRole = useAuthStore((state) => state.setActiveRole);
  const roles = useMemo(() => me?.roles ?? [], [me?.roles]);

  const availableRoles = useMemo(() => getAvailableRoles(roles), [roles]);
  const activeRole = useMemo(
    () => resolveActiveRole(roles, storedActiveRole),
    [roles, storedActiveRole],
  );
  const roleHome = useMemo(
    () => resolveHomeFromRoles(roles, storedActiveRole),
    [roles, storedActiveRole],
  );

  useEffect(() => {
    if (isPending || isError) return;

    if (storedActiveRole !== activeRole) {
      setActiveRole(activeRole);
    }
  }, [activeRole, isError, isPending, setActiveRole, storedActiveRole]);

  return {
    me,
    roles,
    isPending,
    isError,
    activeRole,
    availableRoles,
    roleHome,
    setActiveRole,
  };
}
