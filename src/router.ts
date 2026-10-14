import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

// Router untuk mode Vite biasa (bun run dev:vite). Nuxt memakai router.options.ts.
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
