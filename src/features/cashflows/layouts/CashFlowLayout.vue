<template>
  <div class="cashflow-layout">
    <NavbarComponent />
    <div class="layout-body">
      <SidebarComponent />
      <main class="layout-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import NavbarComponent from "../components/NavbarComponent.vue";
import SidebarComponent from "../components/SidebarComponent.vue";
import { getAccessToken } from "../../../helpers/apiHelper";

const router = useRouter();

onMounted(() => {
  if (!getAccessToken()) {
    router.replace("/auth/login");
  }
});
</script>

<style scoped>
.cashflow-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.layout-body {
  display: flex;
  flex: 1;
}

.layout-content {
  flex: 1;
  padding: 1.5rem;
  overflow-x: hidden;
  min-width: 0;
}
</style>
