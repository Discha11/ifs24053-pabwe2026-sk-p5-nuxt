<script setup lang="ts">
import { useRouter } from "vue-router";
import { LogOut, Menu, Wallet } from "lucide-vue-next";
import { showConfirmDialog } from "../../../helpers/toolsHelper";
import { useAuthStore } from "../../auth/states/authStore";
import { useUsersStore } from "../../users/states/usersStore";

const emit = defineEmits<{ (e: "toggle-sidebar"): void }>();

const router = useRouter();
const authStore = useAuthStore();
const usersStore = useUsersStore();

async function onLogout() {
  const confirmed = await showConfirmDialog("Keluar dari akun?", "Sesi kamu akan diakhiri.");
  if (!confirmed) {
    return;
  }
  await authStore.asyncSetIsAuthLogout();
  router.replace("/auth/login");
}
</script>

<template>
  <header class="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur">
    <div class="flex items-center gap-3">
      <button type="button" data-testid="navbar-toggle" aria-label="Buka menu" class="lg:hidden" @click="emit('toggle-sidebar')">
        <Menu class="h-5 w-5" />
      </button>
      <div class="flex items-center gap-2 font-extrabold">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 text-white">
          <Wallet class="h-4 w-4" />
        </span>
        Delcom Cash Flow
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="hidden text-right sm:block" data-testid="navbar-identity">
        <p class="text-sm font-semibold">{{ usersStore.profile?.name }}</p>
        <p class="text-xs text-slate-500">{{ usersStore.profile?.email }}</p>
      </div>
      <button
        type="button"
        data-testid="navbar-logout"
        :disabled="authStore.isAuthLogout"
        class="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
        @click="onLogout">
        <LogOut class="h-4 w-4" /> Keluar
      </button>
    </div>
  </header>
</template>
