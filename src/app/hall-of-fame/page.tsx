'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Participant } from '@/types';
import { Trophy, Hammer, Fish, Star, ExternalLink, Github, Twitter } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import Link from 'next/link';

export default function HallOfFamePage() {
  const [winners, setWinners] = useState<(Participant & { event?: any })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWinners() {
      try {
        const { data } = await supabase
          .from('participants')
          .select('*, event:events(*)')
          .eq('is_winner', true)
          .order('created_at', { ascending: false });

        if (data) setWinners(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWinners();
  }, []);

  const bhWinners = winners.filter((w) => w.event?.event_type === 'builders_hub');
  const stWinners = winners.filter((w) => w.event?.event_type === 'shark_tank');

  return (
    <div className="min-h-screen pt-8 pb-12 sm:pt-10 sm:pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 mb-6">
            <Trophy className="w-4 h-4 text-[var(--gold)]" />
            <span className="text-sm font-medium text-[var(--gold)]">Hall of Fame</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[var(--gold)] to-[var(--bh-accent)] bg-clip-text text-transparent">
              Champions
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            The builders who rose above. Every winner, every week, immortalized.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 h-24 skeleton" />
            ))}
          </div>
        ) : winners.length === 0 ? (
          <div className="glass-card p-16 text-center max-w-lg mx-auto">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">No Winners Yet</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              The first champion will be crowned soon. Stay tuned!
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Builder's Hub Winners */}
            {bhWinners.length > 0 && (
              <WinnerSection
                title="Builder's Hub Champions"
                icon={<Hammer className="w-5 h-5 text-[var(--bh-accent)]" />}
                winners={bhWinners}
                variant="builders_hub"
              />
            )}

            {/* Shark Tank Winners */}
            {stWinners.length > 0 && (
              <WinnerSection
                title="Shark Tank Survivors"
                icon={<Fish className="w-5 h-5 text-[var(--st-accent)]" />}
                winners={stWinners}
                variant="shark_tank"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function WinnerSection({
  title,
  icon,
  winners,
  variant,
}: {
  title: string;
  icon: React.ReactNode;
  winners: (Participant & { event?: any })[];
  variant: 'builders_hub' | 'shark_tank';
}) {
  const { ref, isInView } = useInView(0.1);
  const isBH = variant === 'builders_hub';

  return (
    <div ref={ref}>
      <div
        className={`flex items-center gap-3 mb-6 transition-all duration-700 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {icon}
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
      </div>

      <div className="space-y-4">
        {winners.map((winner, index) => (
          <div
            key={winner.id}
            className={`glass-card-winner p-5 sm:p-6 transition-all duration-500 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${(index + 1) * 0.15}s` }}
          >
            <div className="flex items-center gap-4">
              {/* Trophy Number */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center text-lg sm:text-xl font-bold text-[var(--gold)] flex-shrink-0">
                🏆
              </div>

              {/* Avatar */}
              <Link href={`/profile/${winner.discord_id}`}>
                <img
                 src={
                        winner.discord_avatar_url ||
                        winner.github_avatar_url ||
                        `https://api.dicebear.com/7.x/identicon/svg?seed=${winner.discord_id}`
                        }
                  alt={winner.discord_username}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-[var(--gold)]/30 flex-shrink-0"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${winner.discord_id}`}>
                  <h3 className="font-semibold text-sm sm:text-base text-[var(--text-primary)] hover:underline truncate">
                    {winner.discord_username}
                  </h3>
                </Link>
                <p className="text-xs sm:text-sm text-[var(--gold)] font-medium truncate">
                  {winner.project_name}
                </p>
                <p className="text-xs text-[var(--text-secondary)] truncate hidden sm:block">
                  {winner.project_one_liner}
                </p>
              </div>

              {/* Week */}
              <div className="text-right hidden sm:block flex-shrink-0">
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    isBH
                      ? 'bg-[var(--bh-accent)]/10 text-[var(--bh-accent)]'
                      : 'bg-[var(--st-accent)]/10 text-[var(--st-accent)]'
                  }`}
                >
                  Week {winner.event?.week_number}
                </div>
              </div>

              {/* Votes */}
              <div className="text-right flex-shrink-0">
                <div className="text-sm sm:text-base font-bold text-[var(--gold)]">
                  {winner.vote_count}
                </div>
                <div className="text-[10px] sm:text-xs text-[var(--text-secondary)]">votes</div>
              </div>

              {/* Links */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {winner.twitter_handle && (
                  <a
                    href={`https://twitter.com/${winner.twitter_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[#1DA1F2] transition-colors"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                  </a>
                )}
                {winner.github_username && (
                  <a
                    href={`https://github.com/${winner.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-white transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
                {winner.project_link && (
                  <a
                    href={winner.project_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--st-accent)] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}