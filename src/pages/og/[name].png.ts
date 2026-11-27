import type { APIRoute, GetStaticPaths } from "astro";
import { blogImage, renderPng, SHARE_HEIGHT, SHARE_WIDTH, siteImage } from "../../utils/share-images";

// /og/site.png (home, about, 404) and /og/blog.png (blog and topic pages), drawn at build time.
// Each article has its own image, see ./blog/[...slug].png.ts.
const images = { site: siteImage, blog: blogImage };

export const getStaticPaths: GetStaticPaths = () => Object.keys(images).map((name) => ({ params: { name } }));

export const GET: APIRoute = async ({ params }) => {
  const draw = images[params.name as keyof typeof images];
  const png = await renderPng(draw(), SHARE_WIDTH, SHARE_HEIGHT);
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
