<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">Halaman Tidak Ditemukan</h1>
      <p class="error-desc">
        Halaman yang kamu cari tidak ada atau telah dipindahkan.
      </p>
      <RouterLink to="/" class="btn-home">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Kembali ke Dashboard
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 Not Found Page
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  max-width: 480px;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.75rem;
}

.error-desc {
  color: #64748b;
  margin: 0 0 2rem;
  font-size: 1rem;
  line-height: 1.6;
}

.btn-home {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  color: white;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
  transition: opacity 0.2s, transform 0.2s;
}

.btn-home:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
</style>
