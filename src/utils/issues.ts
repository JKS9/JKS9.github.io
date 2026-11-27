import { type CollectionEntry, getCollection } from "astro:content";

// Articles are numbered like zine issues: N°01 is the oldest one.
export interface Issue {
  number: number;
  label: string; // "N°01"
  isLatest: boolean;
  url: string;
  post: CollectionEntry<"blog">;
}

// A topic is a tag shared by one or more articles, with its own archive page.
export interface Topic {
  name: string; // "Schema drift"
  slug: string; // "schema-drift"
  url: string; // "/blog/topic/schema-drift/"
  count: number;
}

export function topicSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Every topic used by these issues, the most frequent first. */
export function getTopics(issues: Issue[]): Topic[] {
  const topics = new Map<string, Topic>();
  for (const issue of issues) {
    for (const name of issue.post.data.tags) {
      const slug = topicSlug(name);
      const topic = topics.get(slug) ?? { name, slug, url: `/blog/topic/${slug}/`, count: 0 };
      topic.count += 1;
      topics.set(slug, topic);
    }
  }
  return [...topics.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

// Drafts and future-dated articles show up in `yarn dev`, and in a build only with SHOW_DRAFTS=1
// (to check a layout before publishing). Otherwise an article goes live on its pubDate:
// pushed early, it waits, and the daily build of deploy.yml publishes it on the day.
const showDrafts = import.meta.env.DEV || process.env.SHOW_DRAFTS === "1";

/** Every published article, in no particular order. Use this instead of getCollection("blog"). */
export async function getPosts(): Promise<CollectionEntry<"blog">[]> {
  const now = new Date();
  return getCollection("blog", ({ data }) => showDrafts || (!data.draft && data.pubDate <= now));
}

/** Every article as an issue, newest first. */
export async function getIssues(): Promise<Issue[]> {
  const posts = (await getPosts()).sort(
    (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
  );
  return posts
    .map((post, index) => ({
      number: index + 1,
      label: `N°${String(index + 1).padStart(2, "0")}`,
      isLatest: index === posts.length - 1,
      url: `/blog/${post.id}/`,
      post,
    }))
    .reverse();
}
