// @ts-check

import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import { risoCodeBlocks, risoTheme } from "./src/utils/code-blocks.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://jks9.dev",
  integrations: [sitemap()],
  // Code blocks in the two inks: see src/utils/code-blocks.ts for the three variants
  // (No remark/rehype plugins: Astro 7's default Markdown processor, Sätteri, doesn't run them.)
  markdown: {
    shikiConfig: {
      theme: risoTheme,
      langAlias: { output: "plaintext" },
      transformers: [risoCodeBlocks],
    },
  },
  // The CSS goes inside each page instead of separate files: the browser can draw the page
  // as soon as the HTML arrives, without one more round trip per stylesheet (better LCP on slow networks).
  build: {
    inlineStylesheets: "always",
  },
  // Downloaded from Google Fonts at build time and served from the site:
  // readers never send a request to Google.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Rubik Mono One",
      cssVariable: "--font-title",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Courier Prime",
      cssVariable: "--font-text",
      weights: [400, 700],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["monospace"],
    },
    {
      provider: fontProviders.google(),
      name: "Reenie Beanie",
      cssVariable: "--font-hand",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["cursive"],
    },
  ],
});
