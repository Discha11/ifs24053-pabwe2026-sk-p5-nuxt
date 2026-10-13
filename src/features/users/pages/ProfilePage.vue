<template>
  <div class="profile-page">
    <div class="page-header">
      <h1 class="page-title">Profil Saya</h1>
      <p class="page-subtitle">Kelola informasi dan keamanan akun kamu</p>
    </div>

    <div v-if="store.isLoading && !store.profile" class="loading-state">
      <div class="loading-spinner"></div>
    </div>

    <div v-else-if="store.profile" class="profile-content">
      <!-- Avatar Section -->
      <div class="profile-card avatar-card">
        <div class="avatar-wrap">
          <img
            :src="store.profile.photo"
            :alt="store.profile.name"
            class="avatar-img"
            @error="onAvatarError"
          />
          <label for="photo-input" class="avatar-upload-btn" title="Ganti foto">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </label>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            class="sr-only"
            @change="handlePhotoUpload"
          />
        </div>
        <div>
          <h2 class="profile-name">{{ store.profile.name }}</h2>
          <p class="profile-email">{{ store.profile.email }}</p>
        </div>
      </div>

      <!-- Update Profile -->
      <div class="profile-card">
        <h3 class="card-title">Informasi Profil</h3>
        <form id="update-profile-form" @submit.prevent="handleUpdateProfile">
          <div class="form-group">
            <label for="profile-name" class="form-label">Nama Lengkap</label>
            <input
              id="profile-name"
              v-model="profileForm.name"
              type="text"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label for="profile-email" class="form-label">Email</label>
            <input
              id="profile-email"
              v-model="profileForm.email"
              type="email"
              class="form-input"
              required
            />
          </div>
          <button
            id="btn-update-profile"
            type="submit"
            class="btn-primary"
            :disabled="store.isLoading"
          >
            <span v-if="store.isLoading" class="spinner"></span>
            Simpan Perubahan
          </button>
        </form>
      </div>

      <!-- Change Password -->
      <div class="profile-card">
        <h3 class="card-title">Ubah Password</h3>
        <form id="change-password-form" @submit.prevent="handleChangePassword">
          <div class="form-group">
            <label for="current-password" class="form-label">Password Saat Ini</label>
            <input
              id="current-password"
              v-model="passwordForm.current"
              type="password"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label for="new-password" class="form-label">Password Baru</label>
            <input
              id="new-password"
              v-model="passwordForm.new"
              type="password"
              class="form-input"
              required
              minlength="6"
            />
          </div>
          <div class="form-group">
            <label for="confirm-password" class="form-label">Konfirmasi Password Baru</label>
            <input
              id="confirm-password"
              v-model="passwordForm.confirm"
              type="password"
              class="form-input"
              required
            />
          </div>
          <button
            id="btn-change-password"
            type="submit"
            class="btn-primary"
            :disabled="store.isLoading"
          >
            <span v-if="store.isLoading" class="spinner"></span>
            Ubah Password
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch } from "vue";
import { useUsersStore } from "../states/usersStore";
import {
  showSuccessDialog,
  showErrorDialog,
} from "../../../helpers/toolsHelper";

const store = useUsersStore();

const profileForm = reactive({ name: "", email: "" });
const passwordForm = reactive({ current: "", new: "", confirm: "" });

watch(
  () => store.profile,
  (p) => {
    if (p) {
      profileForm.name = p.name;
      profileForm.email = p.email;
    }
  },
  { immediate: true }
);

function onAvatarError(e: Event) {
  const img = e.target as HTMLImageElement;
  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(store.profile?.name ?? "U")}&background=0ea5e9&color=fff`;
}

async function handlePhotoUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  try {
    await store.uploadPhoto(file);
    await showSuccessDialog("Foto profil berhasil diperbarui!");
  } catch (err) {
    await showErrorDialog(err instanceof Error ? err.message : "Gagal upload foto");
  }
}

async function handleUpdateProfile() {
  try {
    await store.updateProfile(profileForm.name, profileForm.email);
    await showSuccessDialog("Profil berhasil diperbarui!");
  } catch (err) {
    await showErrorDialog(err instanceof Error ? err.message : "Gagal memperbarui profil");
  }
}

async function handleChangePassword() {
  if (passwordForm.new !== passwordForm.confirm) {
    await showErrorDialog("Konfirmasi password tidak cocok!");
    return;
  }
  try {
    await store.changePassword(
      passwordForm.current,
      passwordForm.new,
      passwordForm.confirm
    );
    await showSuccessDialog("Password berhasil diubah!");
    passwordForm.current = "";
    passwordForm.new = "";
    passwordForm.confirm = "";
  } catch (err) {
    await showErrorDialog(err instanceof Error ? err.message : "Gagal mengubah password");
  }
}

onMounted(async () => {
  await store.fetchProfile();
});
</script>

<style scoped>
.profile-page {
  max-width: 640px;
}

.page-header {
  margin-bottom: 1.5rem;
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

.loading-state {
  display: flex;
  justify-content: center;
  padding: 3rem;
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

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.profile-card {
  background: white;
  border-radius: 14px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.avatar-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e2e8f0;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: #0ea5e9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.avatar-upload-btn:hover {
  background: #0284c7;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

.profile-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.2rem;
}

.profile-email {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #0ea5e9;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.5rem;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.6;
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
</style>
