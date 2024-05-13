import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        globIgnores: ["/Auth.tsx"],
        globPatterns: ["**/*.{js,css,html,jpeg,jpg,json,webp,gif,svg}"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
