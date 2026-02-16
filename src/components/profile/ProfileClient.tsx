'use client';

import { BuilderProfile, Participant } from '@/types';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { BADGES, LANGUAGE_COLORS } from '@/lib/constants';
import {
  Github,
  Twitter,
  ExternalLink,
  Star,
  GitFork,
  Users,
  Calendar,
  MapPin,
  Trophy,
  ArrowDown,
  Code,
} from 'lucide-react';
import Link from 'next/link';

interface ProfileClientProps {
  profile: BuilderProfile;
  participations: (Participant & { event?: any })[];
}

export default function ProfileClient({ profile, participations }: ProfileClientProps) {
  // Get GitHub data from the latest participation that has it
  const latestWithGithub = participations.find((p) => p.github_username);
  const githubData = latestWithGithub
    ? {
        avatar: latestWithGithub.github_avatar_url,
        bio: latestWithGithub.github_bio,
        repos: latestWithGithub.github_public_repos,
        followers: latestWithGithub.github_followers,
        stars: latestWithGithub.github_total_stars,
        languages: latestWithGithub.github_top_languages || [],
        reposData: latestWithGithub.github_repos_data || [],
        createdAt: latestWithGithub.github_created_at,
      }
    : null;

  const totalVotes = participations.reduce((sum, p) => sum + p.vote_count, 0);
  const totalWins = participations.filter((p) => p.is_winner).length;

  return (
    <div className="min-h-screen">
      {/* Section 1: Hero */}
      <ProfileHeroSection
        profile={profile}
        githubData={githubData}
      />

      {/* Section 2: Stats */}
      {githubData && (
        <GitHubStatsSection githubData={githubData} />
      )}

      {/* Section 3: Repositories */}
      {githubData && githubData.reposData.length > 0 && (
        <ReposSection repos={githubData.reposData} username={profile.github_username || ''} />
      )}

      {/* Section 4: Builder Journey */}
      <JourneySection participations={participations} />

      {/* Section 5: Badges */}
      <BadgesSection
        earnedBadges={profile.badges || []}
        totalVotes={totalVotes}
        totalWins={totalWins}
        githubData={githubData}
      />
    </div>
  );
}

// ==========================================
// SECTION 1: HERO
// ==========================================
function ProfileHeroSection({
  profile,
  githubData,
}: {
  profile: BuilderProfile;
  githubData: any;
}) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-[var(--bh-accent)] opacity-[0.03] blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-[var(--st-accent)] opacity-[0.03] blur-[100px]" />
      </div>

      <div className="relative z-10 text-center px-4">
        {/* Avatar */}
        <div className="mb-6 animate-fade-in-up">
          <div className="relative inline-block">
            <img
              src={
                githubData?.avatar ||
                profile.discord_avatar_url ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${profile.discord_id}`
              }
              alt={profile.discord_username}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-white/10 shadow-2xl animate-float"
            />
            {(profile.total_wins || 0) > 0 && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center text-lg shadow-lg animate-pop-in">
                👑
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          {profile.discord_username}
        </h1>

        {/* Bio */}
        {githubData?.bio && (
          <p
            className="text-base sm:text-lg text-[var(--text-secondary)] max-w-md mx-auto mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            &ldquo;{githubData.bio}&rdquo;
          </p>
        )}

        {/* Social Links */}
        <div
          className="flex items-center justify-center gap-3 mb-8 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          {profile.github_username && (
            <a
              href={`https://github.com/${profile.github_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--text-secondary)] hover:text-white hover:border-white/20 transition-all"
            >
              <Github className="w-4 h-4" />
              {profile.github_username}
            </a>
          )}
          {profile.twitter_handle && (
            <a
              href={`https://twitter.com/${profile.twitter_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--text-secondary)] hover:text-[#1DA1F2] hover:border-[#1DA1F2]/20 transition-all"
            >
              <Twitter className="w-4 h-4" />
              @{profile.twitter_handle}
            </a>
          )}
        </div>

        {/* Quick Stats Pills */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-fade-in-up"
          style={{ animationDelay: '0.5s' }}
        >
          <StatPill
            icon={<Trophy className="w-3.5 h-3.5 text-[var(--gold)]" />}
            label={`${profile.total_wins || 0} Wins`}
          />
          <StatPill
            icon={<Code className="w-3.5 h-3.5 text-[var(--bh-accent)]" />}
            label={`${profile.total_participations || 0} Projects`}
          />
          {githubData?.createdAt && (
            <StatPill
              icon={<Calendar className="w-3.5 h-3.5 text-[var(--st-accent)]" />}
              label={`Since ${new Date(githubData.createdAt).getFullYear()}`}
            />
          )}
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <ArrowDown className="w-5 h-5 mx-auto text-[var(--text-secondary)] animate-bounce" />
        </div>
      </div>
    </section>
  );
}

function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-sm text-[var(--text-secondary)]">
      {icon}
      {label}
    </div>
  );
}

// ==========================================
// SECTION 2: GITHUB STATS
// ==========================================
function GitHubStatsSection({ githubData }: { githubData: any }) {
  const { ref, isInView } = useInView(0.2);

  const repoCount = useCountUp(githubData.repos || 0, 1500, isInView);
  const starCount = useCountUp(githubData.stars || 0, 1500, isInView);
  const followerCount = useCountUp(githubData.followers || 0, 1500, isInView);

  return (
    <section ref={ref} className="py-16 sm:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            <Github className="w-6 h-6 sm:w-7 sm:h-7 inline mr-2" />
            GitHub Stats
          </h2>
          <p className="text-[var(--text-secondary)]">Open source contributions and activity</p>
        </div>

        {/* Stat Boxes */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-12">
          <StatBox
            value={repoCount}
            label="Repositories"
            icon={<Code className="w-5 h-5 text-[var(--bh-accent)]" />}
            isInView={isInView}
            delay={0.1}
          />
          <StatBox
            value={starCount}
            label="Stars Earned"
            icon={<Star className="w-5 h-5 text-[var(--gold)]" />}
            isInView={isInView}
            delay={0.2}
          />
          <StatBox
            value={followerCount}
            label="Followers"
            icon={<Users className="w-5 h-5 text-[var(--st-accent)]" />}
            isInView={isInView}
            delay={0.3}
          />
        </div>

        {/* Language Breakdown */}
        {githubData.languages && githubData.languages.length > 0 && (
          <div
            className={`glass-card p-6 transition-all duration-700 delay-300 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">
              Languages Used
            </h3>
            <div className="space-y-3">
              {githubData.languages.map((lang: any, index: number) => (
                <div key={lang.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: lang.color || '#888' }}
                      />
                      <span className="text-[var(--text-primary)]">{lang.name}</span>
                    </div>
                    <span className="text-[var(--text-secondary)]">{lang.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: isInView ? `${lang.percentage}%` : '0%',
                        backgroundColor: lang.color || '#888',
                        transition: `width 1s ease-out ${0.5 + index * 0.15}s`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StatBox({
  value,
  label,
  icon,
  isInView,
  delay,
}: {
  value: number;
  label: string;
  icon: React.ReactNode;
  isInView: boolean;
  delay: number;
}) {
  return (
    <div
      className={`glass-card p-4 sm:p-6 text-center transition-all duration-500 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
        {value.toLocaleString()}
      </div>
      <div className="text-xs sm:text-sm text-[var(--text-secondary)]">{label}</div>
    </div>
  );
}

// ==========================================
// SECTION 3: REPOSITORIES
// ==========================================
function ReposSection({ repos, username }: { repos: any[]; username: string }) {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 bg-white/[0.01]">
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Featured Repositories</h2>
          <p className="text-[var(--text-secondary)]">Top open source projects</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {repos.slice(0, 6).map((repo: any, index: number) => (
            <a
              key={repo.name}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass-card p-5 group transition-all duration-500 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${index % 2 === 0 ? '' : ''}`}
              style={{ transitionDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-[var(--st-accent)] group-hover:text-[var(--bh-accent)] transition-colors truncate mr-2">
                  📂 {repo.name}
                </h3>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>

              {repo.description && (
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">
                  {repo.description}
                </p>
              )}

              <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-[var(--gold)]" />
                  {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-3 h-3" />
                  {repo.forks_count}
                </span>
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          LANGUAGE_COLORS[repo.language] || '#888',
                      }}
                    />
                    {repo.language}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>

        {username && (
          <div className="text-center mt-8">
            <a
              href={`https://github.com/${username}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-sm text-[var(--text-secondary)] hover:text-white hover:border-white/20 transition-all"
            >
              <Github className="w-4 h-4" />
              View all repositories
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

// ==========================================
// SECTION 4: BUILDER JOURNEY
// ==========================================
function JourneySection({
  participations,
}: {
  participations: (Participant & { event?: any })[];
}) {
  const { ref, isInView } = useInView(0.1);

  if (participations.length === 0) return null;

  return (
    <section ref={ref} className="py-16 sm:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Builder Journey</h2>
          <p className="text-[var(--text-secondary)]">Every project, every vote, every milestone</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div
            className="absolute left-5 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--bh-accent)]/30 via-[var(--st-accent)]/30 to-transparent"
            style={{
              height: isInView ? '100%' : '0%',
              transition: 'height 1.5s ease-out',
            }}
          />

          {/* Timeline Items */}
          <div className="space-y-8">
            {participations.map((p, index) => {
              const isBH = p.event?.event_type === 'builders_hub';

              return (
                <div
                  key={p.id}
                  className={`relative pl-14 sm:pl-16 transition-all duration-500 ${
                    isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 0.2}s` }}
                >
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-3 sm:left-4 top-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 ${
                      p.is_winner
                        ? 'bg-[var(--gold)] border-[var(--gold)] animate-glow-gold'
                        : isBH
                        ? 'bg-[var(--bh-accent)]/20 border-[var(--bh-accent)]'
                        : 'bg-[var(--st-accent)]/20 border-[var(--st-accent)]'
                    }`}
                  >
                    {p.is_winner && (
                      <span className="absolute -top-1 -right-1 text-[10px]">🏆</span>
                    )}
                  </div>

                  {/* Content Card */}
                  <div
                    className={`${
                      isBH ? 'glass-card-bh' : 'glass-card-st'
                    } p-4 sm:p-5`}
                  >
                    {/* Event Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          isBH
                            ? 'bg-[var(--bh-accent)]/10 text-[var(--bh-accent)]'
                            : 'bg-[var(--st-accent)]/10 text-[var(--st-accent)]'
                        }`}
                      >
                        {isBH ? '🏗️ Builder\'s Hub' : '🦈 Shark Tank'}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">
                        Week {p.event?.week_number || '?'}
                      </span>
                      {p.is_winner && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--gold)]/10 text-[var(--gold)]">
                          Winner 🏆
                        </span>
                      )}
                    </div>

                    {/* Project Info */}
                    <h3
                      className="text-base font-semibold mb-1"
                      style={{ color: isBH ? 'var(--bh-accent)' : 'var(--st-accent)' }}
                    >
                      {p.project_name}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      {p.project_one_liner}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {p.project_category && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-[var(--text-secondary)]">
                          {p.project_category}
                        </span>
                      )}
                      {p.tech_stack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-[var(--text-secondary)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Vote Count + Links */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[var(--text-secondary)]">
                        🗳️ {p.vote_count} vote{p.vote_count !== 1 ? 's' : ''}
                      </span>

                      <div className="flex items-center gap-2">
                        {p.project_link && (
                          <a
                            href={p.project_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--text-secondary)] hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {p.project_github_link && (
                          <a
                            href={p.project_github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--text-secondary)] hover:text-white transition-colors"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// SECTION 5: BADGES
// ==========================================
function BadgesSection({
  earnedBadges,
  totalVotes,
  totalWins,
  githubData,
}: {
  earnedBadges: string[];
  totalVotes: number;
  totalWins: number;
  githubData: any;
}) {
  const { ref, isInView } = useInView(0.2);

  const allBadgeKeys = Object.keys(BADGES) as (keyof typeof BADGES)[];
  const earnedCount = earnedBadges.length;
  const totalCount = allBadgeKeys.length;
  const progressPercent = Math.round((earnedCount / totalCount) * 100);

  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 bg-white/[0.01]">
      <div className="max-w-3xl mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Badges & Achievements</h2>
          <p className="text-[var(--text-secondary)]">
            {earnedCount} of {totalCount} badges unlocked
          </p>

          {/* Progress Bar */}
          <div className="max-w-xs mx-auto mt-4">
            <div className="progress-bar">
              <div
                className="progress-bar-fill progress-bar-fill-gold"
                style={{
                  width: isInView ? `${progressPercent}%` : '0%',
                  transition: 'width 1.5s ease-out 0.3s',
                }}
              />
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              {progressPercent}% Complete
            </div>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {allBadgeKeys.map((key, index) => {
            const badge = BADGES[key];
            const isEarned = earnedBadges.includes(key);

            return (
              <div
                key={key}
                className={`text-center transition-all duration-500 ${
                  isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
                style={{ transitionDelay: `${index * 0.08}s` }}
                title={isEarned ? `${badge.name}: ${badge.description}` : `🔒 ${badge.requirement}`}
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-2 transition-transform ${
                    isEarned
                      ? 'glass-card badge-earned'
                      : 'bg-white/[0.02] border border-white/5 badge-locked'
                  }`}
                >
                  {isEarned ? badge.icon : '🔒'}
                </div>
                <div
                  className={`text-[10px] sm:text-xs ${
                    isEarned ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]/50'
                  }`}
                >
                  {isEarned ? badge.name : '???'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}