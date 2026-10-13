<template>
  <div class="detail-page">
    <div class="detail-header">
      <RouterLink to="/" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Kembali
      </RouterLink>
      <h1 class="page-title">Detail Transaksi</h1>
    </div>

    <div v-if="store.isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Memuat detail...</p>
    </div>

    <div v-else-if="store.cashFlow" class="detail-card">
      <!-- Type Badge -->
      <div class="detail-top">
        <span
          class="type-badge"
          :class="store.cashFlow.type === 'inflow' ? 'badge-inflow' : 'badge-outflow'"
        >
          {{ store.cashFlow.type === "inflow" ? "Pemasukan" : "Pengeluaran" }}
        </span>
        <div class="detail-actions">
          <button id="btn-change" class="btn-edit" @click="showChangeModal = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Ubah
          </button>
          <button id="btn-delete" class="btn-delete" @click="handleDelete">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            </svg>
            Hapus
          </button>
        </div>
      </div>

      <!-- Nominal -->
      <div class="nominal-display" :class="store.cashFlow.type === 'inflow' ? 'inflow' : 'outflow'">
        <span class="nominal-sign">{{ store.cashFlow.type === "inflow" ? "+" : "-" }}</span>
        <span class="nominal-value">{{ formatRupiah(store.cashFlow.nominal) }}</span>
      </div>

      <!-- Fields -->
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">Label / Kategori</span>
          <span class="detail-value">{{ store.cashFlow.label }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Sumber Dana</span>
          <span class="detail-value">{{ sourceLabel(store.cashFlow.source) }}</span>
        </div>
        <div class="detail-item full-width">
          <span class="detail-label">Deskripsi</span>
          <span class="detail-value">{{ store.cashFlow.description }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Tanggal Dibuat</span>
          <span class="detail-value">{{ formatDateTime(store.cashFlow.created_at) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Terakhir Diperbarui</span>
          <span class="detail-value">{{ formatDateTime(store.cashFlow.updated_at) }}</span>
        </div>
      </div>
    </div>

    <ChangeModal
      :is-open="showChangeModal"
      :cash-flow="store.cashFlow"
      :labels="store.labels"
      @close="showChangeModal = false"
      @success="onSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import ChangeModal from "../modals/ChangeModal.vue";
import {
  formatRupiah,
  formatDateTime,
  showConfirmDialog,
  showSuccessDialog,
  showErrorDialog,
} from "../../../helpers/toolsHelper";

const route = useRoute();
const router = useRouter();
const store = useCashFlowsStore();
const showChangeModal = ref(false);

function sourceLabel(source: string): string {
  const map: Record<string, string> = {
    cash: "Tunai",
    savings: "Tabungan",
    loans: "Pinjaman",
  };
  return map[source] ?? source;
}

async function handleDelete() {
  if (!store.cashFlow) return;
  const confirmed = await showConfirmDialog(
    "Hapus Transaksi",
    "Apakah kamu yakin ingin menghapus transaksi ini?"
  );
  if (confirmed) {
    try {
      await store.deleteCashFlow(store.cashFlow.id);
      await showSuccessDialog("Transaksi berhasil dihapus!");
      router.push("/");
    } catch (err) {
      await showErrorDialog(err instanceof Error ? err.message : "Gagal menghapus");
    }
  }
}

async function onSuccess() {
  const id = Number(route.params["cashFlowId"]);
  await store.fetchCashFlowDetail(id);
}

onMounted(async () => {
  const id = Number(route.params["cashFlowId"]);
  await store.fetchCashFlowDetail(id);
  await store.fetchLabels();
});
</script>

<style scoped>
.detail-page {
  max-width: 640px;
  margin: 0 auto;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  background: #f1f5f9;
  border-radius: 8px;
  color: #334155;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #e2e8f0;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: #475569;
  gap: 0.75rem;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #0ea5e9;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.detail-card {
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.type-badge {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.badge-inflow {
  background: #dcfce7;
  color: #166534;
}

.badge-outflow {
  background: #ffe4e6;
  color: #9f1239;
}

.detail-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-edit {
  background: #fefce8;
  color: #854d0e;
}

.btn-edit:hover {
  background: #fef9c3;
}

.btn-delete {
  background: #fff1f2;
  color: #9f1239;
}

.btn-delete:hover {
  background: #ffe4e6;
}

.nominal-display {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
  padding: 1.25rem;
  border-radius: 12px;
  justify-content: center;
}

.nominal-display.inflow {
  background: #f0fdf4;
}

.nominal-display.outflow {
  background: #fff1f2;
}

.nominal-sign {
  font-size: 2rem;
  font-weight: 800;
  color: inherit;
}

.nominal-value {
  font-size: 2.25rem;
  font-weight: 800;
}

.nominal-display.inflow .nominal-sign,
.nominal-display.inflow .nominal-value {
  color: #166534;
}

.nominal-display.outflow .nominal-sign,
.nominal-display.outflow .nominal-value {
  color: #9f1239;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.full-width {
  grid-column: 1 / -1;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 0.95rem;
  color: #0f172a;
  font-weight: 500;
}
</style>
