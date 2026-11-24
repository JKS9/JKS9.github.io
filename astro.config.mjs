// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://jks9.dev",
  integrations: [mdx(), sitemap()],
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
