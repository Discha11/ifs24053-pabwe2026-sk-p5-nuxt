// src/features/users/api/userApi.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getAllUsersApi,
  getUserByIdApi,
  getProfileApi,
  updateProfileApi,
  uploadPhotoApi,
  changePasswordApi,
} from "./userApi";

Object.defineProperty(globalThis, "DELCOM_BASEURL", {
  value: "https://open-api.delcom.org/api/v1",
  writable: true,
});

const mockFetch = (data: unknown) => {
  vi.mocked(fetch).mockResolvedValueOnce({
    json: async () => ({ status: "success", data }),
  } as Response);
};

describe("userApi", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.setItem("accessToken", "token");
  });
  afterEach(() => vi.unstubAllGlobals());

  it("getAllUsersApi returns users array", async () => {
    mockFetch({ users: [{ id: 1, name: "Test" }] });
    const result = await getAllUsersApi();
    expect(result.users).toHaveLength(1);
  });

  it("getUserByIdApi returns single user", async () => {
    mockFetch({ user: { id: 2, name: "Test2" } });
    const result = await getUserByIdApi(2);
    expect(result.user.id).toBe(2);
  });

  it("getProfileApi returns current user", async () => {
    mockFetch({ user: { id: 1, name: "Me" } });
    const result = await getProfileApi();
    expect(result.user.name).toBe("Me");
  });

  it("updateProfileApi returns updated user", async () => {
    mockFetch({ user: { id: 1, name: "Updated" } });
    const result = await updateProfileApi("Updated", "u@u.com");
    expect(result.user.name).toBe("Updated");
  });

  it("uploadPhotoApi resolves on success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success" }),
    } as Response);
    const file = new File(["img"], "photo.jpg", { type: "image/jpeg" });
    await expect(uploadPhotoApi(file)).resolves.not.toThrow();
  });

  it("changePasswordApi resolves on success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success" }),
    } as Response);
    await expect(
      changePasswordApi("old", "new123", "new123")
    ).resolves.not.toThrow();
  });

  it("throws on API error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "fail", message: "Unauthorized" }),
    } as Response);
    await expect(getAllUsersApi()).rejects.toThrow("Unauthorized");
  });
});
