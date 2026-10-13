// src/features/auth/layouts/AuthLayout.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../../../test-utils";
import AuthLayout from "./AuthLayout.vue";

const mockReplace = vi.fn();
vi.mock("vue-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("vue-router")>();
  return {
    ...actual,
    useRouter: () => ({ replace: mockReplace }),
  };
});

describe("AuthLayout", () => {
  beforeEach(() => {
    localStorage.clear();
    mockReplace.mockClear();
  });

  it("renders slot content", () => {
    const { getByText } = renderWithProviders(AuthLayout, {
      slots: { default: "<p>Slot content</p>" },
    });
    expect(getByText("Slot content")).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirects to / when user already has access token", () => {
    localStorage.setItem("accessToken", "token123");
    renderWithProviders(AuthLayout);
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("renders brand name", () => {
    const { getByText } = renderWithProviders(AuthLayout);
    expect(getByText("Delcom Todo")).toBeTruthy();
  });

  it("renders footer text", () => {
    const { container } = renderWithProviders(AuthLayout);
    expect(container.innerHTML).toContain("Delcom");
  });
});
