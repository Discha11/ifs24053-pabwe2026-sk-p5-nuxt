// src/features/common/pages/NotFoundPage.test.ts
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../../test-utils";
import NotFoundPage from "./NotFoundPage.vue";

describe("NotFoundPage", () => {
  it("renders 404 text", () => {
    const { getByText } = renderWithProviders(NotFoundPage);
    expect(getByText("404")).toBeTruthy();
  });

  it("renders error title", () => {
    const { getByText } = renderWithProviders(NotFoundPage);
    expect(getByText("Halaman Tidak Ditemukan")).toBeTruthy();
  });

  it("renders back to dashboard link", () => {
    const { getByText } = renderWithProviders(NotFoundPage);
    expect(getByText("Kembali ke Dashboard")).toBeTruthy();
  });
});
