<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center px-4 text-center">
    <p class="text-7xl font-extrabold text-indigo-600">404</p>
    <h1 class="mt-4 text-2xl font-bold">Halaman tidak ditemukan</h1>
    <p class="mt-2 text-slate-500">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
    <RouterLink to="/" class="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white">
      Kembali ke Beranda
    </RouterLink>
  </main>
</template>
