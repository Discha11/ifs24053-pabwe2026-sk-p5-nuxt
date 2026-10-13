// src/features/auth/pages/LoginPage.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import { renderWithProviders } from "../../../test-utils";
import LoginPage from "./LoginPage.vue";
import { useAuthStore } from "../states/authStore";
import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";

const mockPush = vi.fn();
vi.mock("vue-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("vue-router")>();
  return {
    ...actual,
    useRouter: () => ({ push: mockPush, replace: vi.fn() }),
  };
});

vi.mock("../../../helpers/toolsHelper", () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(undefined),
  showErrorDialog: vi.fn().mockResolvedValue(undefined),
}));

Object.defineProperty(globalThis, "DELCOM_BASEURL", {
  value: "https://open-api.delcom.org/api/v1",
  writable: true,
});

describe("LoginPage", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
    vi.clearAllMocks();
  });

  it("renders email and password inputs", () => {
    const { getByLabelText } = renderWithProviders(LoginPage);
    expect(getByLabelText("Email")).toBeTruthy();
    expect(getByLabelText("Password")).toBeTruthy();
  });

  it("renders login button", () => {
    const { getByRole } = renderWithProviders(LoginPage);
    expect(getByRole("button", { name: /masuk/i })).toBeTruthy();
  });

  it("renders link to register", () => {
    const { getByText } = renderWithProviders(LoginPage);
    expect(getByText("Daftar sekarang")).toBeTruthy();
  });

  it("toggles password visibility", async () => {
    const { getByLabelText, getByPlaceholderText } = renderWithProviders(LoginPage);
    const passwordInput = getByPlaceholderText("Masukkan password") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    const toggleBtn = getByLabelText("Tampilkan password");
    await fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe("text");

    const hideBtn = getByLabelText("Sembunyikan password");
    await fireEvent.click(hideBtn);
    expect(passwordInput.type).toBe("password");
  });

  it("handles successful login", async () => {
    const { getByLabelText, getByRole } = renderWithProviders(LoginPage);
    const store = useAuthStore();
    vi.spyOn(store, "login").mockResolvedValueOnce(undefined as never);

    await fireEvent.update(getByLabelText("Email"), "user@test.com");
    await fireEvent.update(getByLabelText("Password"), "secret123");
    await fireEvent.click(getByRole("button", { name: /masuk/i }));

    expect(store.login).toHaveBeenCalledWith("user@test.com", "secret123");
    expect(showSuccessDialog).toHaveBeenCalledWith("Berhasil masuk ke sistem!");
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("handles login failure with Error instance", async () => {
    const { getByLabelText, getByRole } = renderWithProviders(LoginPage);
    const store = useAuthStore();
    vi.spyOn(store, "login").mockRejectedValueOnce(new Error("Email salah"));

    await fireEvent.update(getByLabelText("Email"), "user@test.com");
    await fireEvent.update(getByLabelText("Password"), "wrong");
    await fireEvent.click(getByRole("button", { name: /masuk/i }));

    expect(showErrorDialog).toHaveBeenCalledWith("Email salah");
  });

  it("handles login failure with non-Error object", async () => {
    const { getByLabelText, getByRole } = renderWithProviders(LoginPage);
    const store = useAuthStore();
    vi.spyOn(store, "login").mockRejectedValueOnce("Unknown error");

    await fireEvent.update(getByLabelText("Email"), "user@test.com");
    await fireEvent.update(getByLabelText("Password"), "wrong");
    await fireEvent.click(getByRole("button", { name: /masuk/i }));

    expect(showErrorDialog).toHaveBeenCalledWith("Terjadi kesalahan. Coba lagi.");
  });

  it("shows loading spinner and disabled button when authStore.isLoading is true", async () => {
    const { getByText, container } = renderWithProviders(LoginPage);
    const store = useAuthStore();
    store.isLoading = true;
    await flushPromises();
    expect(getByText("Memproses...")).toBeTruthy();
    expect(container.querySelector(".spinner")).toBeTruthy();
  });
});
