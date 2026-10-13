<template>
  <div class="users-page">
    <div class="page-header">
      <h1 class="page-title">Direktori Pengguna</h1>
      <p class="page-subtitle">Seluruh pengguna yang terdaftar dalam sistem</p>
    </div>

    <div v-if="store.isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Memuat data pengguna...</p>
    </div>

    <div v-else class="users-grid">
      <div
        v-for="user in store.users"
        :key="user.id"
        class="user-card"
      >
        <img
          :src="user.photo"
          :alt="user.name"
          class="user-avatar"
          @error="onAvatarError($event, user.name)"
        />
        <div class="user-info">
          <p class="user-name">{{ user.name }}</p>
          <p class="user-email">{{ user.email }}</p>
          <p class="user-date">Bergabung: {{ formatDate(user.created_at) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUsersStore } from "../states/usersStore";
import { formatDate } from "../../../helpers/toolsHelper";

const store = useUsersStore();

function onAvatarError(e: Event, name: string) {
  const img = e.target as HTMLImageElement;
  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff`;
}

onMounted(async () => {
  await store.fetchUsers();
});
</script>

<style scoped>
.users-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  margin-bottom: 0.5rem;
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
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: #94a3b8;
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

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.user-card {
  background: white;
  border-radius: 14px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.user-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
  flex-shrink: 0;
}

.user-info {
  min-width: 0;
}

.user-name {
  font-weight: 700;
  color: #0f172a;
  font-size: 0.95rem;
  margin: 0 0 0.15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.8rem;
  color: #475569;
  margin: 0 0 0.15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-date {
  font-size: 0.75rem;
  color: #475569;
  margin: 0;
}
</style>
