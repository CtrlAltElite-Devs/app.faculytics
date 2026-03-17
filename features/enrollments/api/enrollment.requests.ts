import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";
import type { GetMyEnrollmentsQuery, MyEnrollmentsResponseDto } from "@/features/enrollments/types";

const DEFAULT_MY_ENROLLMENTS_QUERY: GetMyEnrollmentsQuery = {
  page: 1,
  limit: 100,
};

/**
 * Fetch current user's enrolled courses.
 */
export async function fetchMyEnrollments(
  query: GetMyEnrollmentsQuery = DEFAULT_MY_ENROLLMENTS_QUERY
) {
  const response = await apiClient.get<MyEnrollmentsResponseDto>(Endpoints.enrollmentsMe, {
    params: query,
  });
  return response.data;
}
