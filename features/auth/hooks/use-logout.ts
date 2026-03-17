"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout } from "@/features/auth/api/auth.requests";
import { useAuthStore } from "@/stores/auth-store";
import { useSelectedCourseStore } from "@/stores/selected-course-store";

export function useLogout() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);
  const clearSelectedCourse = useSelectedCourseStore((state) => state.clearSelectedCourse);

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearSession();
      clearSelectedCourse();
      queryClient.removeQueries({ queryKey: ["auth"] });
      queryClient.removeQueries({ queryKey: ["enrollments"] });
    },
  });
}
