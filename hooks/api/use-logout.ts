import { $api } from "@/lib/api-client";

export function useLogout() {
  return $api.useMutation("post", "/api/v1/auth/logout");
}
