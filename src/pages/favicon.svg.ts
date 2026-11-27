import type { APIRoute } from "astro";
import { favicon, renderSvg } from "../utils/share-images";

// The tab icon (option 5 of the canvas), as SVG: the letters are paths, no font needed
export const GET: APIRoute = async () =>
  new Response(await renderSvg(favicon(), 64, 64), { headers: { "Content-Type": "image/svg+xml" } });
