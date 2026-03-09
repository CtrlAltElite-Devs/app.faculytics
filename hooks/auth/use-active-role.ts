"use client";

import { useEffect, useMemo } from "react";

import { resolveActiveRole, resolveHomeFromRoles, getAvailableRoles } from "@/lib/auth/role-route";
import { useAuthStore } from "@/stores/auth-store";

import { useMe } from "./use-me";

export function useActiveRole() {
  const { data: me, isPending, isError } = useMe();
  const storedActiveRole = useAuthStore((state) => state.activeRole);
  const setActiveRole = useAuthStore((state) => state.setActiveRole);

  const availableRoles = useMemo(() => getAvailableRoles(me?.roles), [me?.roles]);
  const activeRole = useMemo(
    () => resolveActiveRole(me?.roles, storedActiveRole),
    [me?.roles, storedActiveRole],
  );
  const roleHome = useMemo(
    () => resolveHomeFromRoles(me?.roles, storedActiveRole),
    [me?.roles, storedActiveRole],
  );

  useEffect(() => {
    if (isPending || isError) return;

    if (storedActiveRole !== activeRole) {
      setActiveRole(activeRole);
    }
  }, [activeRole, isError, isPending, setActiveRole, storedActiveRole]);

  return {
    activeRole,
    availableRoles,
    roleHome,
    setActiveRole,
  };
}
