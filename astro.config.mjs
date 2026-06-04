import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://andrewreeves.org",
  devToolbar: {
    enabled: false
  },
  integrations: [
    mdx(),
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
