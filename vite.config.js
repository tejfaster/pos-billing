import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      includeAssets: [
        "favicon.svg",
        "icons.svg",
        "pwa-192x192.png",
        "pwa-512x512.png",
      ],

      manifest: {
        id: "/",
        name: "POS Billing",
        short_name: "POS",
        description: "POS Billing Application",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "any",
        theme_color: "#ffffff",
        background_color: "#ffffff",

        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      workbox: {
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: [
          "**/*.{html,js,css,ico,png,svg,webp,woff,woff2}",
        ],
      },
    }),
  ],

  server: {
    proxy: {
      "/api": {
        target: "https://pos-backend-ffx8.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});