import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "../schema/index.d.ts";
import type { Middleware } from "openapi-fetch";
import type { LoginResponse } from "@/types/kubb/gen";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  setSession,
} from "./auth-storage";

const AUTH_PATH = "/auth";
const LOGIN_PATH = "/api/v1/auth/login";
const REFRESH_PATH = "/api/v1/auth/refresh";
const BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "").replace(/\/$/, "");

let ongoingRefresh: Promise<string | null> | null = null;
const requestSnapshots = new Map<string, Request>();

const isBrowser = () => typeof window !== "undefined";
const isAuthPath = (path: string) => path === LOGIN_PATH || path === REFRESH_PATH;

function toBackendUrl(path: string) {
  return BASE_URL ? `${BASE_URL}${path}` : path;
}

function redirectToAuth() {
  if (!isBrowser()) return;
  if (window.location.pathname.startsWith(AUTH_PATH)) return;
  window.location.assign(AUTH_PATH);
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch(toBackendUrl(REFRESH_PATH), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as LoginResponse;
  if (!data?.token || !data?.refreshToken) return null;

  setSession(data);
  return data.token;
}

async function refreshWithLock() {
  if (!ongoingRefresh) {
    ongoingRefresh = refreshAccessToken().finally(() => {
      ongoingRefresh = null;
    });
  }

  return ongoingRefresh;
}

const authMiddleware: Middleware = {
  onRequest({ request, schemaPath, id }) {
    requestSnapshots.set(id, request.clone());

    if (isAuthPath(schemaPath)) {
      return;
    }

    const accessToken = getAccessToken();
    if (!accessToken || request.headers.has("Authorization")) {
      return;
    }

    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    return new Request(request, { headers });
  },
  async onResponse({ response, schemaPath, id, request }) {
    if (!isBrowser() || isAuthPath(schemaPath) || response.status !== 401) {
      requestSnapshots.delete(id);
      return;
    }

    const newAccessToken = await refreshWithLock();
    if (!newAccessToken) {
      requestSnapshots.delete(id);
      clearSession();
      redirectToAuth();
      return response;
    }

    const retrySource = requestSnapshots.get(id) ?? request;
    requestSnapshots.delete(id);

    const retryHeaders = new Headers(retrySource.headers);
    retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

    const retryRequest = new Request(retrySource, { headers: retryHeaders });
    return fetch(retryRequest);
  },
  onError({ error, id }) {
    requestSnapshots.delete(id);
    return error instanceof Error ? error : undefined;
  },
};

export const fetchClient = createFetchClient<paths>({ baseUrl: BASE_URL });
fetchClient.use(authMiddleware);

export const $api = createClient(fetchClient);
