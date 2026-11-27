# jks9.dev

[![jks9.dev: web scraping in production](https://jks9.dev/og/site.png)](https://jks9.dev)

The site of JKS9: articles and open-source tools on web scraping in production. Live at [jks9.dev](https://jks9.dev).

It is a static Astro site in plain CSS, printed in two inks (orange and forest green) like a risograph zine. Articles are numbered like zine issues: N°01 is the oldest.

## What it does

- **Pages**: home, blog archive, one page per topic, articles, About, RSS, 404.
- **Publishing on a date**: an article goes live on its `pubDate`. It can be pushed early. The daily build publishes it on the day.
- **Share images and tab icons** are drawn at build time with [Satori](https://github.com/vercel/satori) and [resvg](https://github.com/yisibl/resvg-js). The 1200 × 630 images are `/og/site.png`, `/og/blog.png` and one `/og/blog/<slug>.png` per article. The icons are `/favicon.svg`, `/favicon.ico` and `/apple-touch-icon.png`.
- **Two RSS feeds**: `/rss.xml` carries the full text and `/rss-summary.xml` the "In short". Each holds the 20 newest issues. The `/rss/` page explains both.
- **For search engines and AI tools**: canonical URLs, sitemap, JSON-LD (`WebSite`, `Person`, `BlogPosting`, `BreadcrumbList`), `robots.txt` open to every crawler, AI crawlers included, `llms.txt` and `llms-full.txt` with the full text of every article. After each deployment, an [IndexNow](https://www.indexnow.org/) ping tells Bing and the other engines that use it about the change.
- **Latest on GitHub**: the About page shows the newest public repo and the latest commits, fetched from the GitHub API at build time.
- **Privacy**: fonts are served from the site, so readers never send a request to Google. [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) uses no cookies and only runs on jks9.dev.

## Commands

You need Yarn 1 and Node 24 (`nvm use` reads `.nvmrc`).

| Command | Action |
| :-- | :-- |
| `yarn dev` | Local server at `localhost:4321`, drafts and future-dated articles included |
| `yarn build` | Production build in `dist/` |
| `SHOW_DRAFTS=1 yarn build` | Production build that also shows drafts and future-dated articles, to check a layout |
| `yarn preview` | Serve the last build |

## Writing an article

Each article is one Markdown file in `src/content/blog/`. `src/content.config.ts` checks its front matter:

```yaml
---
title: "…"
description: "…"            # meta description, 160 characters at most
summary: "…"                # the "In short" box under the title
pubDate: 2026-12-15         # the article goes live on this day
updatedDate: 2026-12-20     # optional
tags: ["Schema drift", "Zod", "TypeScript"]
draft: true                 # until it is ready
heroImage: ./cover.png      # optional, replaces the generated share image
repo: { name: JKS9/…, url: https://github.com/JKS9/…, description: "…" }
discuss: { question: "…", devto: https://dev.to/…, reddit: https://www.reddit.com/… }
---
```

- **Tags**: every tag gets a page under `/blog/topic/<slug>/`. Give each article at least one of the four home topics, spelled exactly: `Web scraping`, `Data pipelines`, `Schema drift` or `Alerts`. The home then links that topic to its page.
- **Code blocks** come in three styles: ` ```ts ` for code, ` ```output title="…" ` for alerts and terminal output, ` ```diff title="file.ts" ` for changes. All three are built in `src/utils/code-blocks.ts`.
- **Reading articles in code**: always go through `getPosts()` or `getIssues()` from `src/utils/issues.ts`, never `getCollection("blog")`. They hide drafts and future-dated articles in production.

## Layout

```text
src/
├── components/   one component per element of the style sheet (Logo, Overprint, Frame, HandNote…)
├── content/blog/ the articles
├── data/         About page content and the list of open-source tools
├── layouts/      BaseLayout (head, JSON-LD, menu, footer) and BlogPost
├── pages/        routes, plus the endpoints: feeds, llms.txt, robots.txt, share images, icons
├── styles/       global.css: the design tokens as CSS variables
└── utils/        code blocks, feeds, GitHub activity, issue numbering, share images
scripts/
└── indexnow.mjs  the IndexNow ping, run after each deployment
```

## Deployment

`.github/workflows/deploy.yml` builds the site with `withastro/action` and deploys it to GitHub Pages. It runs on every push to `main`, and again every morning at 05:23 UTC. That daily run publishes articles scheduled for the day and refreshes the GitHub activity. Then it pings IndexNow.

If GitHub can't be reached, a push still deploys without the "Latest on GitHub" section. The daily run fails instead, so the live page keeps its last good list.

## Good to know

- Astro caches rendered content. After changing `src/utils/code-blocks.ts`, delete `node_modules/.astro/data-store.json` and `.astro/data-store.json`.
- Astro 7's default Markdown processor doesn't run remark or rehype plugins. The code blocks rely on Shiki transformers instead.
- `astro check` refuses TypeScript 7. Run it with `@astrojs/check` and `typescript@6`.
- The `public/<key>.txt` file is the IndexNow key, public by design.

## Fonts

[Rubik Mono One](https://fonts.google.com/specimen/Rubik+Mono+One) for titles, [Courier Prime](https://fonts.google.com/specimen/Courier+Prime) for text, [Reenie Beanie](https://fonts.google.com/specimen/Reenie+Beanie) for handwritten notes. All three are under the SIL Open Font License. The TTF copies used for the share images are in `src/assets/fonts/` with their licenses.

## Reusing the code

You can build your own site from this code, as long as every page keeps the credit **Design by JKS9** in its footer, with a link to [jks9.dev](https://jks9.dev). The link may be `rel="nofollow"`.

The articles, texts, avatar, name and logo are not part of the deal: replace them all. In practice:

- Delete `src/content/blog/*` and `src/assets/avatar.jpg`. Rewrite `src/data/` and the copy of the pages.
- Change the identity in `src/consts.ts`, `site` in `astro.config.mjs`, the GitHub user in `src/utils/github.ts`, and the logo in `src/components/Logo.astro` and `src/utils/share-images.ts`.
- Remove the Cloudflare Web Analytics token from `src/components/BaseHead.astro`. Also remove the IndexNow key from `scripts/indexnow.mjs` and `public/`, then create your own key.
- Search the code for `JKS9` and `jks9` to catch what's left.

## License

The code is under the MIT License, with one more condition: the footer credit above. The content (articles, texts, avatar, the JKS9 name and logo) is all rights reserved. The full terms are in [LICENSE](LICENSE), with the MIT notice of the Astro blog template the site started from.
