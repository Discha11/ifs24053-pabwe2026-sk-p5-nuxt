// src/features/cashflows/modals/ChangeModal.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import { renderWithProviders } from "../../../test-utils";
import ChangeModal from "./ChangeModal.vue";
import type { CashFlow } from "../api/cashFlowApi";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";

vi.mock("../../../helpers/toolsHelper", () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(undefined),
  showErrorDialog: vi.fn().mockResolvedValue(undefined),
}));

Object.defineProperty(globalThis, "DELCOM_BASEURL", {
  value: "https://open-api.delcom.org/api/v1",
  writable: true,
});

const mockCashFlow: CashFlow = {
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

describe("ChangeModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen=false", () => {
    const { queryByText } = renderWithProviders(ChangeModal, {
      props: { isOpen: false, cashFlow: mockCashFlow, labels: [] },
    });
    expect(queryByText("Ubah Arus Kas")).toBeNull();
  });

  it("renders form when isOpen=true", () => {
    const { getByText } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, cashFlow: mockCashFlow, labels: [] },
    });
    expect(getByText("Ubah Arus Kas")).toBeTruthy();
  });

  it("pre-fills label from cashFlow prop", () => {
    const { getByDisplayValue } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, cashFlow: mockCashFlow, labels: [] },
    });
    expect(getByDisplayValue("gaji")).toBeTruthy();
  });

  it("renders save and cancel buttons and emits close when clicking Batal", async () => {
    const { getByText, emitted } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, cashFlow: mockCashFlow, labels: [] },
    });
    expect(getByText("Simpan Perubahan")).toBeTruthy();
    const cancelBtn = getByText("Batal");
    await fireEvent.click(cancelBtn);
    expect(emitted().close).toBeTruthy();
  });

  it("emits close when clicking close button and overlay", async () => {
    const { getByLabelText, emitted } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, cashFlow: mockCashFlow, labels: [] },
    });
    const closeBtn = getByLabelText("Tutup");
    await fireEvent.click(closeBtn);
    expect(emitted().close).toBeTruthy();

    const overlay = document.body.querySelector(".modal-overlay") as HTMLElement;
    await fireEvent.click(overlay);
    expect(emitted().close).toHaveLength(2);
  });

  it("handles changing radio, select, and text input options", async () => {
    const { getByText } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, cashFlow: mockCashFlow, labels: [] },
    });
    const radioInflow = document.body.querySelector('input[type="radio"][value="inflow"]') as HTMLInputElement;
    const radioOutflow = document.body.querySelector('input[type="radio"][value="outflow"]') as HTMLInputElement;
    await fireEvent.click(radioOutflow);
    await fireEvent.change(radioOutflow);
    await fireEvent.click(radioInflow);
    await fireEvent.change(radioInflow);

    const sourceSelect = document.body.querySelector("#change-source") as HTMLSelectElement;
    await fireEvent.update(sourceSelect, "cash");
    await fireEvent.update(sourceSelect, "savings");
    await fireEvent.update(sourceSelect, "loans");

    const labelInput = document.body.querySelector("#change-label") as HTMLInputElement;
    await fireEvent.update(labelInput, "updated-label");

    const nominalInput = document.body.querySelector("#change-nominal") as HTMLInputElement;
    await fireEvent.update(nominalInput, "99999");

    const descInput = document.body.querySelector("#change-description") as HTMLTextAreaElement;
    await fireEvent.update(descInput, "updated description");
  });

  it("handles successful submit", async () => {
    const { getByText, emitted } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, cashFlow: mockCashFlow, labels: [] },
    });
    const store = useCashFlowsStore();
    vi.spyOn(store, "updateCashFlow").mockResolvedValueOnce(undefined as never);

    await fireEvent.click(getByText("Simpan Perubahan"));

    expect(store.updateCashFlow).toHaveBeenCalledWith(1, expect.any(Object));
    expect(showSuccessDialog).toHaveBeenCalledWith("Arus kas berhasil diperbarui!");
    expect(emitted().success).toBeTruthy();
    expect(emitted().close).toBeTruthy();
  });

  it("handles submit error with Error instance", async () => {
    const { getByText } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, cashFlow: mockCashFlow, labels: [] },
    });
    const store = useCashFlowsStore();
    vi.spyOn(store, "updateCashFlow").mockRejectedValueOnce(new Error("Gagal update"));

    await fireEvent.click(getByText("Simpan Perubahan"));
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal update");
  });

  it("handles submit error with non-Error object", async () => {
    const { getByText } = renderWithProviders(ChangeModal, {
      props: { isOpen: true, cashFlow: mockCashFlow, labels: [] },
    });
    const store = useCashFlowsStore();
    vi.spyOn(store, "updateCashFlow").mockRejectedValueOnce("Error str");

    await fireEvent.click(getByText("Simpan Perubahan"));
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal memperbarui arus kas");
  });

  it("does nothing on submit if cashFlow prop is null", async () => {
    renderWithProviders(ChangeModal, {
      props: { isOpen: true, cashFlow: null, labels: [] },
    });
    const store = useCashFlowsStore();
    const spy = vi.spyOn(store, "updateCashFlow");

    const form = document.body.querySelector("#change-cashflow-form") as HTMLFormElement;
    if (form) {
      await fireEvent.submit(form);
    }
    expect(spy).not.toHaveBeenCalled();
  });

  it("shows loading spinner when store.isCashFlowChange is true", async () => {
    renderWithProviders(ChangeModal, {
      props: { isOpen: true, cashFlow: mockCashFlow, labels: [] },
    });
    const store = useCashFlowsStore();
    store.isCashFlowChange = true;
    await flushPromises();
    expect(document.body.querySelector(".spinner")).toBeTruthy();
    expect(document.body.textContent).toContain("Menyimpan...");
  });
});
