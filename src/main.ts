import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./index.css";

// Entry point untuk mode Vite biasa (bun run dev:vite). Nuxt memakai App.vue + @pinia/nuxt.
createApp(App).use(createPinia()).use(router).mount("#app");
