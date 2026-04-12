import { Endpoints } from "@/network/endpoints";
import type { AuthSession } from "@/features/auth/types";
import { useAuthStore } from "@/stores/auth-store";
import axios, { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

function isAuthEndpoint(url?: string) {
  if (!url) return false;
  return [Endpoints.login, Endpoints.refresh, Endpoints.logout].some((endpoint) =>
    url.includes(endpoint)
  );
}

function handleUnauthorized() {
  const { clearSession } = useAuthStore.getState();
  clearSession();

  if (typeof window !== "undefined" && window.location.pathname !== "/auth") {
    window.location.replace("/auth");
  }
}

export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<AuthSession> | null = null;
let lastRateLimitToastAt = 0;

function getRateLimitMessage(error: AxiosError) {
  const retryAfterValue = error.response?.headers["retry-after"];
  const retryAfterSeconds = Number.parseInt(String(retryAfterValue ?? ""), 10);

  if (Number.isNaN(retryAfterSeconds) || retryAfterSeconds <= 0) {
    return "Too many requests. Please wait and try again.";
  }

  const secondsLabel = retryAfterSeconds === 1 ? "second" : "seconds";
  return `Too many requests. Please wait ${retryAfterSeconds} ${secondsLabel} and try again.`;
}

function notifyRateLimit(error: AxiosError) {
  if (typeof window === "undefined") {
    return;
  }

  const now = Date.now();

  // Avoid stacking identical 429 toasts when multiple requests fail together.
  if (now - lastRateLimitToastAt < 3000) {
    return;
  }

  lastRateLimitToastAt = now;
  toast.error(getRateLimitMessage(error));
}

function refreshAccessToken(refreshToken: string) {
  if (!refreshPromise) {
    // Use a separate client here so the refresh request does not trigger the same auth interceptor flow.
    refreshPromise = refreshClient
      .post<AuthSession>(Endpoints.refresh, { refreshToken })
      .then((response) => response.data)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  const headers = AxiosHeaders.from(config.headers);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  config.headers = headers;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const isUnauthorized = error.response?.status === 401;
    const isRateLimited = error.response?.status === 429;

    if (isRateLimited) {
      notifyRateLimit(error);
      return Promise.reject(error);
    }

    if (
      !originalRequest ||
      !isUnauthorized ||
      originalRequest._retry ||
      // Avoid retry loops when an authentication endpoint itself fails with 401.
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    const { refreshToken, setSession } = useAuthStore.getState();
    if (!refreshToken) {
      handleUnauthorized();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshedSession = await refreshAccessToken(refreshToken);
      const { token, refreshToken: nextRefreshToken } = refreshedSession;

      setSession(token, nextRefreshToken);

      const retryHeaders = AxiosHeaders.from(originalRequest.headers);
      retryHeaders.set("Authorization", `Bearer ${token}`);
      originalRequest.headers = retryHeaders;

      return apiClient(originalRequest);
    } catch (refreshError) {
      handleUnauthorized();
      return Promise.reject(refreshError);
    }
  }
);
