// src/features/users/pages/ProfilePage.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { fireEvent } from "@testing-library/vue";
import { renderWithProviders } from "../../../test-utils";
import ProfilePage from "./ProfilePage.vue";
import { useUsersStore } from "../states/usersStore";
import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";

vi.mock("../../../helpers/toolsHelper", () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(undefined),
  showErrorDialog: vi.fn().mockResolvedValue(undefined),
}));

Object.defineProperty(globalThis, "DELCOM_BASEURL", {
  value: "https://open-api.delcom.org/api/v1",
  writable: true,
});

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.clearAllMocks();
    localStorage.setItem("accessToken", "token");
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        status: "success",
        data: {
          user: { id: 1, name: "Test User", email: "test@example.com", photo: "https://example.com/avatar.png", created_at: "", updated_at: "" },
        },
      }),
    } as Response);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("renders page title and profile data", async () => {
    const { getByText } = renderWithProviders(ProfilePage);
    await flushPromises();
    expect(getByText("Profil Saya")).toBeTruthy();
    expect(getByText("Test User")).toBeTruthy();
    expect(getByText("test@example.com")).toBeTruthy();
  });

  it("handles avatar image error fallback", async () => {
    const { container } = renderWithProviders(ProfilePage);
    await flushPromises();
    const img = container.querySelector(".avatar-img") as HTMLImageElement;
    expect(img).toBeTruthy();
    if (img) {
      await fireEvent.error(img);
      expect(img.src).toContain("ui-avatars.com");
    }
  });

  it("handles photo upload: no file, success, and error paths", async () => {
    const { container } = renderWithProviders(ProfilePage);
    await flushPromises();
    const store = useUsersStore();
    const fileInput = container.querySelector("#photo-input") as HTMLInputElement;

    // 1. No file selected
    await fireEvent.change(fileInput, { target: { files: [] } });
    await flushPromises();

    // 2. File upload success
    const uploadSpy = vi.spyOn(store, "uploadPhoto").mockResolvedValueOnce(undefined as never);
    const mockFile = new File(["test"], "photo.png", { type: "image/png" });
    await fireEvent.change(fileInput, { target: { files: [mockFile] } });
    await flushPromises();
    expect(uploadSpy).toHaveBeenCalledWith(mockFile);
    expect(showSuccessDialog).toHaveBeenCalledWith("Foto profil berhasil diperbarui!");

    // 3. File upload error with Error instance
    vi.spyOn(store, "uploadPhoto").mockRejectedValueOnce(new Error("File terlalu besar"));
    await fireEvent.change(fileInput, { target: { files: [mockFile] } });
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("File terlalu besar");

    // 4. File upload error with non-Error
    vi.spyOn(store, "uploadPhoto").mockRejectedValueOnce("Str error");
    await fireEvent.change(fileInput, { target: { files: [mockFile] } });
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal upload foto");
  });

  it("handles update profile: success and error paths", async () => {
    const { container } = renderWithProviders(ProfilePage);
    await flushPromises();
    const store = useUsersStore();

    // 1. Success
    const updateSpy = vi.spyOn(store, "updateProfile").mockResolvedValueOnce(undefined as never);
    const nameInput = container.querySelector("#profile-name") as HTMLInputElement;
    const emailInput = container.querySelector("#profile-email") as HTMLInputElement;
    await fireEvent.update(nameInput, "New Name");
    await fireEvent.update(emailInput, "new@example.com");

    const updateForm = container.querySelector("#update-profile-form") as HTMLFormElement;
    await fireEvent.submit(updateForm);
    await flushPromises();

    expect(updateSpy).toHaveBeenCalledWith("New Name", "new@example.com");
    expect(showSuccessDialog).toHaveBeenCalledWith("Profil berhasil diperbarui!");

    // 2. Error with Error instance
    vi.spyOn(store, "updateProfile").mockRejectedValueOnce(new Error("Update fail"));
    await fireEvent.submit(updateForm);
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Update fail");

    // 3. Error with non-Error
    vi.spyOn(store, "updateProfile").mockRejectedValueOnce("Update str fail");
    await fireEvent.submit(updateForm);
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal memperbarui profil");
  });

  it("handles change password: mismatch, success, and error paths", async () => {
    const { container } = renderWithProviders(ProfilePage);
    await flushPromises();
    const store = useUsersStore();

    const currentInput = container.querySelector("#current-password") as HTMLInputElement;
    const newInput = container.querySelector("#new-password") as HTMLInputElement;
    const confirmInput = container.querySelector("#confirm-password") as HTMLInputElement;
    const passwordForm = container.querySelector("#change-password-form") as HTMLFormElement;

    // 1. Password mismatch
    await fireEvent.update(currentInput, "oldpass");
    await fireEvent.update(newInput, "newpass123");
    await fireEvent.update(confirmInput, "different123");
    await fireEvent.submit(passwordForm);
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Konfirmasi password tidak cocok!");

    // 2. Password success
    const changePassSpy = vi.spyOn(store, "changePassword").mockResolvedValueOnce(undefined as never);
    await fireEvent.update(confirmInput, "newpass123");
    await fireEvent.submit(passwordForm);
    await flushPromises();
    expect(changePassSpy).toHaveBeenCalledWith("oldpass", "newpass123", "newpass123");
    expect(showSuccessDialog).toHaveBeenCalledWith("Password berhasil diubah!");
    expect(currentInput.value).toBe("");
    expect(newInput.value).toBe("");
    expect(confirmInput.value).toBe("");

    // 3. Error with Error instance
    await fireEvent.update(currentInput, "oldpass");
    await fireEvent.update(newInput, "newpass123");
    await fireEvent.update(confirmInput, "newpass123");
    vi.spyOn(store, "changePassword").mockRejectedValueOnce(new Error("Password salah"));
    await fireEvent.submit(passwordForm);
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Password salah");

    // 4. Error with non-Error
    vi.spyOn(store, "changePassword").mockRejectedValueOnce("Error str");
    await fireEvent.submit(passwordForm);
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal mengubah password");
  });

  it("renders loading spinners when store.isLoading is true", async () => {
    renderWithProviders(ProfilePage);
    await flushPromises();
    const store = useUsersStore();
    store.isLoading = true;
    await flushPromises();
    expect(document.querySelectorAll(".spinner").length).toBeGreaterThanOrEqual(1);
  });

  it("falls back to initial U when profile has no name on avatar error", async () => {
    const { container } = renderWithProviders(ProfilePage);
    await flushPromises();
    const store = useUsersStore();
    const img = container.querySelector(".avatar-img") as HTMLImageElement;
    store.profile = null;
    await fireEvent.error(img);
    expect(img.src).toContain("name=U");
  });
});
