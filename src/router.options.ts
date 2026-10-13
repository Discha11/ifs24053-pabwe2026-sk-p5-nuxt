// src/router.options.ts
import routes from "./routes";

const routerOptions = {
  routes: (_routes: unknown) => routes,
};

export default routerOptions;
