import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: { __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()) },
  build: { target: "es2022" },
});
