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
  const persistedRole = useAuthStore((state) => state.activeRole);
  const setActiveRole = useAuthStore((state) => state.setActiveRole);
  const roles = useMemo(() => getAvailableRoles(me?.roles), [me?.roles]);
  const activeRole = useMemo(() => resolveActiveRole(roles, persistedRole), [persistedRole, roles]);
  const roleHome = useMemo(
    () => resolveHomeFromRoles(roles, persistedRole),
    [persistedRole, roles]
  );

  useEffect(() => {
    if (isPending || isError) return;

    if (persistedRole !== activeRole) {
      setActiveRole(activeRole);
    }
  }, [activeRole, isError, isPending, persistedRole, setActiveRole]);

  return {
    me,
    roles,
    isPending,
    isError,
    activeRole,
    roleHome,
    setActiveRole,
  };
}
