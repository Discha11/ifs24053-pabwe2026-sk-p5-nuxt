// src/features/cashflows/components/NavbarComponent.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import { renderWithProviders } from "../../../test-utils";
import NavbarComponent from "./NavbarComponent.vue";
import { useAuthStore } from "../../auth/states/authStore";
import { useUsersStore } from "../../users/states/usersStore";
import { showConfirmDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

const mockPush = vi.fn();
vi.mock("vue-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("vue-router")>();
  return {
    ...actual,
    useRouter: () => ({ push: mockPush, replace: vi.fn() }),
  };
});

vi.mock("../../../helpers/toolsHelper", () => ({
  showConfirmDialog: vi.fn(),
  showSuccessDialog: vi.fn().mockResolvedValue(undefined),
}));

Object.defineProperty(globalThis, "DELCOM_BASEURL", {
  value: "https://open-api.delcom.org/api/v1",
  writable: true,
});

describe("NavbarComponent", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    mockPush.mockClear();
    vi.clearAllMocks();
    localStorage.setItem("accessToken", "token");
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        status: "success",
        data: { user: { id: 1, name: "Test User", email: "t@t.com", photo: "https://example.com/avatar.png", created_at: "", updated_at: "" } },
      }),
    } as Response);
  });

  it("renders app name", () => {
    const { getByText } = renderWithProviders(NavbarComponent);
    expect(getByText("Delcom Todo")).toBeTruthy();
  });

  it("renders logout button", () => {
    const { getByText } = renderWithProviders(NavbarComponent);
    expect(getByText("Keluar")).toBeTruthy();
  });

  it("renders Online badge", () => {
    const { getByText } = renderWithProviders(NavbarComponent);
    expect(getByText("Online")).toBeTruthy();
  });

  it("sets fallback avatar when image load fails", async () => {
    const { findByAltText } = renderWithProviders(NavbarComponent);
    const img = await findByAltText("Test User") as HTMLImageElement;
    await fireEvent.error(img);
    expect(img.src).toContain("ui-avatars.com");
  });

  it("uses U as fallback avatar letter when profile name is undefined", async () => {
    const { findByAltText } = renderWithProviders(NavbarComponent);
    const usersStore = useUsersStore();
    const img = (await findByAltText("Test User")) as HTMLImageElement;
    usersStore.profile = null;
    await fireEvent.error(img);
    expect(img.src).toContain("name=U");
  });

  it("does not logout if confirmation is cancelled", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(false);
    const { getByText } = renderWithProviders(NavbarComponent);
    const logoutBtn = getByText("Keluar");
    await fireEvent.click(logoutBtn);
    await flushPromises();

    expect(showConfirmDialog).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("logs out and redirects to login when confirmed", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    const { getByText } = renderWithProviders(NavbarComponent);
    const authStore = useAuthStore();
    const logoutSpy = vi.spyOn(authStore, "logout").mockResolvedValueOnce(undefined);

    const logoutBtn = getByText("Keluar");
    await fireEvent.click(logoutBtn);
    await flushPromises();

    expect(showConfirmDialog).toHaveBeenCalled();
    expect(logoutSpy).toHaveBeenCalled();
    expect(showSuccessDialog).toHaveBeenCalledWith("Berhasil keluar!");
    expect(mockPush).toHaveBeenCalledWith("/auth/login");
  });
});
