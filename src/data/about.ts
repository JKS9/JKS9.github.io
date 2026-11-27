// Content of the About page, also used by the "The editor" box of the home page.
// The beliefs are what JKS9 thinks about scraping, not the theses of his articles.

export interface Belief {
  title: string;
  /** Word of the title printed over the orange highlighter */
  mark: string;
  text: string;
}

export const BELIEFS: Belief[] = [
  {
    title: "If a browser can see it, a scraper can read it.",
    mark: "read",
    text: "Scraping public data isn't hacking. My limits are elsewhere: no personal data, and never a pace that slows the site down for its real visitors.",
  },
  {
    title: "Getting blocked is part of the job.",
    mark: "blocked",
    text: "Most scrapers don't die because the HTML changed. They die because the site pushed back: a ban, a captcha, a rate limit. Working around it is part of the craft, like handling any other error.",
  },
  {
    title: "The source decides the tool.",
    mark: "decides",
    text: "Some sites need a real browser, others answer a plain HTTP request. I take the site apart first, its network calls and hidden APIs, then I pick. That part is half the fun.",
  },
  {
    title: "Keep the raw response.",
    mark: "raw",
    text: "Store what the source sent, then validate. A parser can be fixed and run again on what you kept. A response you threw away is gone for good.",
  },
  {
    title: "Fail loud, alert once.",
    mark: "once",
    text: "Retry a few times, then set the item aside in a dead-letter queue. Crash early rather than hide an error, but send one alert per streak of failures, not one per error.",
  },
  {
    title: "Write your own scraper.",
    mark: "own",
    text: "When I write it myself, I keep control and I know exactly what broke. A scraper you understand is a scraper you can fix in minutes.",
  },
];

/** The three beliefs shown on the home page */
export const HOME_BELIEFS = [BELIEFS[1], BELIEFS[3], BELIEFS[4]];

/** Splits a title around its highlighted word: [before, mark, after] */
export function splitOnMark({ title, mark }: Belief): [string, string, string] {
  const start = title.indexOf(mark);
  if (start === -1) return [title, "", ""];
  return [title.slice(0, start), mark, title.slice(start + mark.length)];
}

export interface KitStep {
  years: string;
  title: string;
  text: string;
  stack: string[];
  /** The period he is in now: its tags get the orange shadow */
  current?: boolean;
}

// "My kit, and when I picked it up", oldest first
export const KIT: KitStep[] = [
  {
    years: "2018 – 2019",
    title: "Node.js and React Native",
    text: "Mobile app screens, profiles and settings, and video downloads straight from the browser.",
    stack: ["JavaScript", "Node.js", "React Native", "React Navigation"],
  },
  {
    years: "2019 – 2020",
    title: "PHP and e-commerce",
    text: "A back office to track statistics, and a full website redesign.",
    stack: ["PHP", "JavaScript", "PrestaShop", "MySQL", "Bulma", "Cypress"],
  },
  {
    years: "2020 – 2021",
    title: "Node.js APIs",
    text: "A recommendation API in Node.js, and the mobile app built on top of it.",
    stack: [
      "TypeScript",
      "Node.js",
      "Express",
      "React Native",
      "MySQL",
      "Elasticsearch",
      "AWS S3 & EC2",
      "Firebase",
      "Mocha",
    ],
  },
  {
    years: "2021 – 2022",
    title: "Full-stack, on a blockchain",
    text: "The interface of a decentralized project management app: sign-in, profiles, comments, invitations, dark mode.",
    stack: [
      "TypeScript",
      "Vue.js",
      "Vuetify",
      "MongoDB",
      "Internet Computer (ICP)",
    ],
  },
  {
    years: "2022 – 2024",
    title: "NestJS APIs under load",
    text: "A mobile API built to handle high loads, and back-end apprentices to train along the way.",
    stack: [
      "TypeScript",
      "Node.js",
      "NestJS",
      "MongoDB",
      "AWS",
      "Docker",
      "Firebase",
      "Mandrill",
      "Jest",
    ],
  },
  {
    years: "2025 – today",
    title: "Web scraping and data pipelines",
    text: "Scrapers that run every day, queue-driven workers, and the pipelines that carry the data to where it's needed.",
    stack: [
      "Playwright",
      "Cheerio",
      "HTTP & SOCKS proxies",
      "AWS SQS",
      "S3",
      "DynamoDB",
      "ClickHouse",
      "Zod",
      "tRPC",
      "GitLab CI",
      "GitHub Actions",
      "LocalStack",
      "MinIO",
      "Pino",
    ],
    current: true,
  },
];
