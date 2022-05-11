import { defineConfig } from "vite";
import mix from "vite-plugin-mix";
import react from "@vitejs/plugin-react";

export default defineConfig({
  preview: {
    host: "0.0.0.0",
  },
  server: {
    host: "0.0.0.0",
  },
  plugins: [
    mix({
      handler: "./api.ts",
    }),
    react(),
  ],
});
