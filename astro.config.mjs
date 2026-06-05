import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://andrewreeves.org",
  devToolbar: {
    enabled: false
  },
  integrations: [
    mdx(),
    sitemap(),
    tailwind({
      applyBaseStyles: false
    })
  ],
  output: "static",
  trailingSlash: "always",
  redirects: {
    "/collaborators/": "/students/"
  }
});
