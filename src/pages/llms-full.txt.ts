import type { APIRoute } from "astro";
import { AUTHOR, SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { getPosts } from "../utils/issues";

// llms-full.txt: the full Markdown text of every article in one file, newest first,
// so an AI tool can read the whole site in one request. Linked from /llms.txt.
export const GET: APIRoute = async ({ site }) => {
  const posts = (await getPosts()).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const day = (date: Date) => date.toISOString().slice(0, 10);

  const parts = [
    [`# ${SITE_TITLE}`, "", `> ${SITE_DESCRIPTION}`, "", AUTHOR.description, ""].join("\n"),
    ...posts.map((post) =>
      [
        "---",
        "",
        `# ${post.data.title}`,
        "",
        `URL: ${new URL(`/blog/${post.id}/`, site).href}`,
        `Author: ${AUTHOR.name}`,
        `Published: ${day(post.data.pubDate)}${post.data.updatedDate ? ` · Updated: ${day(post.data.updatedDate)}` : ""}`,
        post.data.tags.length > 0 ? `Topics: ${post.data.tags.join(", ")}` : "",
        "",
        post.data.summary ? `In short: ${post.data.summary}` : post.data.description,
        "",
        (post.body ?? "").trim(),
        "",
      ]
        .filter((line, index, all) => !(line === "" && all[index - 1] === ""))
        .join("\n"),
    ),
  ];
  return new Response(parts.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
