<template>
  <div class="home-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard Arus Kas</h1>
        <p class="page-subtitle">Ringkasan dan pencatatan arus keuangan kamu</p>
      </div>
      <div class="header-actions">
        <button id="btn-add-cashflow" class="btn-add" @click="showAddModal = true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Transaksi
        </button>
        <button id="btn-reset-all" class="btn-danger" @click="handleDeleteAll">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path
              d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
            />
            <path d="M10 11v6M14 11v6" />
          </svg>
          Reset Semua
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card stat-net">
        <div class="stat-icon-wrap" style="background: linear-gradient(135deg, #0ea5e9, #6366f1)">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14H11v-4H9l3-3 3 3h-2v4z"/>
          </svg>
        </div>
        <div>
          <p class="stat-label">Total Saldo Bersih</p>
          <p class="stat-value">{{ formatRupiah(store.netCashflow) }}</p>
        </div>
      </div>

      <div class="stat-card stat-inflow">
        <div class="stat-icon-wrap" style="background: #10b981">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </div>
        <div>
          <p class="stat-label">Total Pemasukan</p>
          <p class="stat-value inflow-text">{{ formatRupiah(store.totalInflow) }}</p>
        </div>
      </div>

      <div class="stat-card stat-outflow">
        <div class="stat-icon-wrap" style="background: #f43f5e">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
        <div>
          <p class="stat-label">Total Pengeluaran</p>
          <p class="stat-value outflow-text">{{ formatRupiah(store.totalOutflow) }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrap" style="background: #f59e0b">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 7l1-1h18l1 1v10l-1 1H3l-1-1V7zm2 1v8h16V8H4zm2 2h12v1H6v-1zm0 3h8v1H6v-1z"/>
          </svg>
        </div>
        <div>
          <p class="stat-label">Kas Tunai</p>
          <p class="stat-value">{{ formatRupiah(cashStats) }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrap" style="background: #8b5cf6">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        </div>
        <div>
          <p class="stat-label">Tabungan</p>
          <p class="stat-value">{{ formatRupiah(savingsStats) }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrap" style="background: #64748b">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <p class="stat-label">Pinjaman</p>
          <p class="stat-value">{{ formatRupiah(loansStats) }}</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filter-section">
      <h2 class="section-title">Filter Transaksi</h2>
      <div class="filter-grid">
        <label for="filter-type" class="sr-only">Jenis Transaksi</label>
        <select
          id="filter-type"
          v-model="filters.type"
          class="filter-select"
          aria-label="Filter Jenis Transaksi"
        >
          <option value="">Semua Jenis</option>
          <option value="inflow">Pemasukan</option>
          <option value="outflow">Pengeluaran</option>
        </select>

        <label for="filter-source" class="sr-only">Sumber Dana</label>
        <select
          id="filter-source"
          v-model="filters.source"
          class="filter-select"
          aria-label="Filter Sumber Dana"
        >
          <option value="">Semua Sumber</option>
          <option value="cash">Tunai</option>
          <option value="savings">Tabungan</option>
          <option value="loans">Pinjaman</option>
        </select>

        <label for="filter-label" class="sr-only">Label Kategori</label>
        <select
          id="filter-label"
          v-model="filters.label"
          class="filter-select"
          aria-label="Filter Label Kategori"
        >
          <option value="">Semua Label</option>
          <option v-for="l in store.labels" :key="l" :value="l">{{ l }}</option>
        </select>

        <label for="filter-start-date" class="sr-only">Tanggal Mulai</label>
        <input
          id="filter-start-date"
          v-model="filters.start_date"
          type="date"
          class="filter-select"
          aria-label="Tanggal Mulai"
        />

        <label for="filter-end-date" class="sr-only">Tanggal Akhir</label>
        <input
          id="filter-end-date"
          v-model="filters.end_date"
          type="date"
          class="filter-select"
          aria-label="Tanggal Akhir"
        />

        <button id="btn-apply-filter" class="btn-filter" @click="applyFilter">Terapkan</button>
        <button id="btn-reset-filter" class="btn-filter-reset" @click="resetFilter">Reset Filter</button>
      </div>
    </div>

    <!-- Transactions -->
    <div class="transactions-section">
      <h2 class="section-title">Daftar Transaksi</h2>

      <div v-if="store.isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Memuat data...</p>
      </div>

      <div v-else-if="store.cashFlows.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <p>Belum ada transaksi yang dicatat</p>
        <button class="btn-add" @click="showAddModal = true">Tambah Sekarang</button>
      </div>

      <div v-else class="transactions-table-wrapper">
        <table class="transactions-table">
          <thead>
            <tr>
              <th>Tipe</th>
              <th>Label</th>
              <th>Sumber</th>
              <th>Nominal</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cf in store.cashFlows"
              :key="cf.id"
              class="table-row"
            >
              <td>
                <span
                  class="badge"
                  :class="cf.type === 'inflow' ? 'badge-inflow' : 'badge-outflow'"
                >
                  {{ cf.type === "inflow" ? "Pemasukan" : "Pengeluaran" }}
                </span>
              </td>
              <td class="label-cell">{{ cf.label }}</td>
              <td class="source-cell">
                {{ sourceLabel(cf.source) }}
              </td>
              <td
                class="nominal-cell"
                :class="cf.type === 'inflow' ? 'inflow-text' : 'outflow-text'"
              >
                {{ cf.type === "inflow" ? "+" : "-" }}{{ formatRupiah(cf.nominal) }}
              </td>
              <td class="date-cell">{{ formatDate(cf.created_at) }}</td>
              <td class="actions-cell">
                <RouterLink
                  :id="`btn-detail-${cf.id}`"
                  :to="`/cash-flows/${cf.id}`"
                  class="action-btn btn-view"
                  title="Detail"
                  aria-label="Detail transaksi"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </RouterLink>
                <button
                  :id="`btn-change-${cf.id}`"
                  class="action-btn btn-edit"
                  title="Ubah"
                  aria-label="Ubah transaksi"
                  @click="openChangeModal(cf)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button
                  :id="`btn-delete-${cf.id}`"
                  class="action-btn btn-delete"
                  title="Hapus"
                  aria-label="Hapus transaksi"
                  @click="handleDelete(cf.id)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <AddModal
      :is-open="showAddModal"
      :labels="store.labels"
      @close="showAddModal = false"
      @success="onMutationSuccess"
    />

    <ChangeModal
      :is-open="showChangeModal"
      :cash-flow="selectedCashFlow"
      :labels="store.labels"
      @close="showChangeModal = false"
      @success="onMutationSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import type { CashFlow } from "../api/cashFlowApi";
import AddModal from "../modals/AddModal.vue";
import ChangeModal from "../modals/ChangeModal.vue";
import { formatRupiah, formatDate, showConfirmDialog, showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";

const store = useCashFlowsStore();

const showAddModal = ref(false);
const showChangeModal = ref(false);
const selectedCashFlow = ref<CashFlow | null>(null);

const filters = reactive({
  type: "" as "" | "inflow" | "outflow",
  source: "" as "" | "cash" | "savings" | "loans",
  label: "",
  start_date: "",
  end_date: "",
});

const cashStats = computed(() => {
  if (!store.stats) return 0;
  const inflow = (store.stats["total_inflow_cash"] as number) ?? 0;
  const outflow = (store.stats["total_outflow_cash"] as number) ?? 0;
  return inflow - outflow;
});

const savingsStats = computed(() => {
  if (!store.stats) return 0;
  const inflow = (store.stats["total_inflow_savings"] as number) ?? 0;
  const outflow = (store.stats["total_outflow_savings"] as number) ?? 0;
  return inflow - outflow;
});

const loansStats = computed(() => {
  if (!store.stats) return 0;
  const inflow = (store.stats["total_inflow_loans"] as number) ?? 0;
  const outflow = (store.stats["total_outflow_loans"] as number) ?? 0;
  return inflow - outflow;
});

function sourceLabel(source: string): string {
  const map: Record<string, string> = {
    cash: "Tunai",
    savings: "Tabungan",
    loans: "Pinjaman",
  };
  return map[source] ?? source;
}

async function applyFilter() {
  const params: Record<string, string> = {};
  if (filters.type) params.type = filters.type;
  if (filters.source) params.source = filters.source;
  if (filters.label) params.label = filters.label;
  if (filters.start_date) params.start_date = filters.start_date + " 00:00:00";
  if (filters.end_date) params.end_date = filters.end_date + " 23:59:59";
  await store.fetchCashFlows(params as never);
}

async function resetFilter() {
  filters.type = "";
  filters.source = "";
  filters.label = "";
  filters.start_date = "";
  filters.end_date = "";
  await store.fetchCashFlows();
}

function openChangeModal(cf: CashFlow) {
  selectedCashFlow.value = cf;
  showChangeModal.value = true;
}

async function handleDelete(id: number) {
  const confirmed = await showConfirmDialog(
    "Hapus Transaksi",
    "Apakah kamu yakin ingin menghapus transaksi ini?"
  );
  if (confirmed) {
    try {
      await store.deleteCashFlow(id);
      await showSuccessDialog("Transaksi berhasil dihapus!");
      await store.fetchCashFlows();
    } catch (err) {
      await showErrorDialog(err instanceof Error ? err.message : "Gagal menghapus");
    }
  }
}

async function handleDeleteAll() {
  const confirmed = await showConfirmDialog(
    "Reset Semua Transaksi",
    "Semua transaksi akan dihapus permanen. Lanjutkan?"
  );
  if (confirmed) {
    try {
      await store.deleteAllCashFlows();
      await showSuccessDialog("Semua transaksi berhasil dihapus!");
    } catch (err) {
      await showErrorDialog(err instanceof Error ? err.message : "Gagal mereset");
    }
  }
}

async function onMutationSuccess() {
  await store.fetchCashFlows();
  await store.fetchLabels();
}

onMounted(async () => {
  await store.fetchCashFlows();
  await store.fetchLabels();
});
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.2rem;
}

.page-subtitle {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s;
  box-shadow: 0 2px 12px rgba(14, 165, 233, 0.3);
}

.btn-add:hover {
  opacity: 0.9;
}

.btn-danger {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 10px;
  color: #9f1239;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: #ffe4e6;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  border-radius: 14px;
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-label {
  font-size: 0.78rem;
  color: #475569;
  margin: 0 0 0.2rem;
  font-weight: 600;
}

.stat-value {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.inflow-text {
  color: #047857;
}

.outflow-text {
  color: #9f1239;
}

.filter-section,
.transactions-section {
  background: white;
  border-radius: 14px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem;
}

.filter-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.filter-select {
  padding: 0.55rem 0.85rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  color: #0f172a;
  background: white;
  outline: none;
  transition: border-color 0.2s;
}

.filter-select:focus {
  border-color: #0ea5e9;
}

.btn-filter {
  padding: 0.55rem 1.1rem;
  background: #0369a1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-filter:hover {
  opacity: 0.85;
}

.btn-filter-reset {
  padding: 0.55rem 1.1rem;
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: #334155;
  gap: 1rem;
  text-align: center;
}

.transactions-table-wrapper {
  overflow-x: auto;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.transactions-table th {
  text-align: left;
  padding: 0.65rem 0.9rem;
  color: #475569;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.transactions-table td {
  padding: 0.75rem 0.9rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.table-row:hover td {
  background: #f8fafc;
}

.badge {
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.badge-inflow {
  background: #dcfce7;
  color: #166534;
}

.badge-outflow {
  background: #ffe4e6;
  color: #9f1239;
}

.label-cell {
  font-weight: 500;
  color: #374151;
}

.source-cell {
  color: #475569;
}

.nominal-cell {
  font-weight: 700;
  white-space: nowrap;
}

.date-cell {
  color: #475569;
  white-space: nowrap;
}

.actions-cell {
  display: flex;
  gap: 0.4rem;
}

.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-view {
  background: #eff6ff;
  color: #3b82f6;
}

.btn-view:hover {
  background: #dbeafe;
}

.btn-edit {
  background: #fefce8;
  color: #ca8a04;
}

.btn-edit:hover {
  background: #fef9c3;
}

.btn-delete {
  background: #fff1f2;
  color: #e11d48;
}

.btn-delete:hover {
  background: #ffe4e6;
}
</style>
