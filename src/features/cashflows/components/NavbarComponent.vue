<template>
  <nav class="navbar" aria-label="Navigasi Utama">
    <div class="navbar-brand">
      <div class="nav-logo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="20"
          height="20"
        >
          <path
            d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
          />
        </svg>
      </div>
      <span class="nav-app-name">Delcom Todo</span>
    </div>

    <div class="navbar-right">
      <div v-if="usersStore.profile" class="nav-user">
        <img
          :src="usersStore.profile.photo"
          :alt="usersStore.profile.name"
          class="nav-avatar"
          @error="onAvatarError"
        />
        <div class="nav-user-info">
          <span class="nav-user-name">{{ usersStore.profile.name }}</span>
          <span class="nav-user-email">{{ usersStore.profile.email }}</span>
        </div>
      </div>

      <span class="nav-badge">Online</span>

      <button id="btn-logout" class="btn-logout" @click="handleLogout" aria-label="Keluar dari sistem">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          width="18"
          height="18"
        >
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span class="logout-label">Keluar</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../auth/states/authStore";
import { useUsersStore } from "../../users/states/usersStore";
import {
  showConfirmDialog,
  showSuccessDialog,
} from "../../../helpers/toolsHelper";

const router = useRouter();
const authStore = useAuthStore();
const usersStore = useUsersStore();

onMounted(async () => {
  if (!usersStore.profile) {
    await usersStore.fetchProfile();
  }
});

function onAvatarError(e: Event) {
  const img = e.target as HTMLImageElement;
  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(usersStore.profile?.name ?? "U")}&background=0ea5e9&color=fff`;
}

async function handleLogout() {
  const confirmed = await showConfirmDialog(
    "Keluar dari Sistem",
    "Apakah kamu yakin ingin keluar?"
  );
  if (confirmed) {
    await authStore.logout();
    await showSuccessDialog("Berhasil keluar!");
    router.push("/auth/login");
  }
}
</script>

<style scoped>
.navbar {
  height: 64px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.nav-logo {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.nav-app-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.3px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.nav-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
}

.nav-user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.nav-user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
}

.nav-user-email {
  font-size: 0.75rem;
  color: #64748b;
}

.nav-badge {
  background: #dcfce7;
  color: #166534;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 20px;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 8px;
  color: #9f1239;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #ffe4e6;
}

@media (max-width: 640px) {
  .nav-user-info,
  .logout-label {
    display: none;
  }
}
</style>
