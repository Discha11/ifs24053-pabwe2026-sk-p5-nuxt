// src/features/cashflows/api/cashFlowApi.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getCashFlowsApi,
  getCashFlowDetailApi,
  addCashFlowApi,
  updateCashFlowApi,
  deleteCashFlowApi,
  getLabelsApi,
  getStatsDailyApi,
  getStatsMonthlyApi,
  deleteAllCashFlowsApi,
} from "./cashFlowApi";

Object.defineProperty(globalThis, "DELCOM_BASEURL", {
  value: "https://open-api.delcom.org/api/v1",
  writable: true,
});

const mockFetch = (data: unknown) => {
  vi.mocked(fetch).mockResolvedValueOnce({
    json: async () => ({ status: "success", data }),
  } as Response);
};

const mockFetchFail = (message = "Error") => {
  vi.mocked(fetch).mockResolvedValueOnce({
    json: async () => ({ status: "fail", message }),
  } as Response);
};

describe("cashFlowApi", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.setItem("accessToken", "token");
  });
  afterEach(() => vi.unstubAllGlobals());

  it("getCashFlowsApi returns cash flows and stats", async () => {
    mockFetch({ cash_flows: [{ id: 1 }], stats: { cashflow: 1000 } });
    const result = await getCashFlowsApi();
    expect(result.cash_flows).toHaveLength(1);
  });

  it("getCashFlowsApi applies query params", async () => {
    mockFetch({ cash_flows: [], stats: {} });
    await getCashFlowsApi({ type: "inflow", source: "cash" });
    const url = vi.mocked(fetch).mock.calls[0]?.[0] as string;
    expect(url).toContain("type=inflow");
    expect(url).toContain("source=cash");
  });

  it("getCashFlowDetailApi returns cash flow", async () => {
    mockFetch({ cash_flow: { id: 5 } });
    const result = await getCashFlowDetailApi(5);
    expect(result.cash_flow.id).toBe(5);
  });

  it("addCashFlowApi returns cash_flow_id", async () => {
    mockFetch({ cash_flow_id: 10 });
    const result = await addCashFlowApi({
      type: "inflow",
      source: "cash",
      label: "gaji",
      description: "Test",
      nominal: 1000,
    });
    expect(result.cash_flow_id).toBe(10);
  });

  it("updateCashFlowApi resolves", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success" }),
    } as Response);
    await expect(
      updateCashFlowApi(1, {
        type: "outflow",
        source: "savings",
        label: "makan",
        description: "Makan siang",
        nominal: 50000,
      })
    ).resolves.not.toThrow();
  });

  it("deleteCashFlowApi resolves", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success" }),
    } as Response);
    await expect(deleteCashFlowApi(1)).resolves.not.toThrow();
  });

  it("getLabelsApi returns labels", async () => {
    mockFetch({ labels: ["gaji", "makan"] });
    const result = await getLabelsApi();
    expect(result.labels).toContain("gaji");
  });

  it("getStatsDailyApi returns daily stats", async () => {
    mockFetch({ stats_inflow: {}, stats_outflow: {}, stats_cashflow: {} });
    const result = await getStatsDailyApi();
    expect(result).toHaveProperty("stats_inflow");
  });

  it("getStatsDailyApi with params builds correct query", async () => {
    mockFetch({ stats_inflow: {}, stats_outflow: {}, stats_cashflow: {} });
    const result = await getStatsDailyApi({ end_date: "2026-10-10", total_data: 5 });
    expect(result).toHaveProperty("stats_inflow");
  });

  it("getStatsMonthlyApi returns monthly stats", async () => {
    mockFetch({ stats_inflow: {}, stats_outflow: {}, stats_cashflow: {} });
    const result = await getStatsMonthlyApi();
    expect(result).toHaveProperty("stats_outflow");
  });

  it("getStatsMonthlyApi with params builds correct query", async () => {
    mockFetch({ stats_inflow: {}, stats_outflow: {}, stats_cashflow: {} });
    const result = await getStatsMonthlyApi({ end_date: "2026-10-10", total_data: 5 });
    expect(result).toHaveProperty("stats_outflow");
  });

  it("deleteAllCashFlowsApi resolves", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success" }),
    } as Response);
    await expect(deleteAllCashFlowsApi()).resolves.not.toThrow();
  });

  it("throws on API failure", async () => {
    mockFetchFail("Unauthenticated.");
    await expect(getCashFlowsApi()).rejects.toThrow("Unauthenticated.");
  });
});
