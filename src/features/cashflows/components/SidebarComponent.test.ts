// src/features/cashflows/components/SidebarComponent.test.ts
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "../../../test-utils";
import SidebarComponent from "./SidebarComponent.vue";

let mockPath = "/";
vi.mock("vue-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("vue-router")>();
  return {
    ...actual,
    useRoute: () => ({ path: mockPath }),
  };
});

describe("SidebarComponent", () => {
  beforeEach(() => {
    mockPath = "/";
  });

  it("renders Ringkasan Arus Kas link", () => {
    const { getByText } = renderWithProviders(SidebarComponent);
    expect(getByText("Ringkasan Arus Kas")).toBeTruthy();
  });

  it("renders Direktori Pengguna link", () => {
    const { getByText } = renderWithProviders(SidebarComponent);
    expect(getByText("Direktori Pengguna")).toBeTruthy();
  });

  it("renders Profil Saya link", () => {
    const { getByText } = renderWithProviders(SidebarComponent);
    expect(getByText("Profil Saya")).toBeTruthy();
  });

  it("nav-home has active class on / route", () => {
    const { getByText } = renderWithProviders(SidebarComponent);
    const link = getByText("Ringkasan Arus Kas").closest("a");
    expect(link?.classList.contains("active")).toBe(true);
  });

  it("nav-home has active class on /cash-flows/* subroute", () => {
    mockPath = "/cash-flows/123";
    const { getByText } = renderWithProviders(SidebarComponent);
    const link = getByText("Ringkasan Arus Kas").closest("a");
    expect(link?.classList.contains("active")).toBe(true);
  });

  it("nav-users has active class on /users route", () => {
    mockPath = "/users";
    const { getByText } = renderWithProviders(SidebarComponent);
    const link = getByText("Direktori Pengguna").closest("a");
    expect(link?.classList.contains("active")).toBe(true);
  });
});
