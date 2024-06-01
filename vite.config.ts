import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: "autoUpdate",
    // devOptions: {
    //   enabled: true,
    // },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.destination === "audio",
          handler: "StaleWhileRevalidate",
          options: {
            cacheableResponse: {
              statuses: [0, 200],
            },
            cacheName: "audio-cache",
            expiration: {
              maxEntries: 40,
              maxAgeSeconds: 7 * 24 * 60 * 60,
            },
          },
        },
        {
          urlPattern: ({ request }) => request.destination === "image",
          handler: "StaleWhileRevalidate",

          options: {
            cacheableResponse: {
              statuses: [0, 200],
            },
            cacheName: "image-cache",
            expiration: {
              maxEntries: 40,
              maxAgeSeconds: 7 * 24 * 60 * 60,
            },
          },
        },
      ],
      maximumFileSizeToCacheInBytes: 1 * 1024 * 1024 * 1024,
      cleanupOutdatedCaches: true,
      globPatterns: ["**/*.{js,css,html,jpeg,jpg,json,webp,gif,svg}"],
    },
  }), sentryVitePlugin({
    org: "napsterdrx-1j",
    project: "javascript-react"
  })],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    sourcemap: true
  }
});