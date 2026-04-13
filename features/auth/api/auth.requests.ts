import { apiClient } from "@/network/axios";
import { Endpoints } from "@/network/endpoints";

import type {
  AuthSession,
  LoginRequest,
  LogoutResponse,
  MeResponse,
  RefreshTokenPayload,
} from "@/features/auth/types";

export async function login(payload: LoginRequest) {
  const response = await apiClient.post<AuthSession>(Endpoints.login, payload);
  return response.data;
}

export async function fetchMe() {
  const response = await apiClient.get<MeResponse>(Endpoints.me);
  return response.data;
}

export async function refreshToken(payload: RefreshTokenPayload) {
  const response = await apiClient.post<AuthSession>(Endpoints.refresh, payload);
  return response.data;
}

export async function logout() {
  const response = await apiClient.post<LogoutResponse>(Endpoints.logout);
  return response.data;
}
