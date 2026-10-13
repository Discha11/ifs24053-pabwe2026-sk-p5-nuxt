// src/features/cashflows/states/cashFlowsStore.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCashFlowsStore } from "./cashFlowsStore";

Object.defineProperty(globalThis, "DELCOM_BASEURL", {
  value: "https://open-api.delcom.org/api/v1",
  writable: true,
});

describe("useCashFlowsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.stubGlobal("fetch", vi.fn());
    localStorage.setItem("accessToken", "token");
  });
  afterEach(() => vi.unstubAllGlobals());

  const mockSuccess = (data: unknown) => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success", data }),
    } as Response);
  };

  it("has correct initial state", () => {
    const store = useCashFlowsStore();
    expect(store.cashFlows).toEqual([]);
    expect(store.isCashFlowAdded).toBe(false);
    expect(store.isCashFlowChanged).toBe(false);
  });

  it("fetchCashFlows populates cashFlows and stats", async () => {
    mockSuccess({
      cash_flows: [{ id: 1, type: "inflow", nominal: 1000 }],
      stats: { cashflow: 1000, total_inflow: 1000, total_outflow: 0 },
    });
    const store = useCashFlowsStore();
    await store.fetchCashFlows();
    expect(store.cashFlows).toHaveLength(1);
    expect(store.totalInflow).toBe(1000);
  });

  it("fetchCashFlowDetail populates cashFlow", async () => {
    mockSuccess({ cash_flow: { id: 5, nominal: 5000 } });
    const store = useCashFlowsStore();
    await store.fetchCashFlowDetail(5);
    expect(store.cashFlow?.id).toBe(5);
  });

  it("fetchCashFlowDetail throws on failure", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "fail", message: "Not found" }),
    } as Response);
    const store = useCashFlowsStore();
    await expect(store.fetchCashFlowDetail(99)).rejects.toThrow("Not found");
    expect(store.error).toBe("Not found");
  });

  it("fetchCashFlowDetail sets default error when non-Error is thrown", async () => {
    vi.mocked(fetch).mockRejectedValueOnce("String error");
    const store = useCashFlowsStore();
    await expect(store.fetchCashFlowDetail(99)).rejects.toBe("String error");
    expect(store.error).toBe("Gagal mengambil detail arus kas");
  });

  it("addCashFlow sets isCashFlowAdded = true", async () => {
    mockSuccess({ cash_flow_id: 1 });
    const store = useCashFlowsStore();
    await store.addCashFlow({
      type: "inflow",
      source: "cash",
      label: "gaji",
      description: "test",
      nominal: 100,
    });
    expect(store.isCashFlowAdded).toBe(true);
  });

  it("addCashFlow throws on failure", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Gagal tambah"));
    const store = useCashFlowsStore();
    await expect(
      store.addCashFlow({
        type: "inflow",
        source: "cash",
        label: "gaji",
        description: "test",
        nominal: 100,
      })
    ).rejects.toThrow("Gagal tambah");
    expect(store.error).toBe("Gagal tambah");
  });

  it("addCashFlow sets fallback error when non-Error thrown", async () => {
    vi.mocked(fetch).mockRejectedValueOnce("Error str");
    const store = useCashFlowsStore();
    await expect(
      store.addCashFlow({
        type: "inflow",
        source: "cash",
        label: "gaji",
        description: "test",
        nominal: 100,
      })
    ).rejects.toBe("Error str");
    expect(store.error).toBe("Gagal menambahkan arus kas");
  });

  it("updateCashFlow sets isCashFlowChanged = true", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success" }),
    } as Response);
    const store = useCashFlowsStore();
    await store.updateCashFlow(1, {
      type: "outflow",
      source: "savings",
      label: "makan",
      description: "test",
      nominal: 50,
    });
    expect(store.isCashFlowChanged).toBe(true);
  });

  it("updateCashFlow throws on failure", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Update error"));
    const store = useCashFlowsStore();
    await expect(
      store.updateCashFlow(1, {
        type: "outflow",
        source: "savings",
        label: "makan",
        description: "test",
        nominal: 50,
      })
    ).rejects.toThrow("Update error");
    expect(store.error).toBe("Update error");
  });

  it("updateCashFlow sets fallback error when non-Error is thrown", async () => {
    vi.mocked(fetch).mockRejectedValueOnce("String err");
    const store = useCashFlowsStore();
    await expect(
      store.updateCashFlow(1, {
        type: "outflow",
        source: "savings",
        label: "makan",
        description: "test",
        nominal: 50,
      })
    ).rejects.toBe("String err");
    expect(store.error).toBe("Gagal mengubah arus kas");
  });

  it("deleteCashFlow removes from cashFlows", async () => {
    const store = useCashFlowsStore();
    store.cashFlows = [
      { id: 1, user_id: 1, type: "inflow", source: "cash", label: "gaji", description: "", nominal: 100, created_at: "", updated_at: "" },
      { id: 2, user_id: 1, type: "outflow", source: "cash", label: "makan", description: "", nominal: 50, created_at: "", updated_at: "" },
    ];
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success" }),
    } as Response);
    await store.deleteCashFlow(1);
    expect(store.cashFlows).toHaveLength(1);
    expect(store.isCashFlowDeleted).toBe(true);
  });

  it("deleteCashFlow throws on failure", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Delete error"));
    const store = useCashFlowsStore();
    await expect(store.deleteCashFlow(1)).rejects.toThrow("Delete error");
    expect(store.error).toBe("Delete error");
  });

  it("deleteCashFlow sets fallback error when non-Error is thrown", async () => {
    vi.mocked(fetch).mockRejectedValueOnce("String error");
    const store = useCashFlowsStore();
    await expect(store.deleteCashFlow(1)).rejects.toBe("String error");
    expect(store.error).toBe("Gagal menghapus arus kas");
  });

  it("deleteAllCashFlows clears cashFlows", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "success" }),
    } as Response);
    const store = useCashFlowsStore();
    store.cashFlows = [{ id: 1, user_id: 1, type: "inflow", source: "cash", label: "g", description: "", nominal: 1, created_at: "", updated_at: "" }];
    await store.deleteAllCashFlows();
    expect(store.cashFlows).toHaveLength(0);
    expect(store.isCashFlowDeletedAll).toBe(true);
  });

  it("deleteAllCashFlows throws on failure and sets error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Delete all failed"));
    const store = useCashFlowsStore();
    await expect(store.deleteAllCashFlows()).rejects.toThrow("Delete all failed");
    expect(store.error).toBe("Delete all failed");
  });

  it("deleteAllCashFlows sets fallback error on non-Error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce("Non error str");
    const store = useCashFlowsStore();
    await expect(store.deleteAllCashFlows()).rejects.toBe("Non error str");
    expect(store.error).toBe("Gagal menghapus semua arus kas");
  });

  it("resetMutationFlags clears all flags", () => {
    const store = useCashFlowsStore();
    store.isCashFlowAdded = true;
    store.isCashFlowChanged = true;
    store.resetMutationFlags();
    expect(store.isCashFlowAdded).toBe(false);
    expect(store.isCashFlowChanged).toBe(false);
  });

  it("fetchLabels populates labels and ignores error", async () => {
    mockSuccess({ labels: ["gaji", "makan"] });
    const store = useCashFlowsStore();
    await store.fetchLabels();
    expect(store.labels).toContain("gaji");

    vi.mocked(fetch).mockRejectedValueOnce(new Error("Labels failed"));
    await expect(store.fetchLabels()).resolves.toBeUndefined();
  });

  it("fetchStatsDaily populates statsDaily and ignores error", async () => {
    mockSuccess({ stats_inflow: {}, stats_outflow: {}, stats_cashflow: {} });
    const store = useCashFlowsStore();
    await store.fetchStatsDaily();
    expect(store.statsDaily).toBeTruthy();

    vi.mocked(fetch).mockRejectedValueOnce(new Error("Daily stats failed"));
    await expect(store.fetchStatsDaily()).resolves.toBeUndefined();
  });

  it("fetchStatsMonthly populates statsMonthly and ignores error", async () => {
    mockSuccess({ stats_inflow: {}, stats_outflow: {}, stats_cashflow: {} });
    const store = useCashFlowsStore();
    await store.fetchStatsMonthly();
    expect(store.statsMonthly).toBeTruthy();

    vi.mocked(fetch).mockRejectedValueOnce(new Error("Monthly stats failed"));
    await expect(store.fetchStatsMonthly()).resolves.toBeUndefined();
  });

  it("throws and sets error on fetchCashFlows failure with Error and non-Error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ status: "fail", message: "Unauthorized" }),
    } as Response);
    const store = useCashFlowsStore();
    await expect(store.fetchCashFlows()).rejects.toThrow();
    expect(store.error).toBe("Unauthorized");

    vi.mocked(fetch).mockRejectedValueOnce("Error str");
    await expect(store.fetchCashFlows()).rejects.toBe("Error str");
    expect(store.error).toBe("Gagal mengambil data arus kas");
  });
});
