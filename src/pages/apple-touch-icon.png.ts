import type { APIRoute } from "astro";
import { favicon, renderPng } from "../utils/share-images";

// Home-screen icon for iOS, 180px. Square corners: iOS rounds them itself.
export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await renderPng(favicon(false), 64, 64, 180)), {
    headers: { "Content-Type": "image/png" },
  });
