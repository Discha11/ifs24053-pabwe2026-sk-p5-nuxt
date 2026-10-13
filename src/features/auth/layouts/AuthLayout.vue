<template>
  <div class="auth-layout">
    <!-- Background decoration -->
    <div class="auth-bg">
      <div class="auth-blob auth-blob-1"></div>
      <div class="auth-blob auth-blob-2"></div>
    </div>

    <!-- Card -->
    <main class="auth-card-wrapper">
      <div class="auth-brand">
        <div class="auth-logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="28"
            height="28"
          >
            <path
              d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
            />
          </svg>
        </div>
        <h1 class="auth-app-name">Delcom Todo</h1>
      </div>

      <div class="auth-card">
        <slot />
      </div>

      <p class="auth-footer">
        &copy; {{ new Date().getFullYear() }} Delcom · Pencatatan Arus Kas
      </p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAccessToken } from "../../../helpers/apiHelper";

const router = useRouter();

onMounted(() => {
  if (getAccessToken()) {
    router.replace("/");
  }
});
</script>

<style scoped>
.auth-layout {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
}

.auth-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.auth-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: float 8s ease-in-out infinite;
}

.auth-blob-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #0ea5e9, #6366f1);
  top: -150px;
  left: -100px;
}

.auth-blob-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #10b981, #0ea5e9);
  bottom: -100px;
  right: -80px;
  animation-delay: -4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

.auth-card-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.auth-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
}

.auth-logo {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 32px rgba(14, 165, 233, 0.4);
}

.auth-app-name {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.auth-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.auth-footer {
  color: #475569;
  font-size: 0.8rem;
  text-align: center;
}
</style>
