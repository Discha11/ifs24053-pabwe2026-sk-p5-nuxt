// src/routes.test.ts
import { describe, it, expect } from "vitest";
import routes from "./routes";

describe("routes", () => {
  it("exports an array of routes", () => {
    expect(Array.isArray(routes)).toBe(true);
  });

  it("has auth route with children", () => {
    const auth = routes.find((r) => r.path === "/auth");
    expect(auth).toBeDefined();
    expect(auth?.children).toHaveLength(2);
  });

  it("has protected dashboard route", () => {
    const dashboard = routes.find((r) => r.path === "/");
    expect(dashboard).toBeDefined();
    expect(dashboard?.children).toHaveLength(4);
  });

  it("has wildcard 404 route", () => {
    const notFound = routes.find((r) => r.path === "/:pathMatch(.*)*");
    expect(notFound).toBeDefined();
  });

  it("auth children have correct paths", () => {
    const auth = routes.find((r) => r.path === "/auth");
    const paths = auth?.children?.map((c) => c.path);
    expect(paths).toContain("login");
    expect(paths).toContain("register");
  });

  it("dashboard children have correct paths", () => {
    const dashboard = routes.find((r) => r.path === "/");
    const paths = dashboard?.children?.map((c) => c.path);
    expect(paths).toContain("");
    expect(paths).toContain("cash-flows/:cashFlowId");
    expect(paths).toContain("users");
    expect(paths).toContain("profile");
  });
});
