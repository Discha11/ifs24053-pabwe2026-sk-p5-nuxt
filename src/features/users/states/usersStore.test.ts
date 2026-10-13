// src/features/users/states/usersStore.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUsersStore } from "./usersStore";

Object.defineProperty(globalThis, "DELCOM_BASEURL", {
  value: "https://open-api.delcom.org/api/v1",
  writable: true,
});

describe("useUsersStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.stubGlobal("fetch", vi.fn());
    localStorage.setItem("accessToken", "token");
  });
  afterEach(() => vi.unstubAllGlobals());

  const mockSuccess = (data: unknown) => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success", data }),
    } as Response);
  };

  it("has correct initial state", () => {
    const store = useUsersStore();
    expect(store.users).toEqual([]);
    expect(store.profile).toBeNull();
  });

  it("fetchUsers populates users", async () => {
    mockSuccess({ users: [{ id: 1, name: "Test" }] });
    const store = useUsersStore();
    await store.fetchUsers();
    expect(store.users).toHaveLength(1);
  });

  it("throws on fetchUsers failure with Error and non-Error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "fail", message: "Unauthorized" }),
    } as Response);
    const store = useUsersStore();
    await expect(store.fetchUsers()).rejects.toThrow("Unauthorized");
    expect(store.error).toBe("Unauthorized");

    vi.mocked(fetch).mockRejectedValueOnce("Non error str");
    await expect(store.fetchUsers()).rejects.toBe("Non error str");
    expect(store.error).toBe("Gagal mengambil data pengguna");
  });

  it("fetchProfile sets profile", async () => {
    mockSuccess({ user: { id: 1, name: "Me", email: "me@me.com" } });
    const store = useUsersStore();
    await store.fetchProfile();
    expect(store.profile?.name).toBe("Me");
  });

  it("fetchProfile throws on failure and sets fallback on non-Error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Fail fetch profile"));
    const store = useUsersStore();
    await expect(store.fetchProfile()).rejects.toThrow("Fail fetch profile");
    expect(store.error).toBe("Fail fetch profile");

    vi.mocked(fetch).mockRejectedValueOnce("Fail str");
    await expect(store.fetchProfile()).rejects.toBe("Fail str");
    expect(store.error).toBe("Gagal mengambil profil");
  });

  it("updateProfile updates profile", async () => {
    mockSuccess({ user: { id: 1, name: "Updated", email: "upd@me.com" } });
    const store = useUsersStore();
    await store.updateProfile("Updated", "upd@me.com");
    expect(store.profile?.name).toBe("Updated");
  });

  it("updateProfile throws on failure and sets fallback on non-Error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Update error"));
    const store = useUsersStore();
    await expect(store.updateProfile("Name", "email@test.com")).rejects.toThrow("Update error");
    expect(store.error).toBe("Update error");

    vi.mocked(fetch).mockRejectedValueOnce("Update str error");
    await expect(store.updateProfile("Name", "email@test.com")).rejects.toBe("Update str error");
    expect(store.error).toBe("Gagal memperbarui profil");
  });

  it("uploadPhoto successfully uploads and refreshes profile", async () => {
    // uploadPhotoApi response
    mockSuccess({});
    // fetchProfile response
    mockSuccess({ user: { id: 1, name: "Me", email: "me@me.com", photo: "new_photo.jpg" } });

    const store = useUsersStore();
    const mockFile = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });
    await store.uploadPhoto(mockFile);
    expect(store.profile?.photo).toBe("new_photo.jpg");
  });

  it("uploadPhoto throws on failure and sets fallback on non-Error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Upload failed"));
    const store = useUsersStore();
    const mockFile = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });
    await expect(store.uploadPhoto(mockFile)).rejects.toThrow("Upload failed");
    expect(store.error).toBe("Upload failed");

    vi.mocked(fetch).mockRejectedValueOnce("Upload str fail");
    await expect(store.uploadPhoto(mockFile)).rejects.toBe("Upload str fail");
    expect(store.error).toBe("Gagal upload foto");
  });

  it("changePassword resolves on success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success" }),
    } as Response);
    const store = useUsersStore();
    await expect(
      store.changePassword("old", "new123", "new123")
    ).resolves.not.toThrow();
  });

  it("changePassword throws on failure and sets fallback on non-Error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Password mismatch"));
    const store = useUsersStore();
    await expect(
      store.changePassword("old", "new123", "new123")
    ).rejects.toThrow("Password mismatch");
    expect(store.error).toBe("Password mismatch");

    vi.mocked(fetch).mockRejectedValueOnce("Non error");
    await expect(
      store.changePassword("old", "new123", "new123")
    ).rejects.toBe("Non error");
    expect(store.error).toBe("Gagal mengubah password");
  });

  it("getters return correct values", () => {
    const store = useUsersStore();
    expect(store.currentProfile).toBeNull();
    expect(store.allUsers).toEqual([]);

    const user = { id: 1, name: "Me", email: "m@m.com", photo: "", created_at: "", updated_at: "" };
    store.profile = user;
    store.users = [user];
    expect(store.currentProfile).toEqual(user);
    expect(store.allUsers).toHaveLength(1);
  });
});
