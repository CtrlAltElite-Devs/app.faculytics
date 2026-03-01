import { $api } from "@/lib/api-client";

export function useMe() {
  return $api.useQuery("get", "/api/v1/auth/me");
}
