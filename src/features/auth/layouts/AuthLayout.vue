<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { Wallet } from "lucide-vue-next";
import { useAuthStore } from "../states/authStore";

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.replace("/");
  }
});
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-4 py-10">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg">
          <Wallet class="h-7 w-7" />
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight">Delcom Cash Flow</h1>
        <p class="mt-1 text-sm text-slate-500">Aplikasi Pencatat Arus Kas Pribadi</p>
      </div>

      <div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
        <nav class="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 text-center text-sm font-semibold">
          <RouterLink
            to="/auth/login"
            data-testid="tab-login"
            class="rounded-xl py-2 text-slate-600"
            active-class="bg-white text-indigo-600 shadow">
            Masuk Akun
          </RouterLink>
          <RouterLink
            to="/auth/register"
            data-testid="tab-register"
            class="rounded-xl py-2 text-slate-600"
            active-class="bg-white text-indigo-600 shadow">
            Daftar Baru
          </RouterLink>
        </nav>

        <RouterView />
      </div>
    </div>
  </main>
</template>
