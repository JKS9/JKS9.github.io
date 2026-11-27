import type { APIRoute, GetStaticPaths } from "astro";
import type { Issue } from "../../../utils/issues";
import { getIssues } from "../../../utils/issues";
import { articleImage, renderPng, SHARE_HEIGHT, SHARE_WIDTH } from "../../../utils/share-images";

// /og/blog/<slug>.png: the image shared with each article, drawn at build time from its front matter
export const getStaticPaths: GetStaticPaths = async () =>
  (await getIssues()).map((issue) => ({ params: { slug: issue.post.id }, props: { issue } }));

export const GET: APIRoute = async ({ props }) => {
  const { issue } = props as { issue: Issue };
  const png = await renderPng(
    articleImage({
      issue: issue.number,
      tags: issue.post.data.tags,
      title: issue.post.data.title,
      date: issue.post.data.pubDate,
    }),
    SHARE_WIDTH,
    SHARE_HEIGHT,
  );
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
