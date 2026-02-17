import { $api } from "@/lib/api-client";

export function useHealthCheck() {
  return $api.useQuery("get", "/api/v1/health");
}
