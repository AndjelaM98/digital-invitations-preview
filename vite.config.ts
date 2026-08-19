import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function spaFallback(): Plugin {
  return {
    name: "spa-github-pages-fallback",
    closeBundle() {
      const indexHtml = resolve("dist/index.html");
      const fallbackHtml = resolve("dist/404.html");
      if (existsSync(indexHtml)) {
        copyFileSync(indexHtml, fallbackHtml);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: "/digital-invitations-preview/",
  plugins: [react(), spaFallback()],
});
