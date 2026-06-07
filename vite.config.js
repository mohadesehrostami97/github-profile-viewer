import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/github-profile-viewer/",
  plugins: [tailwindcss()],
});