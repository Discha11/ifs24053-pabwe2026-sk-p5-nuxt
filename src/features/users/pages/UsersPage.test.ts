// src/features/users/pages/UsersPage.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent } from "@testing-library/vue";
import { renderWithProviders } from "../../../test-utils";
import UsersPage from "./UsersPage.vue";

vi.mock("../../../helpers/toolsHelper", () => ({
  formatDate: (d: string) => d,
}));

Object.defineProperty(globalThis, "DELCOM_BASEURL", {
  value: "https://open-api.delcom.org/api/v1",
  writable: true,
});

describe("UsersPage", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.setItem("accessToken", "token");
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        status: "success",
        data: {
          users: [
            { id: 1, name: "Test User", email: "test@test.com", photo: "https://example.com/photo.png", created_at: "", updated_at: "" },
          ],
        },
      }),
    } as Response);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("renders page title and subtitle", () => {
    const { getByText } = renderWithProviders(UsersPage);
    expect(getByText("Direktori Pengguna")).toBeTruthy();
    expect(getByText("Seluruh pengguna yang terdaftar dalam sistem")).toBeTruthy();
  });

  it("handles avatar image error and falls back to ui-avatars", async () => {
    const { findByAltText } = renderWithProviders(UsersPage);
    const img = await findByAltText("Test User") as HTMLImageElement;
    expect(img).toBeTruthy();
    await fireEvent.error(img);
    expect(img.src).toContain("ui-avatars.com");
  });
});
