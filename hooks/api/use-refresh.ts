import { $api } from "@/lib/api-client";

export function useRefresh() {
  return $api.useMutation("post", "/api/v1/auth/refresh");
}
