import { defineConfig } from "vite";
import mix from "vite-plugin-mix";

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
  ],
});
