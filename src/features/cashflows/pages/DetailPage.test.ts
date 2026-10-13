// src/features/cashflows/pages/DetailPage.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireEvent } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import { renderWithProviders } from "../../../test-utils";
import DetailPage from "./DetailPage.vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import { showConfirmDialog, showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";

const mockPush = vi.fn();
vi.mock("vue-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("vue-router")>();
  return {
    ...actual,
    useRouter: () => ({ push: mockPush }),
    useRoute: () => ({ params: { cashFlowId: "1" }, path: "/cash-flows/1" }),
    RouterLink: { template: "<a><slot /></a>" },
  };
});

vi.mock("../../../helpers/toolsHelper", () => ({
  showConfirmDialog: vi.fn(),
  showSuccessDialog: vi.fn().mockResolvedValue(undefined),
  showErrorDialog: vi.fn().mockResolvedValue(undefined),
  formatRupiah: (n: number) => `Rp${n}`,
  formatDateTime: (d: string) => d,
}));

Object.defineProperty(globalThis, "DELCOM_BASEURL", {
  value: "https://open-api.delcom.org/api/v1",
  writable: true,
});

const mockCashFlow = {
  id: 1,
  user_id: 1,
  type: "inflow",
  source: "cash",
  label: "gaji",
  description: "Gaji bulanan",
  nominal: 5000000,
  created_at: "2024-10-05T00:00:00Z",
  updated_at: "2024-10-05T00:00:00Z",
};

describe("DetailPage", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    mockPush.mockClear();
    vi.clearAllMocks();
    localStorage.setItem("accessToken", "token");
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({
        status: "success",
        data: {
          cash_flow: mockCashFlow,
          labels: ["gaji"],
        },
      }),
    } as Response);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("renders page title and back link", () => {
    const { getByText } = renderWithProviders(DetailPage);
    expect(getByText("Detail Transaksi")).toBeTruthy();
    expect(getByText("Kembali")).toBeTruthy();
  });

  it("renders transaction details and opens modal on edit click", async () => {
    const { findByText, getByRole } = renderWithProviders(DetailPage);
    expect(await findByText("Gaji bulanan")).toBeTruthy();
    expect(await findByText("Pemasukan")).toBeTruthy();

    const editBtn = getByRole("button", { name: /ubah/i });
    await fireEvent.click(editBtn);
    expect(await findByText("Ubah Arus Kas")).toBeTruthy();
  });

  it("handles delete cancelled", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(false);
    const { findByRole } = renderWithProviders(DetailPage);
    const deleteBtn = await findByRole("button", { name: /hapus/i });
    await fireEvent.click(deleteBtn);
    await flushPromises();

    expect(showConfirmDialog).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("handles successful delete", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    const { findByRole } = renderWithProviders(DetailPage);
    const store = useCashFlowsStore();
    const deleteSpy = vi.spyOn(store, "deleteCashFlow").mockResolvedValueOnce(undefined as never);

    const deleteBtn = await findByRole("button", { name: /hapus/i });
    await fireEvent.click(deleteBtn);
    await flushPromises();

    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(showSuccessDialog).toHaveBeenCalledWith("Transaksi berhasil dihapus!");
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("handles delete failure with Error instance", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    const { findByRole } = renderWithProviders(DetailPage);
    const store = useCashFlowsStore();
    vi.spyOn(store, "deleteCashFlow").mockRejectedValueOnce(new Error("Hapus gagal"));

    const deleteBtn = await findByRole("button", { name: /hapus/i });
    await fireEvent.click(deleteBtn);
    await flushPromises();

    expect(showErrorDialog).toHaveBeenCalledWith("Hapus gagal");
  });

  it("handles delete failure with non-Error", async () => {
    vi.mocked(showConfirmDialog).mockResolvedValueOnce(true);
    const { findByRole } = renderWithProviders(DetailPage);
    const store = useCashFlowsStore();
    vi.spyOn(store, "deleteCashFlow").mockRejectedValueOnce("Error str");

    const deleteBtn = await findByRole("button", { name: /hapus/i });
    await fireEvent.click(deleteBtn);
    await flushPromises();

    expect(showErrorDialog).toHaveBeenCalledWith("Gagal menghapus");
  });

  it("renders outflow type and fallback source label", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({
        status: "success",
        data: {
          cash_flow: {
            ...mockCashFlow,
            type: "outflow",
            source: "other_unknown",
          },
          labels: [],
        },
      }),
    } as Response);
    const { findByText } = renderWithProviders(DetailPage);
    expect(await findByText("Pengeluaran")).toBeTruthy();
    expect(await findByText("other_unknown")).toBeTruthy();
  });

  it("does nothing on delete if store.cashFlow is null", async () => {
    const { findByRole } = renderWithProviders(DetailPage);
    const store = useCashFlowsStore();
    const deleteBtn = await findByRole("button", { name: /hapus/i });
    store.cashFlow = null;
    await fireEvent.click(deleteBtn);
    expect(showConfirmDialog).not.toHaveBeenCalled();
  });

  it("refreshes detail when ChangeModal emits success", async () => {
    const { getByRole } = renderWithProviders(DetailPage);
    await flushPromises();
    const store = useCashFlowsStore();
    const fetchSpy = vi.spyOn(store, "fetchCashFlowDetail");

    const editBtn = getByRole("button", { name: /ubah/i });
    await fireEvent.click(editBtn);
    await flushPromises();

    const changeForm = document.body.querySelector("#change-cashflow-form") as HTMLFormElement;
    if (changeForm) {
      vi.spyOn(store, "updateCashFlow").mockResolvedValueOnce(undefined as never);
      await fireEvent.submit(changeForm);
      await flushPromises();
      expect(fetchSpy).toHaveBeenCalledWith(1);
    }
  });
});
