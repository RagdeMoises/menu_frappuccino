import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
//import { youwareVitePlugin } from "@youware/vite-plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5175,
  },
  build: {
    sourcemap: true,
  },
});
