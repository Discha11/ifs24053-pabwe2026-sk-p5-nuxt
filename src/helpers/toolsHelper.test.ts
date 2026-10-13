// src/helpers/toolsHelper.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  formatRupiah,
  formatDate,
  formatDateTime,
  showSuccessDialog,
  showErrorDialog,
  showConfirmDialog,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

import Swal from "sweetalert2";

describe("formatRupiah", () => {
  it("formats number to Rupiah", () => {
    const result = formatRupiah(1000000);
    expect(result).toContain("Rp");
    expect(result).toContain("1.000.000");
  });

  it("formats zero", () => {
    expect(formatRupiah(0)).toContain("0");
  });

  it("formats large numbers", () => {
    const result = formatRupiah(2500000);
    expect(result).toContain("2.500.000");
  });
});

describe("formatDate", () => {
  it("formats a valid date string", () => {
    const result = formatDate("2024-10-05T00:00:00Z");
    expect(result).toContain("2024");
    expect(result).toContain("Oktober");
  });

  it("returns dash for empty string", () => {
    expect(formatDate("")).toBe("-");
  });
});

describe("formatDateTime", () => {
  it("formats datetime string", () => {
    const result = formatDateTime("2024-10-05T12:00:00Z");
    expect(result).toContain("2024");
  });

  it("returns dash for empty string", () => {
    expect(formatDateTime("")).toBe("-");
  });
});

describe("showSuccessDialog", () => {
  it("calls Swal.fire with success icon", async () => {
    vi.mocked(Swal.fire).mockResolvedValueOnce({} as never);
    await showSuccessDialog("Berhasil!");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "success", text: "Berhasil!" })
    );
  });
});

describe("showErrorDialog", () => {
  it("calls Swal.fire with error icon", async () => {
    vi.mocked(Swal.fire).mockResolvedValueOnce({} as never);
    await showErrorDialog("Gagal!");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ icon: "error", text: "Gagal!" })
    );
  });
});

describe("showConfirmDialog", () => {
  it("returns true when confirmed", async () => {
    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: true } as never);
    const result = await showConfirmDialog("Hapus?", "Yakin?");
    expect(result).toBe(true);
  });

  it("returns false when cancelled", async () => {
    vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: false } as never);
    const result = await showConfirmDialog("Hapus?", "Yakin?");
    expect(result).toBe(false);
  });
});
