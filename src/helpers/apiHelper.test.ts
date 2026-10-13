// src/helpers/apiHelper.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  fetchAPI,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
} from "./apiHelper";

// Mock global DELCOM_BASEURL
Object.defineProperty(globalThis, "DELCOM_BASEURL", {
  value: "https://open-api.delcom.org/api/v1",
  writable: true,
});

describe("getAccessToken", () => {
  beforeEach(() => localStorage.clear());

  it("returns null when no token", () => {
    expect(getAccessToken()).toBeNull();
  });

  it("returns token after putting", () => {
    putAccessToken("abc123");
    expect(getAccessToken()).toBe("abc123");
  });
});

describe("putAccessToken", () => {
  it("stores token in localStorage", () => {
    putAccessToken("mytoken");
    expect(localStorage.getItem("accessToken")).toBe("mytoken");
  });
});

describe("removeAccessToken", () => {
  it("removes token from localStorage", () => {
    localStorage.setItem("accessToken", "token");
    removeAccessToken();
    expect(localStorage.getItem("accessToken")).toBeNull();
  });
});

describe("fetchAPI", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns data on success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success", data: { id: 1 } }),
    } as Response);

    const result = await fetchAPI("/test", { useAuth: false });
    expect(result).toEqual({ id: 1 });
  });

  it("throws error on fail status", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "fail", message: "Tidak valid" }),
    } as Response);

    await expect(fetchAPI("/test", { useAuth: false })).rejects.toThrow("Tidak valid");
  });

  it("throws error with default message on fail status when message is omitted", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "fail" }),
    } as Response);

    await expect(fetchAPI("/test", { useAuth: false })).rejects.toThrow("Terjadi kesalahan pada server");
  });

  it("includes Bearer token when token exists", async () => {
    putAccessToken("mytoken");
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success", data: {} }),
    } as Response);

    await fetchAPI("/test");
    const call = vi.mocked(fetch).mock.calls[0];
    expect((call?.[1] as RequestInit | undefined)?.headers).toMatchObject({
      Authorization: "Bearer mytoken",
    });
  });

  it("sends FormData without Content-Type header", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success", data: {} }),
    } as Response);

    const formData = new FormData();
    await fetchAPI("/upload", {
      method: "POST",
      body: formData,
      isFormData: true,
      useAuth: false,
    });

    const headers = (vi.mocked(fetch).mock.calls[0]?.[1] as RequestInit | undefined)
      ?.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBeUndefined();
  });
});

describe("convenience wrappers", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.clear();
  });
  afterEach(() => vi.unstubAllGlobals());

  const mockSuccess = (data: unknown) => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success", data }),
    } as Response);
  };

  it("apiGet calls GET", async () => {
    mockSuccess({ items: [] });
    await apiGet("/items");
    expect(vi.mocked(fetch).mock.calls[0]?.[1]).toMatchObject({ method: "GET" });
  });

  it("apiPost calls POST with body", async () => {
    mockSuccess({ id: 1 });
    await apiPost("/items", { name: "test" });
    expect(vi.mocked(fetch).mock.calls[0]?.[1]).toMatchObject({ method: "POST" });
  });

  it("apiPut calls PUT", async () => {
    mockSuccess({});
    await apiPut("/items/1", { name: "updated" });
    expect(vi.mocked(fetch).mock.calls[0]?.[1]).toMatchObject({ method: "PUT" });
  });

  it("apiDelete calls DELETE", async () => {
    mockSuccess({});
    await apiDelete("/items/1");
    expect(vi.mocked(fetch).mock.calls[0]?.[1]).toMatchObject({ method: "DELETE" });
  });
});
