import type { RouterConfig } from "@nuxt/schema";
import routes from "./routes";

// Router options kustom Nuxt: seluruh rute berasal dari src/routes.ts
export default <RouterConfig>{
  routes: () => routes,
};
