async function getSwal() {
  const mod = await import("sweetalert2");
  return mod.default || mod;
}

// ── Dialog Utilities ─────────────────────────────────────────────────────────

export async function showSuccessDialog(message: string): Promise<void> {
  const Swal = await getSwal();
  await Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: message,
    confirmButtonColor: "#0ea5e9",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

export async function showErrorDialog(message: string): Promise<void> {
  const Swal = await getSwal();
  await Swal.fire({
    icon: "error",
    title: "Gagal",
    text: message,
    confirmButtonColor: "#f43f5e",
  });
}

export async function showConfirmDialog(
  title: string,
  text: string
): Promise<boolean> {
  const Swal = await getSwal();
  const result = await Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: "#f43f5e",
    cancelButtonColor: "#94a3b8",
    confirmButtonText: "Ya, lanjutkan",
    cancelButtonText: "Batal",
  });
  return result.isConfirmed;
}

// ── Formatting Utilities ─────────────────────────────────────────────────────

export function formatRupiah(nominal: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(nominal);
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}
