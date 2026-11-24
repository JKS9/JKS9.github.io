export const SITE_TITLE = "JKS9";
export const SITE_TAGLINE = "Web scraping in production";
// Meta description: 150-160 characters max, topic first, name after.
export const SITE_DESCRIPTION =
  "Web scraping in production: reliable scrapers, data pipelines, schema drift and alerts. Articles and open-source tools by JKS9, in Node.js and TypeScript.";

export const AUTHOR = {
  name: "JKS9",
  jobTitle: "Back-end developer",
  knowsAbout: [
    "Web scraping",
    "Node.js",
    "TypeScript",
    "NestJS",
    "Playwright",
    "Data pipelines",
  ],
  // Same name everywhere helps search engines and AI tie these profiles to this site.
  sameAs: [
    "https://github.com/JKS9",
    "https://www.reddit.com/user/JKS9_dev/",
    "https://www.linkedin.com/in/etienne-juzans",
    "https://dev.to/jks9_dev",
  ],
};

// Schema.org Person, shared by the home, about and article pages.
export function personJsonLd(site: URL | undefined) {
  return {
    "@type": "Person",
    "@id": new URL("/#person", site).href,
    name: AUTHOR.name,
    url: new URL("/", site).href,
    jobTitle: AUTHOR.jobTitle,
    knowsAbout: AUTHOR.knowsAbout,
    sameAs: AUTHOR.sameAs,
  };
}
