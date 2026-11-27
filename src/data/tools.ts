// Open-source tools that come with the articles: the "Free tools" cards of the home page and llms.txt.

export interface Tool {
  name: string;
  url: string;
  description: string;
  stack: string;
}

export const TOOLS: Tool[] = [
  {
    name: "zod-schema-drift",
    url: "https://github.com/JKS9/zod-schema-drift",
    description:
      "Know when a third-party API adds a field. One alert per field, strict in dev, tolerant in prod.",
    stack: "TypeScript · Zod 4 · Postgres · MIT",
  },
];
