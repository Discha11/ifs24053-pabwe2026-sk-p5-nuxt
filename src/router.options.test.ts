// src/router.options.test.ts
import { describe, it, expect } from "vitest";
import routerOptions from "./router.options";

describe("router.options", () => {
  it("exports an object with routes function", () => {
    expect(typeof routerOptions.routes).toBe("function");
  });

  it("routes function returns routes array", () => {
    const result = routerOptions.routes?.([] as never);
    expect(Array.isArray(result)).toBe(true);
    expect((result as unknown[]).length).toBeGreaterThan(0);
  });
});
