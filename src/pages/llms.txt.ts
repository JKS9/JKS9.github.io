import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

// llms.txt (llmstxt.org): a plain summary of the site for AI tools, rebuilt with every article.
export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  const lines = [
    `# ${SITE_TITLE}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## Articles",
    "",
    ...posts.map(
      (post) =>
        `- [${post.data.title}](${new URL(`/blog/${post.id}/`, site).href}): ${post.data.description}`,
    ),
    "",
    "## About",
    "",
    `- [About JKS9](${new URL("/about/", site).href})`,
    "- [GitHub](https://github.com/JKS9)",
    "",
  ];
  return new Response(lines.join("\n"));
};
