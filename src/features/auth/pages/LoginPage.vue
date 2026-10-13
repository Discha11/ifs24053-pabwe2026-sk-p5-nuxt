<template>
  <div class="auth-card-content">
    <div class="form-header">
      <h2 class="form-title">Selamat Datang</h2>
      <p class="form-subtitle">Masuk ke akun Delcom kamu</p>
    </div>

    <form id="login-form" class="auth-form" @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="login-email-input" class="form-label">Email</label>
        <input
          id="login-email-input"
          v-model="email"
          type="email"
          class="form-input"
          placeholder="contoh@delcom.org"
          required
          autocomplete="email"
        />
      </div>

      <div class="form-group">
        <label for="login-password-input" class="form-label">Password</label>
        <div class="input-wrapper">
          <input
            id="login-password-input"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            placeholder="Masukkan password"
            required
            autocomplete="current-password"
          />
          <button
            type="button"
            class="input-toggle"
            @click="showPassword = !showPassword"
            :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
          >
            <svg
              v-if="!showPassword"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              width="18"
              height="18"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              width="18"
              height="18"
            >
              <path
                d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"
              />
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        </div>
      </div>

      <button
        id="login-submit-button"
        type="submit"
        class="btn-primary"
        :disabled="authStore.isLoading"
      >
        <span v-if="authStore.isLoading" class="spinner"></span>
        <span>{{ authStore.isLoading ? "Memproses..." : "Masuk" }}</span>
      </button>

      <p class="form-redirect">
        Belum punya akun?
        <RouterLink to="/auth/register" class="link">Daftar sekarang</RouterLink>
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

const email = ref("");
const password = ref("");
const showPassword = ref(false);

async function handleLogin() {
  try {
    await authStore.login(email.value, password.value);
    await showSuccessDialog("Berhasil masuk ke sistem!");
    router.push("/");
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

.input-wrapper {
  position: relative;
}

.input-wrapper .form-input {
  padding-right: 2.75rem;
}

.input-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.input-toggle:hover {
  color: #94a3b8;
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
