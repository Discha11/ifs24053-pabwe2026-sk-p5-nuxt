// src/features/auth/pages/RegisterPage.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import { renderWithProviders } from "../../../test-utils";
import RegisterPage from "./RegisterPage.vue";
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

describe("RegisterPage", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
    vi.clearAllMocks();
  });

  it("renders name, email, and password inputs", () => {
    const { getByLabelText } = renderWithProviders(RegisterPage);
    expect(getByLabelText("Nama Lengkap")).toBeTruthy();
    expect(getByLabelText("Email")).toBeTruthy();
    expect(getByLabelText("Password")).toBeTruthy();
  });

  it("renders register button", () => {
    const { getByRole } = renderWithProviders(RegisterPage);
    expect(getByRole("button", { name: /daftar/i })).toBeTruthy();
  });

  it("renders link to login", () => {
    const { getByText } = renderWithProviders(RegisterPage);
    expect(getByText("Masuk di sini")).toBeTruthy();
  });

  it("handles successful registration", async () => {
    const { getByLabelText, getByRole } = renderWithProviders(RegisterPage);
    const store = useAuthStore();
    vi.spyOn(store, "register").mockResolvedValueOnce(undefined as never);

    await fireEvent.update(getByLabelText("Nama Lengkap"), "John Doe");
    await fireEvent.update(getByLabelText("Email"), "john@example.com");
    await fireEvent.update(getByLabelText("Password"), "secret123");
    await fireEvent.click(getByRole("button", { name: /daftar/i }));

    expect(store.register).toHaveBeenCalledWith("John Doe", "john@example.com", "secret123");
    expect(showSuccessDialog).toHaveBeenCalledWith("Pendaftaran berhasil! Silakan masuk.");
    expect(mockPush).toHaveBeenCalledWith("/auth/login");
  });

  it("handles registration failure with Error instance", async () => {
    const { getByLabelText, getByRole } = renderWithProviders(RegisterPage);
    const store = useAuthStore();
    vi.spyOn(store, "register").mockRejectedValueOnce(new Error("Email sudah terdaftar"));

    await fireEvent.update(getByLabelText("Nama Lengkap"), "John Doe");
    await fireEvent.update(getByLabelText("Email"), "john@example.com");
    await fireEvent.update(getByLabelText("Password"), "secret123");
    await fireEvent.click(getByRole("button", { name: /daftar/i }));

    expect(showErrorDialog).toHaveBeenCalledWith("Email sudah terdaftar");
  });

  it("handles registration failure with non-Error object", async () => {
    const { getByLabelText, getByRole } = renderWithProviders(RegisterPage);
    const store = useAuthStore();
    vi.spyOn(store, "register").mockRejectedValueOnce("Error string");

    await fireEvent.update(getByLabelText("Nama Lengkap"), "John Doe");
    await fireEvent.update(getByLabelText("Email"), "john@example.com");
    await fireEvent.update(getByLabelText("Password"), "secret123");
    await fireEvent.click(getByRole("button", { name: /daftar/i }));

    expect(showErrorDialog).toHaveBeenCalledWith("Terjadi kesalahan. Coba lagi.");
  });

  it("shows loading spinner and disabled button when authStore.isLoading is true", async () => {
    const { getByText, container } = renderWithProviders(RegisterPage);
    const store = useAuthStore();
    store.isLoading = true;
    await flushPromises();
    expect(getByText("Memproses...")).toBeTruthy();
    expect(container.querySelector(".spinner")).toBeTruthy();
  });
});
