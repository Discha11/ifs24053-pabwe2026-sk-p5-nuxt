// src/App.test.ts
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "./test-utils";
import { defineComponent, h } from "vue";

// Simple App-level test: router + pinia integration
const AppShell = defineComponent({
  name: "AppShell",
  setup() {
    return () => h("div", { id: "app" }, "App Works");
  },
});

describe("App integration", () => {
  it("renders app shell with router and pinia", () => {
    const { getByText } = renderWithProviders(AppShell);
    expect(getByText("App Works")).toBeTruthy();
  });

  it("renderWithProviders mounts without errors", () => {
    const { container } = renderWithProviders(AppShell);
    expect(container.querySelector("#app")).toBeTruthy();
  });
});
