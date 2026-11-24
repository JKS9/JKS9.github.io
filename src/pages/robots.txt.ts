import type { APIRoute } from "astro";

// Open to every crawler, AI ones included (GPTBot, ClaudeBot, PerplexityBot…).
// The sitemap URL follows `site` in astro.config.mjs, so it updates with the domain.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", site).href}
`);
