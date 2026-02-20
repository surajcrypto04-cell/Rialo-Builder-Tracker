// ==========================================
// RIALO BUILDERS ARENA — TYPE DEFINITIONS
// ==========================================

export interface Event {
  id: string;
  event_type: 'builders_hub' | 'shark_tank';
  week_number: number;
  title: string;
  description: string | null;
  voting_status: 'upcoming' | 'open' | 'closed';
  voting_opens_at: string | null;
  voting_closes_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  event_id: string;
  discord_id: string;
  discord_username: string;
  discord_avatar_url: string | null;
  twitter_handle: string | null;
  github_username: string | null;
  github_avatar_url: string | null;
  github_bio: string | null;
  github_public_repos: number;
  github_followers: number;
  github_total_stars: number;
  github_top_languages: LanguageStat[];
  github_repos_data: GitHubRepo[];
  github_created_at: string | null;
  project_name: string;
  project_one_liner: string;
  project_pitch: string | null;
  project_link: string | null;
  project_github_link: string | null;
  project_screenshot_url: string | null;
  gallery_urls: string[]; // URLs for additional screenshots
  project_category: ProjectCategory | null;
  tech_stack: string[];
  project_status: ProjectStatus;
  team_size: TeamSize;
  vote_count: number;
  is_winner: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  event?: Event;
}

export interface Vote {
  id: string;
  participant_id: string;
  event_id: string;
  voter_discord_id: string;
  voter_username: string | null;
  vote_weight: 1 | 2;
  voted_at: string;
}

export interface BuilderProfile {
  discord_id: string;
  discord_username: string;
  discord_avatar_url: string | null;
  twitter_handle: string | null;
  github_username: string | null;
  total_participations: number;
  total_wins: number;
  total_votes_received: number;
  badges: string[];
  first_participated_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  current_builders_hub_week: number;
  current_shark_tank_week: number;
  announcement_text: string | null;
}

// GitHub Types
export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
  blog: string | null;
  location: string | null;
  company: string | null;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  fork: boolean;
}

export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
}

// Enums as types
export type ProjectCategory =
  | 'DeFi'
  | 'NFT'
  | 'DAO'
  | 'Gaming'
  | 'AI'
  | 'Social'
  | 'Infrastructure'
  | 'Other';

export type ProjectStatus = 'idea' | 'building' | 'live' | 'launched';

export type TeamSize = 'solo' | 'duo' | 'team';

export type EventType = 'builders_hub' | 'shark_tank';

export type VotingStatus = 'upcoming' | 'open' | 'closed';

// Admin form types
export interface AddParticipantForm {
  event_id: string;
  discord_id: string;
  discord_username: string;
  twitter_handle: string;
  github_username: string;
  project_name: string;
  project_one_liner: string;
  project_pitch: string;
  project_link: string;
  project_github_link: string;
  project_category: ProjectCategory;
  tech_stack: string[];
  project_status: ProjectStatus;
  team_size: TeamSize;
  screenshot: File | null;
  gallery_files: File[]; // For multiple file uploads
  gallery_urls_text: string; // For manual URL entry (comma separated)
}