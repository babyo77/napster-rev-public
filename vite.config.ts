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
      manifest: {
        name: "Napster",
        short_name: "Napster",
        description: "Web app",
        icons: [
          {
            src: "/newfavicon.jpg",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/newfavicon.jpg",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/newfavicon.jpg",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/newfavicon.jpg",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        start_url: "https://napster-drx.vercel.app/?utm_source=pwa_install",
        scope: "https://napster-drx.vercel.app/",
        display: "standalone",
        background_color: "#121212",
        theme_color: "#121212",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,jpeg,jpg,json,webp,gif}"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
