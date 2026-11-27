import avatar from "./assets/avatar.jpg";
// Images shared on social networks, drawn at build time by src/utils/share-images.ts
// (the blog page uses /og/blog.png, each article /og/blog/<slug>.png)
export const DEFAULT_SHARE_IMAGE = "/og/site.png";
export const BLOG_SHARE_IMAGE = "/og/blog.png";

export const SITE_TITLE = "JKS9";
export const SITE_TAGLINE = "Web scraping in production";
// Meta description: 150-160 characters max, topic first, name after.
export const SITE_DESCRIPTION =
  "Web scraping in production: reliable scrapers, data pipelines, schema drift and alerts. Articles and open-source tools by JKS9, in Node.js and TypeScript.";

// Main menu. GitHub is added after these links, as an external link.
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog/", label: "Blog" },
  { href: "/about/", label: "About" },
];

export const GITHUB_URL = "https://github.com/JKS9";

// The two RSS feeds (built by src/utils/feed.ts). Every "RSS" link of the site goes to the /rss/ page,
// which explains them; only the <head> (feed autodiscovery) and llms.txt point at the XML itself.
// The full-text one comes first: a reader given the site's address subscribes to the first feed it finds.
export const RSS_FEEDS = {
  full: { path: "/rss.xml", title: SITE_TITLE },
  summary: { path: "/rss-summary.xml", title: `${SITE_TITLE} · summaries` },
};

// Public profiles, all signed JKS9. The footer links and the JSON-LD `sameAs`
// both come from this list. The same name everywhere helps search engines
// and AI tie these profiles to this site.
export const PROFILES = [
  { name: "GitHub", url: GITHUB_URL },
  { name: "Reddit", url: "https://www.reddit.com/user/JKS9_dev/" },
  { name: "dev.to", url: "https://dev.to/jks9_dev" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/etienne-juzans" },
];

export const AUTHOR = {
  name: "JKS9",
  // Other names the same person uses online (the Reddit and dev.to handle)
  alternateName: ["JKS9_dev"],
  jobTitle: "Back-end developer",
  // One sentence that answers "who is JKS9?": search engines and AI assistants quote it as is
  description:
    "JKS9 is a back-end developer specialized in Node.js, NestJS and web scraping, who writes about web scraping in production: reliable scrapers, data pipelines, schema drift and alerts.",
  knowsAbout: [
    "Web scraping",
    "Web scraping in production",
    "Data pipelines",
    "Schema drift",
    "Headless browsers",
    "Playwright",
    "Node.js",
    "TypeScript",
    "NestJS",
    "Zod",
    "AWS SQS",
  ],
  sameAs: PROFILES.map((profile) => profile.url),
};

// Schema.org WebSite. Every page's graph includes it, so "isPartOf" and "publisher" references resolve.
export function websiteJsonLd(site: URL | undefined) {
  return {
    "@type": "WebSite",
    "@id": new URL("/#website", site).href,
    url: new URL("/", site).href,
    name: SITE_TITLE,
    alternateName: `${SITE_TITLE} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    about: { "@type": "Thing", name: "Web scraping" },
    keywords: ["web scraping", "data pipelines", "schema drift", "alerts", "Playwright", "Zod", "Node.js"],
    author: { "@id": new URL("/#person", site).href },
    publisher: { "@id": new URL("/#person", site).href },
  };
}

// Schema.org Person, shared by the home, about and article pages.
export function personJsonLd(site: URL | undefined) {
  return {
    "@type": "Person",
    "@id": new URL("/#person", site).href,
    name: AUTHOR.name,
    alternateName: AUTHOR.alternateName,
    url: new URL("/", site).href,
    // The same avatar as on the GitHub profile: one more clue that both are the same person
    image: new URL(avatar.src, site).href,
    description: AUTHOR.description,
    jobTitle: AUTHOR.jobTitle,
    knowsAbout: AUTHOR.knowsAbout,
    sameAs: AUTHOR.sameAs,
  };
}
