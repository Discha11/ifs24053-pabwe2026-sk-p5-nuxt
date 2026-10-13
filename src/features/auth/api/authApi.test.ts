// src/features/auth/api/authApi.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { loginApi, registerApi, logoutApi } from "./authApi";

Object.defineProperty(globalThis, "DELCOM_BASEURL", {
  value: "https://open-api.delcom.org/api/v1",
  writable: true,
});

describe("loginApi", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.clear();
  });
  afterEach(() => vi.unstubAllGlobals());

  it("returns user and token on success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({
        status: "success",
        data: {
          user: { id: 1, name: "Test", email: "test@test.com" },
          token: "tok123",
        },
      }),
    } as Response);

    const result = await loginApi("test@test.com", "password");
    expect(result.token).toBe("tok123");
    expect(result.user.name).toBe("Test");
  });

  it("throws on failure", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "fail", message: "Invalid" }),
    } as Response);

    await expect(loginApi("bad@test.com", "wrong")).rejects.toThrow("Invalid");
  });
});

describe("registerApi", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.clear();
  });
  afterEach(() => vi.unstubAllGlobals());

  it("resolves on success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success", message: "Registered" }),
    } as Response);

    await expect(
      registerApi("Test", "test@test.com", "password")
    ).resolves.not.toThrow();
  });

  it("throws on failure", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "fail", message: "Email sudah digunakan" }),
    } as Response);

    await expect(
      registerApi("Test", "dup@test.com", "password")
    ).rejects.toThrow("Email sudah digunakan");
  });
});

describe("logoutApi", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.setItem("accessToken", "token");
  });
  afterEach(() => vi.unstubAllGlobals());

  it("resolves on success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success" }),
    } as Response);

    await expect(logoutApi()).resolves.not.toThrow();
  });
});
