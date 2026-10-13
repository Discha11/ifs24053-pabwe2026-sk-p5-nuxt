// src/features/cashflows/modals/AddModal.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent } from "@testing-library/vue";
import { flushPromises } from "@vue/test-utils";
import { renderWithProviders } from "../../../test-utils";
import AddModal from "./AddModal.vue";
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

describe("AddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen=false", () => {
    const { queryByText } = renderWithProviders(AddModal, {
      props: { isOpen: false, labels: [] },
    });
    expect(queryByText("Tambah Arus Kas")).toBeNull();
  });

  it("renders form when isOpen=true", () => {
    const { getByText } = renderWithProviders(AddModal, {
      props: { isOpen: true, labels: ["gaji", "makan"] },
    });
    expect(getByText("Tambah Arus Kas")).toBeTruthy();
  });

  it("renders all form fields", () => {
    const { getByText } = renderWithProviders(AddModal, {
      props: { isOpen: true, labels: [] },
    });
    expect(getByText("Jenis Arus Kas")).toBeTruthy();
    expect(getByText("Sumber Dana")).toBeTruthy();
    expect(getByText("Label / Kategori")).toBeTruthy();
    expect(getByText("Nominal (Rp)")).toBeTruthy();
    expect(getByText("Deskripsi")).toBeTruthy();
  });

  it("renders submit and cancel buttons and emits close when clicking Batal", async () => {
    const { getByText, emitted } = renderWithProviders(AddModal, {
      props: { isOpen: true, labels: [] },
    });
    expect(getByText("Simpan")).toBeTruthy();
    const cancelBtn = getByText("Batal");
    await fireEvent.click(cancelBtn);
    expect(emitted().close).toBeTruthy();
  });

  it("emits close when clicking close button and overlay", async () => {
    const { getByLabelText, emitted } = renderWithProviders(AddModal, {
      props: { isOpen: true, labels: [] },
    });
    const closeBtn = getByLabelText("Tutup");
    await fireEvent.click(closeBtn);
    expect(emitted().close).toBeTruthy();

    const overlay = document.body.querySelector(".modal-overlay") as HTMLElement;
    await fireEvent.click(overlay);
    expect(emitted().close).toHaveLength(2);
  });

  it("handles changing radio and select options", async () => {
    const { getByText } = renderWithProviders(AddModal, {
      props: { isOpen: true, labels: [] },
    });
    const radioInflow = document.body.querySelector('input[type="radio"][value="inflow"]') as HTMLInputElement;
    const radioOutflow = document.body.querySelector('input[type="radio"][value="outflow"]') as HTMLInputElement;
    await fireEvent.click(radioOutflow);
    await fireEvent.change(radioOutflow);
    await fireEvent.click(radioInflow);
    await fireEvent.change(radioInflow);

    const sourceSelect = document.body.querySelector("#add-source") as HTMLSelectElement;
    await fireEvent.update(sourceSelect, "cash");
    await fireEvent.update(sourceSelect, "savings");
    await fireEvent.update(sourceSelect, "loans");
  });

  it("handles successful submit", async () => {
    const { emitted } = renderWithProviders(AddModal, {
      props: { isOpen: true, labels: ["gaji"] },
    });
    const store = useCashFlowsStore();
    vi.spyOn(store, "addCashFlow").mockResolvedValueOnce(undefined as never);

    const labelInput = document.body.querySelector("#add-label") as HTMLInputElement;
    const nominalInput = document.body.querySelector("#add-nominal") as HTMLInputElement;
    const descInput = document.body.querySelector("#add-description") as HTMLTextAreaElement;
    const form = document.body.querySelector("#add-cashflow-form") as HTMLFormElement;

    await fireEvent.update(labelInput, "bonus");
    await fireEvent.update(nominalInput, "50000");
    await fireEvent.update(descInput, "Bonus bulanan");

    await fireEvent.submit(form);
    await flushPromises();

    expect(store.addCashFlow).toHaveBeenCalled();
    expect(showSuccessDialog).toHaveBeenCalledWith("Arus kas berhasil ditambahkan!");
    expect(emitted().success).toBeTruthy();
    expect(emitted().close).toBeTruthy();
  });

  it("handles submit error with Error instance", async () => {
    renderWithProviders(AddModal, {
      props: { isOpen: true, labels: [] },
    });
    const store = useCashFlowsStore();
    vi.spyOn(store, "addCashFlow").mockRejectedValueOnce(new Error("Gagal simpan"));

    const form = document.body.querySelector("#add-cashflow-form") as HTMLFormElement;
    await fireEvent.submit(form);
    await flushPromises();

    expect(showErrorDialog).toHaveBeenCalledWith("Gagal simpan");
  });

  it("handles submit error with non-Error object", async () => {
    renderWithProviders(AddModal, {
      props: { isOpen: true, labels: [] },
    });
    const store = useCashFlowsStore();
    vi.spyOn(store, "addCashFlow").mockRejectedValueOnce("Error str");

    const form = document.body.querySelector("#add-cashflow-form") as HTMLFormElement;
    await fireEvent.submit(form);
    await flushPromises();

    expect(showErrorDialog).toHaveBeenCalledWith("Gagal menambahkan arus kas");
  });

  it("resets form when isOpen becomes true", async () => {
    const { rerender } = renderWithProviders(AddModal, {
      props: { isOpen: false, labels: [] },
    });
    await rerender({ isOpen: true, labels: [] });
  });

  it("shows loading spinner when store.isCashFlowAdd is true", async () => {
    renderWithProviders(AddModal, {
      props: { isOpen: true, labels: [] },
    });
    const store = useCashFlowsStore();
    store.isCashFlowAdd = true;
    await flushPromises();
    expect(document.body.querySelector(".spinner")).toBeTruthy();
    expect(document.body.textContent).toContain("Menyimpan...");
  });
});
