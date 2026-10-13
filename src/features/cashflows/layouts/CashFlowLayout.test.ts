// src/features/cashflows/layouts/CashFlowLayout.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../../test-utils";
import CashFlowLayout from "./CashFlowLayout.vue";

const mockReplace = vi.fn();
vi.mock("vue-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("vue-router")>();
  return {
    ...actual,
    useRouter: () => ({ replace: mockReplace }),
    useRoute: () => ({ path: "/" }),
  };
});

vi.mock("../../../helpers/toolsHelper", () => ({
  showConfirmDialog: vi.fn().mockResolvedValue(false),
  showSuccessDialog: vi.fn().mockResolvedValue(undefined),
}));

Object.defineProperty(globalThis, "DELCOM_BASEURL", {
  value: "https://open-api.delcom.org/api/v1",
  writable: true,
});

describe("CashFlowLayout", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    mockReplace.mockClear();
    localStorage.clear();
    localStorage.setItem("accessToken", "token");
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        status: "success",
        data: {
          user: {
            id: 1,
            name: "Test",
            email: "t@t.com",
            photo: "",
            created_at: "",
            updated_at: "",
          },
        },
      }),
    } as Response);
  });

  it("redirects to /auth/login when no token exists", () => {
    localStorage.clear();
    renderWithProviders(CashFlowLayout);
    expect(mockReplace).toHaveBeenCalledWith("/auth/login");
  });

  it("renders navbar and sidebar", () => {
    const { getByText } = renderWithProviders(CashFlowLayout);
    expect(getByText("Delcom Todo")).toBeTruthy();
    expect(getByText("Ringkasan Arus Kas")).toBeTruthy();
  });

  it("renders RouterView slot area", () => {
    const { container } = renderWithProviders(CashFlowLayout);
    expect(container.querySelector(".layout-content")).toBeTruthy();
  });
});
