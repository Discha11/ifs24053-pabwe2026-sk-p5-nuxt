<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <RouterLink
        id="nav-home"
        to="/"
        class="nav-item"
        :class="{ active: isActive('/') }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          width="20"
          height="20"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>Ringkasan Arus Kas</span>
      </RouterLink>

      <RouterLink
        id="nav-users"
        to="/users"
        class="nav-item"
        :class="{ active: isActive('/users') }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          width="20"
          height="20"
        >
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
        <span>Direktori Pengguna</span>
      </RouterLink>

      <RouterLink
        id="nav-profile"
        to="/profile"
        class="nav-item"
        :class="{ active: isActive('/profile') }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          width="20"
          height="20"
        >
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Profil Saya</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

function isActive(path: string): boolean {
  if (path === "/") {
    return route.path === "/" || route.path.startsWith("/cash-flows");
  }
  return route.path.startsWith(path);
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  min-height: calc(100vh - 64px);
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 1.25rem 0.75rem;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  color: #64748b;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s;
}

.nav-item:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.nav-item.active {
  background: linear-gradient(135deg, #eff6ff, #f0f9ff);
  color: #0ea5e9;
  font-weight: 600;
  box-shadow: inset 3px 0 0 #0ea5e9;
}
</style>
