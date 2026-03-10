"use client";

import { persistSidebarOpenState } from "@/components/ui/sidebar";
import { login } from "@/network/requests/auth";
import { useSelectedCourseStore } from "@/stores/selected-course-store";
import { useAuthStore } from "@/stores/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

/**
 * Login mutation hook.
 * Handles API call, validation of token payload, and session persistence to Zustand.
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);
  const clearSelectedCourse = useSelectedCourseStore((state) => state.clearSelectedCourse);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ["auth"] });
      queryClient.removeQueries({ queryKey: ["enrollments"] });
      clearSelectedCourse();
      persistSidebarOpenState(false);
      setSession(data.token, data.refreshToken);
    },
  });
}
