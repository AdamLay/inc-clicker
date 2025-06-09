import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.svg", "masked-icon.svg"],
      manifest: {
        name: "Inc Clicker",
        short_name: "IncClicker",
        description: "An incremental clicker game",
        theme_color: "#4F46E5",
        background_color: "#ffffff",
        icons: [
          {
            src: "masked-icon.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "masked-icon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
          {
            src: "masked-icon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
