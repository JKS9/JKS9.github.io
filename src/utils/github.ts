// Latest public GitHub activity, for the "Latest on GitHub" section of the About page.
// Fetched once per build: the site is static, so the list is as fresh as the last build
// (deploy.yml rebuilds it every morning). If GitHub can't be reached (offline, rate limit),
// the build goes on and the section is left out.

const USER = "JKS9";
const API = "https://api.github.com";

// The profile README only gets text edits: its commits are left out.
const HIDDEN_FROM_COMMITS = new Set(["JKS9"]);
// Neither the profile README nor this site counts as a "newest repo".
const HIDDEN_FROM_NEWEST = new Set(["JKS9", "JKS9.github.io"]);

const COMMIT_COUNT = 5;

export interface Repo {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  license: string | null;
  createdAt: Date;
}

export interface Commit {
  sha: string; // short, 7 characters
  message: string; // first line only
  url: string;
  repo: string;
  date: Date;
}

export interface GitHubActivity {
  newestRepo: Repo | null;
  commits: Commit[];
}

interface ApiRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  license: { spdx_id: string } | null;
  created_at: string;
  fork: boolean;
  private: boolean;
  archived: boolean;
}

interface ApiCommit {
  sha: string;
  html_url: string;
  commit: { message: string; author: { date: string } | null };
  // The GitHub account behind the commit, when there is one ("Bot" for Dependabot and the like)
  author: { type: string } | null;
}

class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function get<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "jks9.dev-build",
  };
  // In GitHub Actions the workflow token raises the rate limit (60 calls an hour without it)
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  // A stuck request must not hold the build for minutes
  const response = await fetch(`${API}${path}`, { headers, signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new GitHubError(`GET ${path} answered ${response.status}`, response.status);
  return (await response.json()) as T;
}

async function repoCommits(repo: ApiRepo): Promise<Commit[]> {
  try {
    const commits = await get<ApiCommit[]>(`/repos/${USER}/${repo.name}/commits?per_page=${COMMIT_COUNT}`);
    return commits
      .filter((commit) => commit.author?.type !== "Bot")
      .map((commit) => ({
        sha: commit.sha.slice(0, 7),
        message: commit.commit.message.split("\n")[0],
        url: commit.html_url,
        repo: repo.name,
        date: new Date(commit.commit.author?.date ?? 0),
      }));
  } catch (error) {
    // An empty repo answers 409: it simply has no commits. Anything else (rate limit…) is a real failure.
    if (error instanceof GitHubError && error.status === 409) return [];
    throw error;
  }
}

async function load(): Promise<GitHubActivity> {
  const repos = (
    await get<ApiRepo[]>(`/users/${USER}/repos?type=owner&sort=created&direction=desc&per_page=100`)
  ).filter((repo) => !repo.fork && !repo.private && !repo.archived);

  const newest = repos.find((repo) => !HIDDEN_FROM_NEWEST.has(repo.name));
  const commits = (
    await Promise.all(repos.filter((repo) => !HIDDEN_FROM_COMMITS.has(repo.name)).map(repoCommits))
  )
    .flat()
    .filter((commit) => !commit.message.startsWith("Merge "))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .slice(0, COMMIT_COUNT);

  return {
    newestRepo: newest
      ? {
          name: newest.name,
          url: newest.html_url,
          description: newest.description,
          language: newest.language,
          license: newest.license?.spdx_id ?? null,
          createdAt: new Date(newest.created_at),
        }
      : null,
    commits,
  };
}

// One fetch per build (and per dev server start), however many pages ask
let activity: Promise<GitHubActivity | null> | undefined;

export function getGitHubActivity(): Promise<GitHubActivity | null> {
  activity ??= load().catch((error: Error) => {
    // The daily rebuild exists only for this section: if GitHub fails, fail the build so the
    // deployed site keeps its last good list. A push (a new article) still deploys without it.
    if (process.env.GITHUB_EVENT_NAME === "schedule") throw error;
    console.warn(`[github] ${error.message}: the "Latest on GitHub" section is left out.`);
    return null;
  });
  return activity;
}
