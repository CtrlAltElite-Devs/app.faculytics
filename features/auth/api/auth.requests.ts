import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";

import type { LoginRequest, RefreshTokenRequestBody } from "@/features/auth/types";
import type { LoginResponse, MeResponse } from "@/features/auth/types";

/**
 * Login a user with username and password.
 * @param payload Login credentials
 * @returns Login response containing access and refresh tokens
 */
export async function login(payload: LoginRequest) {
  const response = await apiClient.post<LoginResponse>(Endpoints.login, payload);
  return response.data;
}

/**
 * Fetch current user profile from active session token.
 * @returns User profile information
 */
export async function fetchMe() {
  const response = await apiClient.get<MeResponse>(Endpoints.me);
  return response.data;
}

/**
 * Refresh authentication tokens using a refresh token.
 * @param payload Refresh token payload
 * @returns Next access and refresh tokens
 */
export async function refreshToken(payload: RefreshTokenRequestBody) {
  const response = await apiClient.post<LoginResponse>(Endpoints.refresh, payload);
  return response.data;
}

/**
 * Logout the current authenticated session.
 * @returns Empty response when logout succeeds
 */
export async function logout() {
  const response = await apiClient.post<void>(Endpoints.logout);
  return response.data;
}
