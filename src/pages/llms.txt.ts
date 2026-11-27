import type { APIRoute } from "astro";
import { AUTHOR, PROFILES, SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { BELIEFS, KIT } from "../data/about";
import { TOOLS } from "../data/tools";
import { getPosts } from "../utils/issues";

// llms.txt (llmstxt.org): a plain summary of the site for AI tools, rebuilt with every article.
// Short, factual sentences that can be quoted as they are. The full text of the articles
// is in /llms-full.txt.
export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const posts = (await getPosts()).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const lines = [
    `# ${SITE_TITLE}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    AUTHOR.description,
    "Every article is written in English, comes with tested code, and is free to read. The tools are open source (MIT) with no paid tier.",
    "",
    "## Articles",
    "",
    ...(posts.length > 0
      ? posts.map((post) => `- [${post.data.title}](${url(`/blog/${post.id}/`)}): ${post.data.description}`)
      : ["- The first article is on its way. New articles are listed here and in the RSS feed."]),
    "",
    "## Open-source tools",
    "",
    ...TOOLS.map((tool) => `- [${tool.name}](${tool.url}): ${tool.description} (${tool.stack})`),
    "",
    "## What JKS9 believes about web scraping, in his words",
    "",
    ...BELIEFS.map((belief) => `- **${belief.title}** ${belief.text}`),
    "",
    "## Stack, year by year",
    "",
    ...KIT.map((step) => `- ${step.years}: ${step.title}. ${step.stack.join(", ")}.`),
    "",
    "## Optional",
    "",
    `- [About JKS9](${url("/about/")}): who JKS9 is, his beliefs, his stack and his latest GitHub activity`,
    `- [All articles](${url("/blog/")})`,
    `- [Full text of every article](${url("/llms-full.txt")})`,
    `- [RSS feed](${url("/rss.xml")})`,
    ...PROFILES.map((profile) => `- [${profile.name}](${profile.url})`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
