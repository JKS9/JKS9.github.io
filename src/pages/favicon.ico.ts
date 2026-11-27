import type { APIRoute } from "astro";
import { favicon, icoFromPngs, renderPng } from "../utils/share-images";

// The tab icon for browsers and tools that only look for /favicon.ico: 16 and 32px PNGs in one file
export const GET: APIRoute = async () => {
  const sizes = [16, 32];
  const pngs = await Promise.all(sizes.map(async (size) => ({ size, data: await renderPng(favicon(), 64, 64, size) })));
  return new Response(new Uint8Array(icoFromPngs(pngs)), { headers: { "Content-Type": "image/x-icon" } });
};
