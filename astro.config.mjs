import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  site: "https://andrewreeves.org",
  devToolbar: {
    enabled: false
  },
  integrations: [mdx(), sitemap()],
  vite: {
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()]
      }
    }
  },
  // Preserve spacing between inline elements across the Astro 7 upgrade.
  compressHTML: true,
  output: "static",
  trailingSlash: "always",
  redirects: {
    "/collaborators/": "/students/"
  }
});
