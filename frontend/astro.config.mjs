import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://sakaii.org",
  output: "static",
  devToolbar: {
    enabled: false
  },
  integrations: [sitemap()],
  vite: {
    server: {
      fs: {
        allow: [".."]
      }
    }
  }
});
