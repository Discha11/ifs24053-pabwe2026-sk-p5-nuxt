// src/features/cashflows/pages/HomePage.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import { renderWithProviders } from "../../../test-utils";
import HomePage from "./HomePage.vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import { showConfirmDialog, showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
import type { CashFlow } from "../api/cashFlowApi";

vi.mock("vue-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("vue-router")>();
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
    useRoute: () => ({ path: "/" }),
    RouterLink: { template: "<a><slot /></a>" },
  };
});

vi.mock("../../../helpers/toolsHelper", () => ({
  showConfirmDialog: vi.fn(),
  showSuccessDialog: vi.fn().mockResolvedValue(undefined),
  showErrorDialog: vi.fn().mockResolvedValue(undefined),
  formatRupiah: (n: number) => `Rp${n}`,
  formatDate: (d: string) => d,
}));

Object.defineProperty(globalThis, "DELCOM_BASEURL", {
  value: "https://open-api.delcom.org/api/v1",
  writable: true,
});

const mockCashFlowList: CashFlow[] = [
  {
    id: 1,
    user_id: 1,
    type: "inflow",
    source: "cash",
    label: "gaji",
    description: "Gaji bulanan",
    nominal: 5000000,
    created_at: "2024-10-05T00:00:00Z",
    updated_at: "2024-10-05T00:00:00Z",
  },
  {
    id: 2,
    user_id: 1,
    type: "outflow",
    source: "savings",
    label: "makan",
    description: "Makan siang",
    nominal: 50000,
    created_at: "2024-10-06T00:00:00Z",
    updated_at: "2024-10-06T00:00:00Z",
  },
];

describe("HomePage", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.clearAllMocks();
    localStorage.setItem("accessToken", "token");
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        status: "success",
        data: {
          cash_flows: mockCashFlowList,
          stats: {
            cashflow: 4950000,
            total_inflow: 5000000,
            total_outflow: 50000,
            total_inflow_cash: 5000000,
            total_outflow_cash: 0,
            total_inflow_savings: 0,
            total_outflow_savings: 50000,
            total_inflow_loans: 0,
            total_outflow_loans: 0,
          },
          labels: ["gaji", "makan"],
        },
      }),
    } as Response);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("renders page header and buttons", () => {
    const { getByText } = renderWithProviders(HomePage);
    expect(getByText("Dashboard Arus Kas")).toBeTruthy();
    expect(getByText("Tambah Transaksi")).toBeTruthy();
    expect(getByText("Reset Semua")).toBeTruthy();
  });

  it("renders transactions table and action buttons", async () => {
    const { findAllByText, container } = renderWithProviders(HomePage);
    await flushPromises();
    const gajiElements = await findAllByText("gaji");
    expect(gajiElements.length).toBeGreaterThanOrEqual(1);
    const makanElements = await findAllByText("makan");
    expect(makanElements.length).toBeGreaterThanOrEqual(1);

    const changeBtn = container.querySelector("#btn-change-1");
    expect(changeBtn).toBeTruthy();
    if (changeBtn) {
      await fireEvent.click(changeBtn);
      await flushPromises();
      expect(document.body.textContent).toContain("Ubah Arus Kas");
    }
  });

  it("handles applyFilter and resetFilter", async () => {
    const { container } = renderWithProviders(HomePage);
    await flushPromises();
    const store = useCashFlowsStore();
    const fetchSpy = vi.spyOn(store, "fetchCashFlows").mockResolvedValue(undefined as never);

    const typeSelect = container.querySelector("#filter-type") as HTMLSelectElement;
    const sourceSelect = container.querySelector("#filter-source") as HTMLSelectElement;
    const labelSelect = container.querySelector("#filter-label") as HTMLSelectElement;
    const startDateInput = container.querySelector("#filter-start-date") as HTMLInputElement;
    const endDateInput = container.querySelector("#filter-end-date") as HTMLInputElement;

    if (typeSelect) await fireEvent.update(typeSelect, "inflow");
    if (sourceSelect) await fireEvent.update(sourceSelect, "cash");
    if (labelSelect) await fireEvent.update(labelSelect, "gaji");
    if (startDateInput) await fireEvent.update(startDateInput, "2024-10-01");
    if (endDateInput) await fireEvent.update(endDateInput, "2024-10-31");

    const applyBtn = container.querySelector("#btn-apply-filter");
    if (applyBtn) {
      await fireEvent.click(applyBtn);
      await flushPromises();
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "inflow",
          source: "cash",
          start_date: "2024-10-01 00:00:00",
          end_date: "2024-10-31 23:59:59",
        })
      );
    }

    const resetBtn = container.querySelector("#btn-reset-filter");
    if (resetBtn) {
      await fireEvent.click(resetBtn);
      await flushPromises();
      expect(fetchSpy).toHaveBeenCalledWith();
    }
  });

  it("handles deleting transaction: cancel, success, and error paths", async () => {
    const { container } = renderWithProviders(HomePage);
    await flushPromises();
    const store = useCashFlowsStore();

    // 1. Cancel
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(false);
    const deleteBtn = container.querySelector("#btn-delete-1");
    if (deleteBtn) {
      await fireEvent.click(deleteBtn);
      await flushPromises();
      expect(showConfirmDialog).toHaveBeenCalled();
    }

    // 2. Success
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    const deleteSpy = vi.spyOn(store, "deleteCashFlow").mockResolvedValueOnce(undefined as never);
    if (deleteBtn) {
      await fireEvent.click(deleteBtn);
      await flushPromises();
      expect(deleteSpy).toHaveBeenCalledWith(1);
      expect(showSuccessDialog).toHaveBeenCalledWith("Transaksi berhasil dihapus!");
    }

    // 3. Error with Error instance
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    vi.spyOn(store, "deleteCashFlow").mockRejectedValueOnce(new Error("Gagal hapus"));
    if (deleteBtn) {
      await fireEvent.click(deleteBtn);
      await flushPromises();
      expect(showErrorDialog).toHaveBeenCalledWith("Gagal hapus");
    }

    // 4. Error with non-Error
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    vi.spyOn(store, "deleteCashFlow").mockRejectedValueOnce("Error str");
    if (deleteBtn) {
      await fireEvent.click(deleteBtn);
      await flushPromises();
      expect(showErrorDialog).toHaveBeenCalledWith("Gagal menghapus");
    }
  });

  it("handles handleDeleteAll: cancel, success, and error paths", async () => {
    const { getByText } = renderWithProviders(HomePage);
    await flushPromises();
    const store = useCashFlowsStore();
    const resetAllBtn = getByText("Reset Semua");

    // 1. Cancel
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(false);
    await fireEvent.click(resetAllBtn);
    await flushPromises();
    expect(showConfirmDialog).toHaveBeenCalled();

    // 2. Success
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    const deleteAllSpy = vi.spyOn(store, "deleteAllCashFlows").mockResolvedValueOnce(undefined as never);
    await fireEvent.click(resetAllBtn);
    await flushPromises();
    expect(deleteAllSpy).toHaveBeenCalled();
    expect(showSuccessDialog).toHaveBeenCalledWith("Semua transaksi berhasil dihapus!");

    // 3. Error with Error instance
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    vi.spyOn(store, "deleteAllCashFlows").mockRejectedValueOnce(new Error("Reset fail"));
    await fireEvent.click(resetAllBtn);
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Reset fail");

    // 4. Error with non-Error
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    vi.spyOn(store, "deleteAllCashFlows").mockRejectedValueOnce("Reset str fail");
    await fireEvent.click(resetAllBtn);
    await flushPromises();
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal mereset");
  });

  it("opens AddModal and triggers modal close", async () => {
    const { getByText } = renderWithProviders(HomePage);
    await flushPromises();
    const addBtn = getByText("Tambah Transaksi");
    await fireEvent.click(addBtn);
    await flushPromises();
    expect(document.body.textContent).toContain("Tambah Arus Kas");
  });

  it("refreshes cashflows and labels when AddModal emits success", async () => {
    const { getByText } = renderWithProviders(HomePage);
    await flushPromises();
    const store = useCashFlowsStore();
    const fetchSpy = vi.spyOn(store, "fetchCashFlows").mockResolvedValue(undefined as never);
    const labelsSpy = vi.spyOn(store, "fetchLabels").mockResolvedValue(undefined as never);

    const addBtn = getByText("Tambah Transaksi");
    await fireEvent.click(addBtn);
    await flushPromises();

    const addForm = document.body.querySelector("#add-cashflow-form") as HTMLFormElement;
    const labelInput = document.body.querySelector("#add-label") as HTMLInputElement;
    const nominalInput = document.body.querySelector("#add-nominal") as HTMLInputElement;
    const descInput = document.body.querySelector("#add-description") as HTMLTextAreaElement;

    if (addForm) {
      vi.spyOn(store, "addCashFlow").mockResolvedValueOnce(undefined as never);
      await fireEvent.update(labelInput, "test");
      await fireEvent.update(nominalInput, "1000");
      await fireEvent.update(descInput, "test desc");
      await fireEvent.submit(addForm);
      await flushPromises();
      expect(fetchSpy).toHaveBeenCalled();
      expect(labelsSpy).toHaveBeenCalled();
    }
  });

  it("handles null stats, fallback loansStats and unknown source", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({
        status: "success",
        data: {
          cash_flows: [
            {
              id: 99,
              user_id: 1,
              type: "outflow",
              source: "unknown_source",
              label: "other",
              description: "",
              nominal: 10,
              created_at: "",
              updated_at: "",
            },
          ],
          stats: { cashflow: 0 },
          labels: [],
        },
      }),
    } as Response);

    const { findByText } = renderWithProviders(HomePage);
    await flushPromises();
    expect(await findByText("unknown_source")).toBeTruthy();

    const store = useCashFlowsStore();
    store.stats = null;
    await flushPromises();
  });

  it("handles empty state Tambah Sekarang click", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({
        status: "success",
        data: {
          cash_flows: [],
          stats: { cashflow: 0 },
          labels: [],
        },
      }),
    } as Response);

    const { getByText } = renderWithProviders(HomePage);
    await flushPromises();
    const addNowBtn = getByText("Tambah Sekarang");
    await fireEvent.click(addNowBtn);
    await flushPromises();
    expect(document.body.textContent).toContain("Tambah Arus Kas");
  });

  it("handles modal close events from AddModal and ChangeModal", async () => {
    const { getByText, container } = renderWithProviders(HomePage);
    await flushPromises();

    // 1. AddModal close
    const addBtn = getByText("Tambah Transaksi");
    await fireEvent.click(addBtn);
    await flushPromises();
    const addCancelBtn = document.body.querySelector("#add-cashflow-form .btn-cancel") as HTMLElement;
    if (addCancelBtn) {
      await fireEvent.click(addCancelBtn);
      await flushPromises();
    }

    // 2. ChangeModal close
    const changeBtn = container.querySelector("#btn-change-1");
    if (changeBtn) {
      await fireEvent.click(changeBtn);
      await flushPromises();
      const changeCancelBtn = document.body.querySelector("#change-cashflow-form .btn-cancel") as HTMLElement;
      if (changeCancelBtn) {
        await fireEvent.click(changeCancelBtn);
        await flushPromises();
      }
    }
  });
});
