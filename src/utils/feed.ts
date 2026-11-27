import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { RSS_FEEDS, SITE_DESCRIPTION } from "../consts";
import { getPosts } from "./issues";

// The two RSS feeds (/rss.xml and /rss-summary.xml), both offered on the /rss/ page.
// Only the newest issues go in, so the files stay light for readers that poll them: they keep the items
// they already fetched, and every issue stays in the blog, the sitemap and llms-full.txt.
export const FEED_SIZE = 20;

/**
 * The full-text feed carries each whole article, so feed readers and aggregators get the whole issue.
 * Site-relative links and images get absolute URLs (a feed reader has no base URL).
 * An article with local images (still placeholders before rendering) falls back to its summary.
 * The summary feed carries only the title and the "In short" text, with the link to the article.
 */
export async function feedResponse(context: APIContext, kind: keyof typeof RSS_FEEDS): Promise<Response> {
  const absolute = (html: string) => html.replace(/(href|src)="\//g, `$1="${new URL("/", context.site).href}`);
  const fullText = (html: string | undefined) =>
    kind === "full" && html && !html.includes("__ASTRO_IMAGE_") ? absolute(html) : undefined;

  const posts = (await getPosts())
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, FEED_SIZE);
  return rss({
    title: RSS_FEEDS[kind].title,
    description: SITE_DESCRIPTION,
    site: context.site ?? "",
    xmlns: { dc: "http://purl.org/dc/elements/1.1/" },
    customData: "<language>en</language>",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary ?? post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: `/blog/${post.id}/`,
      content: fullText(post.rendered?.html),
      customData: "<dc:creator>JKS9</dc:creator>",
    })),
  });
}
