// src/features/auth/states/authStore.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "./authStore";

Object.defineProperty(globalThis, "DELCOM_BASEURL", {
  value: "https://open-api.delcom.org/api/v1",
  writable: true,
});

describe("useAuthStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.stubGlobal("fetch", vi.fn());
    localStorage.clear();
  });
  afterEach(() => vi.unstubAllGlobals());

  it("has correct initial state", () => {
    const store = useAuthStore();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.isLoading).toBe(false);
  });

  it("login sets user and token", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({
        status: "success",
        data: {
          user: { id: 1, name: "Test", email: "test@test.com" },
          token: "tok123",
        },
      }),
    } as Response);

    const store = useAuthStore();
    await store.login("test@test.com", "password");

    expect(store.isAuthenticated).toBe(true);
    expect(store.user?.name).toBe("Test");
    expect(localStorage.getItem("accessToken")).toBe("tok123");
  });

  it("login throws on failure and sets error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "fail", message: "Invalid credentials" }),
    } as Response);

    const store = useAuthStore();
    await expect(store.login("bad@test.com", "wrong")).rejects.toThrow();
    expect(store.error).toBe("Invalid credentials");
  });

  it("login sets fallback error when non-Error is thrown", async () => {
    vi.mocked(fetch).mockRejectedValueOnce("Network string failure");

    const store = useAuthStore();
    await expect(store.login("bad@test.com", "wrong")).rejects.toBe("Network string failure");
    expect(store.error).toBe("Login gagal");
  });

  it("register resolves on success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success" }),
    } as Response);

    const store = useAuthStore();
    await expect(
      store.register("Test", "test@test.com", "pass")
    ).resolves.not.toThrow();
  });

  it("register throws on failure and sets error message", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "fail", message: "Email sudah ada" }),
    } as Response);

    const store = useAuthStore();
    await expect(
      store.register("Test", "test@test.com", "pass")
    ).rejects.toThrow("Email sudah ada");
    expect(store.error).toBe("Email sudah ada");
  });

  it("register sets fallback error when non-Error is thrown", async () => {
    vi.mocked(fetch).mockRejectedValueOnce("String error");

    const store = useAuthStore();
    await expect(
      store.register("Test", "test@test.com", "pass")
    ).rejects.toBe("String error");
    expect(store.error).toBe("Registrasi gagal");
  });

  it("logout clears token and user", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success" }),
    } as Response);

    localStorage.setItem("accessToken", "token");
    const store = useAuthStore();
    store.user = { id: 1, name: "Test", email: "t@t.com", email_verified_at: null, created_at: "", updated_at: "" };
    store.isAuthenticated = true;

    await store.logout();
    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("logout ignores errors from logoutApi silently", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network failed"));
    const store = useAuthStore();
    store.user = { id: 1, name: "Test", email: "t@t.com", email_verified_at: null, created_at: "", updated_at: "" };
    store.isAuthenticated = true;
    await expect(store.logout()).resolves.toBeUndefined();
    expect(store.isAuthenticated).toBe(false);
  });

  it("checkAuth returns true when token exists", () => {
    localStorage.setItem("accessToken", "token");
    const store = useAuthStore();
    expect(store.checkAuth()).toBe(true);
    expect(store.isAuthenticated).toBe(true);
  });

  it("checkAuth returns false when no token", () => {
    const store = useAuthStore();
    expect(store.checkAuth()).toBe(false);
  });

  it("setUser sets user and authenticated state", () => {
    const store = useAuthStore();
    const user = { id: 1, name: "Test", email: "t@t.com", email_verified_at: null, created_at: "", updated_at: "" };
    store.setUser(user);
    expect(store.user).toEqual(user);
    expect(store.isAuthenticated).toBe(true);
  });

  it("getters return correct values", () => {
    const store = useAuthStore();
    expect(store.currentUser).toBeNull();
    expect(store.isLoggedIn).toBe(false);

    const user = { id: 1, name: "Test", email: "t@t.com", email_verified_at: null, created_at: "", updated_at: "" };
    store.setUser(user);
    expect(store.currentUser).toEqual(user);
    expect(store.isLoggedIn).toBe(true);
  });
});
