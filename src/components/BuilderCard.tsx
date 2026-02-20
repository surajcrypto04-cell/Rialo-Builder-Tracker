'use client';

import { useState } from 'react';
import { Participant } from '@/types';
import { PROJECT_STATUS_CONFIG, CATEGORY_COLORS, TEAM_SIZE_CONFIG } from '@/lib/constants';
import { Github, Twitter, ExternalLink, Users, Star } from 'lucide-react';
import Link from 'next/link';
import VoteDisplay from './VoteDisplay';
import ProjectModal from './ProjectModal';

interface BuilderCardProps {
  participant: Participant;
  variant: 'builders_hub' | 'shark_tank';
  maxVotes: number;
  rank?: number; // 1-based rank by vote count
}

const RANK_CONFIG: Record<number, { emoji: string; color: string; glow: string }> = {
  1: { emoji: '🥇', color: '#FFD700', glow: 'rgba(255,215,0,0.3)' },
  2: { emoji: '🥈', color: '#C0C0C0', glow: 'rgba(192,192,192,0.25)' },
  3: { emoji: '🥉', color: '#CD7F32', glow: 'rgba(205,127,50,0.25)' },
};

export default function BuilderCard({ participant, variant, maxVotes, rank }: BuilderCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isBH = variant === 'builders_hub';
  const cardClass = isBH ? 'glass-card-bh' : 'glass-card-st';
  const accentColor = isBH ? 'var(--bh-accent)' : 'var(--st-accent)';
  const statusConfig = PROJECT_STATUS_CONFIG[participant.project_status];
  const categoryColor = participant.project_category ? CATEGORY_COLORS[participant.project_category] || '#888' : '#888';
  const votePercentage = maxVotes > 0 ? (participant.vote_count / maxVotes) * 100 : 0;
  const rankConfig = rank && rank <= 3 ? RANK_CONFIG[rank] : null;

  return (
    <>
      <div
        className={`${cardClass} p-5 sm:p-6 relative group cursor-pointer`}
        style={rankConfig ? { boxShadow: `0 0 24px ${rankConfig.glow}` } : undefined}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Rank Badge */}
        {rankConfig && (
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: rankConfig.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              zIndex: 20,
              boxShadow: `0 4px 12px ${rankConfig.glow}`,
              border: '2px solid var(--bg-card)',
            }}
            className="animate-pop-in"
          >
            {rankConfig.emoji}
          </div>
        )}

        {/* Winner Trophy Badge */}
        {participant.is_winner && (
          <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--gold)] flex items-center justify-center text-sm sm:text-lg shadow-lg shadow-[var(--gold)]/30 z-20 animate-pop-in border-2 border-[var(--bg-card)]">
            🏆
          </div>
        )}

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <Link href={`/profile/${participant.discord_id}`} className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <img
              src={
                participant.discord_avatar_url ||
                participant.github_avatar_url ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${participant.discord_id}`
              }
              alt={participant.discord_username}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border-2 transition-transform group-hover:scale-105"
              style={{ borderColor: `${accentColor}33` }}
            />
          </Link>

          <div className="flex-1 min-w-0">
            <Link href={`/profile/${participant.discord_id}`} onClick={(e) => e.stopPropagation()}>
              <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] hover:underline truncate">
                {participant.discord_username}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              {participant.twitter_handle && (
                <a href={`https://twitter.com/${participant.twitter_handle}`} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[#1DA1F2] transition-colors" onClick={(e) => e.stopPropagation()}>
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
              {participant.github_username && (
                <a href={`https://github.com/${participant.github_username}`} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {participant.project_link && (
                <a href={participant.project_link} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--st-accent)] transition-colors" onClick={(e) => e.stopPropagation()}>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="text-base flex-shrink-0" title={TEAM_SIZE_CONFIG[participant.team_size].label}>
            {TEAM_SIZE_CONFIG[participant.team_size].icon}
          </div>
        </div>

        {/* Screenshot (with hover scaler) */}
        {participant.project_screenshot_url && (
          <div className="mb-4 rounded-xl overflow-hidden border border-[var(--border-subtle)]">
            <img src={participant.project_screenshot_url} alt={participant.project_name} className="w-full h-36 sm:h-40 object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        )}

        {/* Content Container */}
        <div className="flex flex-col gap-4 mt-4 h-full">
          {/* Project Name + Description */}
          <div>
            <h4 className="text-sm sm:text-base font-bold mb-2" style={{ color: accentColor }}>
              {participant.project_name}
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed font-light">
              {participant.project_one_liner}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {participant.project_category && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium" style={{ background: `${categoryColor}15`, color: categoryColor, border: `1px solid ${categoryColor}30` }}>
                {participant.project_category}
              </span>
            )}
            {participant.tech_stack.slice(0, 3).map((tech) => (
              <span key={tech} className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                {tech}
              </span>
            ))}
            {participant.tech_stack.length > 3 && (
              <span className="px-2 py-0.5 text-[10px] text-[var(--text-muted)]">+{participant.tech_stack.length - 3}</span>
            )}
          </div>

          {/* Status + GitHub Stats */}
          <div className="space-y-3 mt-auto">
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
                <span className="text-[var(--text-secondary)]">{statusConfig.label}</span>
                <span className="text-[var(--text-muted)]">{statusConfig.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className={isBH ? 'progress-bar-fill progress-bar-fill-bh' : 'progress-bar-fill progress-bar-fill-st'} style={{ width: `${statusConfig.progress}%` }} />
              </div>
            </div>

            {participant.github_username && (
              <div className="flex items-center gap-4 text-[11px] text-[var(--text-secondary)]">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[var(--gold)]" />{participant.github_total_stars.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Github className="w-3 h-3" />{participant.github_public_repos}</span>
              </div>
            )}
          </div>

          {/* Vote Section */}
          <div className="pt-4 border-t border-[var(--border-subtle)]">
            <div className="mb-3">
              <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
                <span className="text-[var(--text-secondary)]">{participant.vote_count} vote{participant.vote_count !== 1 ? 's' : ''}</span>
                {maxVotes > 0 && <span className="text-[var(--text-muted)]">{Math.round(votePercentage)}%</span>}
              </div>
              <div className="progress-bar">
                <div
                  className={participant.is_winner ? 'progress-bar-fill progress-bar-fill-gold' : isBH ? 'progress-bar-fill progress-bar-fill-bh' : 'progress-bar-fill progress-bar-fill-st'}
                  style={{ width: `${votePercentage}%` }}
                />
              </div>
            </div>
            <VoteDisplay voteCount={participant.vote_count} variant={variant} isWinner={participant.is_winner} />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProjectModal
          participant={participant}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}