import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";

import type { LoginRequest, RefreshTokenRequestBody } from "@/types/request/auth";
import type { LoginResponse, MeResponse } from "@/types/response/auth";

/**
 * Login a user with username and password.
 * @param payload Login credentials
 * @returns Login response containing access and refresh tokens
 */
export function login(payload: LoginRequest) {
  return apiClient.post<LoginResponse>(Endpoints.login, payload).then((response) => response.data);
}

/**
 * Fetch current user profile from active session token.
 * @returns User profile information
 */
export function fetchMe() {
  return apiClient.get<MeResponse>(Endpoints.me).then((response) => response.data);
}

/**
 * Refresh authentication tokens using a refresh token.
 * @param payload Refresh token payload
 * @returns Next access and refresh tokens
 */
export function refreshToken(payload: RefreshTokenRequestBody) {
  return apiClient.post<LoginResponse>(Endpoints.refresh, payload).then((response) => response.data);
}

/**
 * Logout the current authenticated session.
 * @returns Empty response when logout succeeds
 */
export function logout() {
  return apiClient.post<void>(Endpoints.logout).then((response) => response.data);
}
