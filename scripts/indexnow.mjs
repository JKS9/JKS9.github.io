// Tells the IndexNow search engines (Bing, Yandex, Seznam, Naver…) that the site changed,
// instead of waiting for their next crawl. Bing feeds ChatGPT search, so new articles show up there sooner.
// Google doesn't use IndexNow: it relies on the sitemap and Search Console.
//
// Run by deploy.yml after every deployment: `node scripts/indexnow.mjs`.
// The key is public by design: IndexNow checks it at https://jks9.dev/<key>.txt (public/<key>.txt).

const SITE = "https://jks9.dev";
const KEY = "ffe71eb94292bd3a02c6b7dc2f4a5b4f";

async function sitemapUrls() {
  const index = await (await fetch(`${SITE}/sitemap-index.xml`)).text();
  const sitemaps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const urls = [];
  for (const sitemap of sitemaps) {
    const xml = await (await fetch(sitemap)).text();
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  }
  return urls;
}

const urlList = await sitemapUrls();
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});

// 200 and 202 both mean "received"; anything else is logged but never fails the deployment
console.log(`IndexNow: ${urlList.length} URLs sent, answer ${response.status} ${response.statusText}`);
