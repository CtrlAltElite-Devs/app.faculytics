"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login } from "@/features/auth/api/auth.requests";
import { useAuthStore } from "@/stores/auth-store";
import { useSelectedCourseStore } from "@/stores/selected-course-store";

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
      setSession(data.token, data.refreshToken);
    },
  });
}
