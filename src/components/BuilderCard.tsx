'use client';

import { Participant } from '@/types';
import { PROJECT_STATUS_CONFIG, CATEGORY_COLORS, TEAM_SIZE_CONFIG } from '@/lib/constants';
import { Github, Twitter, ExternalLink, Users, Star, GitFork } from 'lucide-react';
import Link from 'next/link';
import VoteButton from './VoteButton';

interface BuilderCardProps {
  participant: Participant;
  variant: 'builders_hub' | 'shark_tank';
  maxVotes: number;
}

export default function BuilderCard({ participant, variant, maxVotes }: BuilderCardProps) {
  const isBH = variant === 'builders_hub';
  const cardClass = isBH ? 'glass-card-bh' : 'glass-card-st';
  const accentColor = isBH ? 'var(--bh-accent)' : 'var(--st-accent)';
  const statusConfig = PROJECT_STATUS_CONFIG[participant.project_status];
  const categoryColor = participant.project_category
    ? CATEGORY_COLORS[participant.project_category] || '#888'
    : '#888';

  const votePercentage = maxVotes > 0 ? (participant.vote_count / maxVotes) * 100 : 0;

  return (
    <div className={`${cardClass} p-5 sm:p-6 relative group`}>
      {/* Winner Badge */}
      {participant.is_winner && (
        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center text-lg shadow-lg shadow-[var(--gold)]/30 z-10 animate-pop-in">
          🏆
        </div>
      )}

      {/* Header: Avatar + Info */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <Link href={`/profile/${participant.discord_id}`}>
          <div className="relative">
            <img
              src={
                    participant.discord_avatar_url ||
                    participant.github_avatar_url ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${participant.discord_id}`
                  }
              alt={participant.discord_username}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border-2 transition-transform group-hover:scale-105"
              style={{ borderColor: `${accentColor}33` }}
            />
            {participant.is_winner && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--gold)] flex items-center justify-center text-[10px]">
                👑
              </div>
            )}
          </div>
        </Link>

        {/* Name + Links */}
        <div className="flex-1 min-w-0">
          <Link href={`/profile/${participant.discord_id}`}>
            <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] hover:underline truncate">
              {participant.discord_username}
            </h3>
          </Link>

          {/* Social Links */}
          <div className="flex items-center gap-2 mt-1">
            {participant.twitter_handle && (
              <a
                href={`https://twitter.com/${participant.twitter_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[#1DA1F2] transition-colors"
                title={`@${participant.twitter_handle}`}
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
            )}
            {participant.github_username && (
              <a
                href={`https://github.com/${participant.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-white transition-colors"
                title={participant.github_username}
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {participant.project_link && (
              <a
                href={participant.project_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--st-accent)] transition-colors"
                title="Live Project"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Team Size */}
        <div className="text-lg" title={TEAM_SIZE_CONFIG[participant.team_size].label}>
          {TEAM_SIZE_CONFIG[participant.team_size].icon}
        </div>
      </div>

      {/* Project Screenshot */}
      {participant.project_screenshot_url && (
        <div className="mb-4 rounded-lg overflow-hidden border border-white/5">
          <img
            src={participant.project_screenshot_url}
            alt={participant.project_name}
            className="w-full h-36 sm:h-40 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Project Name + One Liner */}
      <div className="mb-3">
        <h4
          className="text-base sm:text-lg font-bold mb-1"
          style={{ color: accentColor }}
        >
          {participant.project_name}
        </h4>
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
          {participant.project_one_liner}
        </p>
      </div>

      {/* Tags: Category + Tech Stack */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {/* Category */}
        {participant.project_category && (
          <span
            className="px-2 py-0.5 rounded-full text-[11px] font-medium"
            style={{
              background: `${categoryColor}15`,
              color: categoryColor,
              border: `1px solid ${categoryColor}30`,
            }}
          >
            {participant.project_category}
          </span>
        )}

        {/* Tech Stack (max 3) */}
        {participant.tech_stack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/5 text-[var(--text-secondary)] border border-white/5"
          >
            {tech}
          </span>
        ))}
        {participant.tech_stack.length > 3 && (
          <span className="px-2 py-0.5 rounded-full text-[11px] text-[var(--text-secondary)]">
            +{participant.tech_stack.length - 3}
          </span>
        )}
      </div>

      {/* Status Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[var(--text-secondary)]">{statusConfig.label}</span>
          <span className="text-[var(--text-secondary)]">{statusConfig.progress}%</span>
        </div>
        <div className="progress-bar">
          <div
            className={isBH ? 'progress-bar-fill progress-bar-fill-bh' : 'progress-bar-fill progress-bar-fill-st'}
            style={{ width: `${statusConfig.progress}%` }}
          />
        </div>
      </div>

      {/* GitHub Stats (if available) */}
      {participant.github_username && (
        <div className="flex items-center gap-4 mb-4 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            {participant.github_total_stars.toLocaleString()} stars
          </span>
          <span className="flex items-center gap-1">
            <Github className="w-3 h-3" />
            {participant.github_public_repos} repos
          </span>
          {participant.github_followers > 0 && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {participant.github_followers}
            </span>
          )}
        </div>
      )}

      {/* Vote Section */}
      <div className="pt-4 border-t border-white/5">
        {/* Vote Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[var(--text-secondary)]">
              {participant.vote_count} vote{participant.vote_count !== 1 ? 's' : ''}
            </span>
            {maxVotes > 0 && (
              <span className="text-[var(--text-secondary)]">
                {Math.round(votePercentage)}%
              </span>
            )}
          </div>
          <div className="progress-bar">
            <div
              className={
                participant.is_winner
                  ? 'progress-bar-fill progress-bar-fill-gold'
                  : isBH
                  ? 'progress-bar-fill progress-bar-fill-bh'
                  : 'progress-bar-fill progress-bar-fill-st'
              }
              style={{ width: `${votePercentage}%` }}
            />
          </div>
        </div>

        {/* Vote Button */}
        <VoteButton
          participantId={participant.id}
          eventId={participant.event_id}
          variant={variant}
        />
      </div>
    </div>
  );
}