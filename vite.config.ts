/// <reference types="vitest/config" />
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

/**
 * Copy the standalone, tree-shakeable theme stylesheet into dist/ verbatim so
 * consumers can `import "maxed-ui/styles.css"`. It is intentionally NOT bundled
 * into the JS entry — the components carry baked-in fallbacks and only pull in
 * the CSS when a consumer opts into theming/dark mode.
 */
function copyStyles(): Plugin {
  return {
    name: "maxed-ui-copy-styles",
    apply: "build",
    closeBundle() {
      copyFileSync(
        resolve(__dirname, "src/styles.css"),
        resolve(__dirname, "dist/styles.css"),
      );
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ["src"], exclude: ["src/**/*.stories.tsx", "src/**/*.test.tsx"] }),
    copyStyles(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.test.tsx"],
  },
});
