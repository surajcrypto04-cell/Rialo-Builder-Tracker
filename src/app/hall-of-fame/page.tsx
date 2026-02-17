'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Participant } from '@/types';
import { Trophy, Hammer, Fish, ExternalLink, Github, Twitter, Star, Users, Calendar, Crown, Award } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
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
      } catch (error) { console.error('Error:', error); }
      finally { setLoading(false); }
    }
    fetchWinners();
  }, []);

  const bhWinners = winners.filter((w) => w.event?.event_type === 'builders_hub');
  const stWinners = winners.filter((w) => w.event?.event_type === 'shark_tank');
  const totalVotes = winners.reduce((sum, w) => sum + w.vote_count, 0);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <HallOfFameHero totalWinners={winners.length} totalVotes={totalVotes} />

      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 80px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '20px' }} />
            ))}
          </div>
        ) : winners.length === 0 ? (
          <EmptyHallOfFame />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
            {bhWinners.length > 0 && (
              <WinnerSection
                title="Builder's Hub Champions"
                subtitle="Masters of the workshop. Voted best by the community."
                icon={<Hammer style={{ width: 22, height: 22, color: 'var(--bh-accent)' }} />}
                winners={bhWinners}
                variant="builders_hub"
                accentColor="var(--bh-accent)"
              />
            )}

            {stWinners.length > 0 && (
              <WinnerSection
                title="Shark Tank Survivors"
                subtitle="Conquered the deep end. Their pitches won the crowd."
                icon={<Fish style={{ width: 22, height: 22, color: 'var(--st-accent)' }} />}
                winners={stWinners}
                variant="shark_tank"
                accentColor="var(--st-accent)"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ HERO ============ */
function HallOfFameHero({ totalWinners, totalVotes }: { totalWinners: number; totalVotes: number }) {
  const { ref, isInView } = useInView(0.1);
  const winnersCount = useCountUp(totalWinners, 1500, isInView);
  const votesCount = useCountUp(totalVotes, 1500, isInView);

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        padding: '80px 24px 64px',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background glows */}
      <div style={{ position: 'absolute', top: '10%', left: '30%', width: 500, height: 500, borderRadius: '50%', background: 'var(--gold)', opacity: 0.02, filter: 'blur(120px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '30%', width: 400, height: 400, borderRadius: '50%', background: 'var(--bh-accent)', opacity: 0.015, filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
        {/* Trophy Icon */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,140,0,0.1))',
            border: '1px solid rgba(255,215,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
            fontSize: '36px',
          }}
          className="animate-float"
        >
          🏆
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '9999px',
            background: 'rgba(255,215,0,0.08)',
            border: '1px solid rgba(255,215,0,0.2)',
            marginBottom: '24px',
          }}
        >
          <Award style={{ width: 14, height: 14, color: 'var(--gold)' }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gold)' }}>Hall of Fame</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(32px, 6vw, 56px)',
            fontWeight: 800,
            marginBottom: '16px',
            lineHeight: 1.1,
          }}
        >
          <span style={{ background: 'linear-gradient(135deg, var(--gold), var(--bh-accent), var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Champions
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          The builders who rose above. Every winner, every week, immortalized forever in the Rialo Hall of Fame.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--gold)', lineHeight: 1 }}>{winnersCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Champions</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--bh-accent)', lineHeight: 1 }}>{votesCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Total Votes</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ WINNER SECTION ============ */
function WinnerSection({
  title,
  subtitle,
  icon,
  winners,
  variant,
  accentColor,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  winners: (Participant & { event?: any })[];
  variant: 'builders_hub' | 'shark_tank';
  accentColor: string;
}) {
  const { ref, isInView } = useInView(0.1);
  const isBH = variant === 'builders_hub';

  return (
    <div ref={ref}>
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '12px',
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease',
        }}
      >
        <div
          style={{
            padding: '10px',
            borderRadius: '14px',
            background: isBH ? 'rgba(255,140,0,0.1)' : 'rgba(0,200,255,0.1)',
            border: `1px solid ${isBH ? 'rgba(255,140,0,0.15)' : 'rgba(0,200,255,0.15)'}`,
          }}
        >
          {icon}
        </div>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '2px' }}>{title}</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{subtitle}</p>
        </div>
      </div>

      {/* Winner Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {winners.map((winner, index) => (
          <WinnerCard
            key={winner.id}
            winner={winner}
            rank={index + 1}
            variant={variant}
            accentColor={accentColor}
            isInView={isInView}
            delay={index * 0.12}
          />
        ))}
      </div>
    </div>
  );
}

/* ============ WINNER CARD ============ */
function WinnerCard({
  winner,
  rank,
  variant,
  accentColor,
  isInView,
  delay,
}: {
  winner: Participant & { event?: any };
  rank: number;
  variant: 'builders_hub' | 'shark_tank';
  accentColor: string;
  isInView: boolean;
  delay: number;
}) {
  const isBH = variant === 'builders_hub';

  return (
    <div
      style={{
        background: 'rgba(255, 215, 0, 0.02)',
        border: '1px solid rgba(255, 215, 0, 0.1)',
        borderRadius: '20px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.5s ease ${delay}s`,
      }}
    >
      {/* Subtle golden gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          opacity: 0.4,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Rank */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: rank === 1 ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,140,0,0.1))' : 'rgba(255,215,0,0.06)',
            border: rank === 1 ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,215,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: rank === 1 ? '24px' : '20px',
          }}
        >
          {rank === 1 ? '👑' : '🏆'}
        </div>

        {/* Avatar */}
        <Link href={`/profile/${winner.discord_id}`} style={{ flexShrink: 0 }}>
          <img
            src={winner.discord_avatar_url || winner.github_avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${winner.discord_id}`}
            alt={winner.discord_username}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              objectFit: 'cover',
              border: '2px solid rgba(255,215,0,0.2)',
            }}
          />
        </Link>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <Link href={`/profile/${winner.discord_id}`} style={{ textDecoration: 'none' }}>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.textDecoration = 'underline'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.textDecoration = 'none'; }}
              >
                {winner.discord_username}
              </h3>
            </Link>

            {/* Event Badge */}
            <span
              style={{
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '10px',
                fontWeight: 600,
                background: isBH ? 'rgba(255,140,0,0.1)' : 'rgba(0,200,255,0.1)',
                color: accentColor,
                border: `1px solid ${isBH ? 'rgba(255,140,0,0.15)' : 'rgba(0,200,255,0.15)'}`,
              }}
            >
              Week {winner.event?.week_number}
            </span>
          </div>

          {/* Project Name */}
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gold)', marginBottom: '4px' }}>
            {winner.project_name}
          </div>

          {/* One Liner */}
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {winner.project_one_liner}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            {winner.project_category && (
              <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {winner.project_category}
              </span>
            )}
            {winner.tech_stack.slice(0, 3).map((tech) => (
              <span key={tech} style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '10px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Votes */}
        <div style={{ textAlign: 'center', flexShrink: 0, minWidth: '70px' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gold)', lineHeight: 1 }}>
            {winner.vote_count}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            votes
          </div>
        </div>

        {/* Social Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
          {winner.project_link && (
            <SocialBtn href={winner.project_link} icon={<ExternalLink style={{ width: 14, height: 14 }} />} title="Live Project" />
          )}
          {winner.github_username && (
            <SocialBtn href={`https://github.com/${winner.github_username}`} icon={<Github style={{ width: 14, height: 14 }} />} title="GitHub" />
          )}
          {winner.twitter_handle && (
            <SocialBtn href={`https://twitter.com/${winner.twitter_handle}`} icon={<Twitter style={{ width: 14, height: 14 }} />} title="Twitter" />
          )}
        </div>
      </div>
    </div>
  );
}

function SocialBtn({ href, icon, title }: { href: string; icon: React.ReactNode; title: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      style={{
        padding: '8px',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
      }}
    >
      {icon}
    </a>
  );
}

/* ============ EMPTY STATE ============ */
function EmptyHallOfFame() {
  return (
    <div
      style={{
        padding: '80px 24px',
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto',
        background: 'rgba(255,215,0,0.02)',
        border: '1px solid rgba(255,215,0,0.08)',
        borderRadius: '24px',
      }}
    >
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏆</div>
      <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: 'var(--gold)' }}>
        The Throne Awaits
      </h3>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
        No champions have been crowned yet. The first winner of the Builder&apos;s Hub or Shark Tank will be immortalized here forever.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <Link
          href="/builders-hub"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            background: 'rgba(255,140,0,0.1)',
            border: '1px solid rgba(255,140,0,0.2)',
            color: 'var(--bh-accent)',
            fontSize: '13px',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          <Hammer style={{ width: 14, height: 14 }} />
          Builder&apos;s Hub
        </Link>
        <Link
          href="/shark-tank"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '12px',
            background: 'rgba(0,200,255,0.1)',
            border: '1px solid rgba(0,200,255,0.2)',
            color: 'var(--st-accent)',
            fontSize: '13px',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          <Fish style={{ width: 14, height: 14 }} />
          Shark Tank
        </Link>
      </div>
    </div>
  );
}