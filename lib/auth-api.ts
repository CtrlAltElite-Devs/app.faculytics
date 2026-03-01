import type { MeResponse } from "@/types/kubb/gen";
import { fetchClient } from "./api-client";

export async function fetchMe() {
  const { data, error } = await fetchClient.GET("/api/v1/auth/me");
  if (error || !data) {
    return null;
  }

  return data as MeResponse;
}
