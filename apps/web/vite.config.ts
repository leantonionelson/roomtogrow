import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

/**
 * Two build modes:
 * - default: standard multi-asset build (dist/)
 * - embed:   single self-contained HTML file for intranet drop-in
 */
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === "embed" ? [viteSingleFile({ removeViteModuleLoader: true })] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    outDir: mode === "embed" ? "dist-embed" : "dist",
  },
}));
