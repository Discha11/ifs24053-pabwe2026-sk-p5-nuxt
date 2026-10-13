<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-box slide-up-enter-active">
        <div class="modal-header">
          <h3 class="modal-title">Tambah Arus Kas</h3>
          <button class="modal-close" @click="$emit('close')" aria-label="Tutup">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form id="add-cashflow-form" class="modal-form" @submit.prevent="handleSubmit">
          <!-- Type -->
          <div class="form-group">
            <label class="form-label">Jenis Arus Kas</label>
            <div class="radio-group">
              <label
                class="radio-card"
                :class="{ selected: form.type === 'inflow' }"
              >
                <input v-model="form.type" type="radio" value="inflow" />
                <span class="radio-dot inflow-dot"></span>
                <span>Pemasukan (Inflow)</span>
              </label>
              <label
                class="radio-card"
                :class="{ selected: form.type === 'outflow' }"
              >
                <input v-model="form.type" type="radio" value="outflow" />
                <span class="radio-dot outflow-dot"></span>
                <span>Pengeluaran (Outflow)</span>
              </label>
            </div>
          </div>

          <!-- Source -->
          <div class="form-group">
            <label class="form-label">Sumber Dana</label>
            <select id="add-source" v-model="form.source" class="form-select" required>
              <option value="cash">Tunai (Cash)</option>
              <option value="savings">Tabungan (Savings)</option>
              <option value="loans">Pinjaman (Loans)</option>
            </select>
          </div>

          <!-- Label -->
          <div class="form-group">
            <label class="form-label">Label / Kategori</label>
            <input
              id="add-label"
              v-model="form.label"
              type="text"
              class="form-input"
              placeholder="contoh: gaji, makan, transportasi"
              required
              list="label-suggestions"
            />
            <datalist id="label-suggestions">
              <option
                v-for="l in labels"
                :key="l"
                :value="l"
              />
            </datalist>
          </div>

          <!-- Nominal -->
          <div class="form-group">
            <label class="form-label">Nominal (Rp)</label>
            <input
              id="add-nominal"
              v-model.number="form.nominal"
              type="number"
              class="form-input"
              placeholder="0"
              min="1"
              required
            />
          </div>

          <!-- Description -->
          <div class="form-group">
            <label class="form-label">Deskripsi</label>
            <textarea
              id="add-description"
              v-model="form.description"
              class="form-textarea"
              placeholder="Keterangan transaksi..."
              rows="3"
              required
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="$emit('close')">
              Batal
            </button>
            <button
              id="btn-add-submit"
              type="submit"
              class="btn-submit"
              :disabled="store.isCashFlowAdd"
            >
              <span v-if="store.isCashFlowAdd" class="spinner"></span>
              {{ store.isCashFlowAdd ? "Menyimpan..." : "Simpan" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import {
  showSuccessDialog,
  showErrorDialog,
} from "../../../helpers/toolsHelper";

const props = defineProps<{
  isOpen: boolean;
  labels: string[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();

const store = useCashFlowsStore();

const form = reactive({
  type: "inflow" as "inflow" | "outflow",
  source: "cash" as "cash" | "savings" | "loans",
  label: "",
  nominal: 0,
  description: "",
});

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      form.type = "inflow";
      form.source = "cash";
      form.label = "";
      form.nominal = 0;
      form.description = "";
    }
  }
);

async function handleSubmit() {
  try {
    await store.addCashFlow({ ...form });
    await showSuccessDialog("Arus kas berhasil ditambahkan!");
    emit("success");
    emit("close");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal menambahkan arus kas";
    await showErrorDialog(message);
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-box {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.25s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.modal-form {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  color: #0f172a;
  background: white;
  transition: border-color 0.2s;
  outline: none;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #0ea5e9;
}

.form-textarea {
  resize: none;
}

.radio-group {
  display: flex;
  gap: 0.5rem;
}

.radio-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.8rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #374151;
  transition: all 0.2s;
}

.radio-card input {
  display: none;
}

.radio-card.selected {
  border-color: #0ea5e9;
  background: #f0f9ff;
  color: #0ea5e9;
  font-weight: 600;
}

.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.inflow-dot {
  background: #10b981;
}

.outflow-dot {
  background: #f43f5e;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 0.5rem;
}

.btn-cancel {
  padding: 0.6rem 1.2rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f1f5f9;
}

.btn-submit {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
