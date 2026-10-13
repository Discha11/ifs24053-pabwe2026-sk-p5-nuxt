<template>
  <div class="auth-card-content">
    <div class="form-header">
      <h2 class="form-title">Buat Akun Baru</h2>
      <p class="form-subtitle">Bergabung dan mulai catat arus kasmu</p>
    </div>

    <form id="register-form" class="auth-form" @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="name" class="form-label">Nama Lengkap</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="form-input"
          placeholder="Nama kamu"
          required
          autocomplete="name"
        />
      </div>

      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="form-input"
          placeholder="contoh@delcom.org"
          required
          autocomplete="email"
        />
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="form-input"
          placeholder="Minimal 6 karakter"
          required
          minlength="6"
          autocomplete="new-password"
        />
      </div>

      <button
        id="btn-register"
        type="submit"
        class="btn-primary"
        :disabled="authStore.isLoading"
      >
        <span v-if="authStore.isLoading" class="spinner"></span>
        <span>{{ authStore.isLoading ? "Memproses..." : "Daftar Sekarang" }}</span>
      </button>

      <p class="form-redirect">
        Sudah punya akun?
        <RouterLink to="/auth/login" class="link">Masuk di sini</RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../states/authStore";
import {
  showSuccessDialog,
  showErrorDialog,
} from "../../../helpers/toolsHelper";

const router = useRouter();
const authStore = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");

async function handleRegister() {
  try {
    await authStore.register(name.value, email.value, password.value);
    await showSuccessDialog("Pendaftaran berhasil! Silakan masuk.");
    router.push("/auth/login");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.";
    await showErrorDialog(message);
  }
}
</script>

<style scoped>
.form-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.25rem;
}

.form-subtitle {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
}

.form-input {
  width: 100%;
  padding: 0.7rem 1rem;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
  font-family: inherit;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  outline: none;
}

.form-input::placeholder {
  color: #475569;
}

.form-input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
}

.btn-primary {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition:
    opacity 0.2s,
    transform 0.1s;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
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

.form-redirect {
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

.link {
  color: #38bdf8;
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}
</style>
