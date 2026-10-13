import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import process from "process";

import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");
  const port = Number(env.APP_PORT || env.PORT) || 3000;

  return {
    root: __dirname,
    plugins: [vue(), tailwindcss()],
    server: {
      port,
    },
    preview: {
      port,
    },
    define: {
      DELCOM_BASEURL: JSON.stringify(
        env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1"
      ),
    },
    test: {
      globals: true,
      environment: "jsdom",
      testTimeout: 20000,
      fileParallelism: false,
      setupFiles: path.resolve(__dirname, "src/setupTests.ts"),
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        include: ["src/**/*.{js,ts,vue}"],
        exclude: [
          "src/main.ts",
          "src/router.options.ts",
          "src/setupTests.ts",
          "src/test-utils.ts",
          "src/**/*.d.ts",
          "**/*.test.{js,ts,jsx,tsx}",
          "node_modules/**",
          ".docs/**",
        ],
        thresholds: {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
      },
    },
  };
});
