// src/helpers/apiHelper.ts

const BASE_URL: string = DELCOM_BASEURL;

// ── Token Utilities ──────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

export function putAccessToken(token: string): void {
  localStorage.setItem("accessToken", token);
}

export function removeAccessToken(): void {
  localStorage.removeItem("accessToken");
}

// ── HTTP Helpers ─────────────────────────────────────────────────────────────

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  useAuth?: boolean;
  isFormData?: boolean;
}

export async function fetchAPI<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers: extraHeaders = {},
    useAuth = true,
    isFormData = false,
  } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...extraHeaders,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (useAuth) {
    const token = getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: isFormData
      ? (body as FormData)
      : body !== undefined
        ? JSON.stringify(body)
        : undefined,
  });

  const data = (await response.json()) as {
    status: string;
    message: string;
    data?: T;
  };

  if (data.status !== "success") {
    throw new Error(data.message ?? "Terjadi kesalahan pada server");
  }

  return (data.data as T) ?? (data as unknown as T);
}

// ── Named convenience wrappers ────────────────────────────────────────────────

export function apiGet<T = unknown>(endpoint: string): Promise<T> {
  return fetchAPI<T>(endpoint, { method: "GET" });
}

export function apiPost<T = unknown>(
  endpoint: string,
  body: unknown,
  isFormData = false
): Promise<T> {
  return fetchAPI<T>(endpoint, { method: "POST", body, isFormData });
}

export function apiPut<T = unknown>(
  endpoint: string,
  body: unknown
): Promise<T> {
  return fetchAPI<T>(endpoint, { method: "PUT", body });
}

export function apiDelete<T = unknown>(endpoint: string): Promise<T> {
  return fetchAPI<T>(endpoint, { method: "DELETE" });
}
