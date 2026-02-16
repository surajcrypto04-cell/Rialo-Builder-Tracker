import { GitHubUser, GitHubRepo, LanguageStat } from '@/types';
import { LANGUAGE_COLORS } from './constants';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers: HeadersInit = {
  Accept: 'application/vnd.github.v3+json',
  ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` }),
};

export async function fetchGitHubUser(
  username: string
): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchGitHubRepos(
  username: string
): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=stars&per_page=100&type=owner`,
      {
        headers,
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) return [];

    const repos: GitHubRepo[] = await res.json();

    // Filter out forks, sort by stars
    return repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count);
  } catch {
    return [];
  }
}

export function calculateTotalStars(repos: GitHubRepo[]): number {
  return repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
}

export function calculateTopLanguages(repos: GitHubRepo[]): LanguageStat[] {
  const languageCounts: Record<string, number> = {};
  let total = 0;

  repos.forEach((repo) => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      total++;
    }
  });

  if (total === 0) return [];

  return Object.entries(languageCounts)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
      color: LANGUAGE_COLORS[name] || '#8B8B8B',
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5); // Top 5 languages
}

export async function fetchFullGitHubProfile(username: string) {
  const [user, repos] = await Promise.all([
    fetchGitHubUser(username),
    fetchGitHubRepos(username),
  ]);

  if (!user) return null;

  const totalStars = calculateTotalStars(repos);
  const topLanguages = calculateTopLanguages(repos);
  const topRepos = repos.slice(0, 6); // Top 6 repos for display

  return {
    user,
    repos: topRepos,
    totalStars,
    topLanguages,
    allReposCount: repos.length,
  };
}