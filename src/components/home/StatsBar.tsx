'use client';

import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { supabase } from '@/lib/supabase';
import { Users, Code, Vote, Trophy } from 'lucide-react';

export default function StatsBar() {
  const { ref, isInView } = useInView(0.3);
  const [stats, setStats] = useState({ builders: 0, projects: 0, votes: 0, winners: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: participants } = await supabase.from('participants').select('id, vote_count, is_winner, discord_id');

        if (participants) {
          const uniqueBuilders = new Set(participants.map((p) => p.discord_id)).size;
          const totalProjects = participants.length;
          const totalVotes = participants.reduce((sum, p) => sum + p.vote_count, 0);
          const totalWinners = participants.filter((p) => p.is_winner).length;

          setStats({
            builders: uniqueBuilders,
            projects: totalProjects,
            votes: totalVotes,
            winners: totalWinners,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div ref={ref} style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '20px',
            padding: '32px 24px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
            }}
          >
            <StatItem icon={<Users style={{ width: 22, height: 22, color: 'var(--bh-accent)' }} />} value={stats.builders} label="Builders" isInView={isInView} />
            <StatItem icon={<Code style={{ width: 22, height: 22, color: 'var(--st-accent)' }} />} value={stats.projects} label="Projects" isInView={isInView} />
            <StatItem icon={<Vote style={{ width: 22, height: 22, color: '#a78bfa' }} />} value={stats.votes} label="Votes Cast" isInView={isInView} />
            <StatItem icon={<Trophy style={{ width: 22, height: 22, color: 'var(--gold)' }} />} value={stats.winners} label="Winners" isInView={isInView} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, value, label, isInView }: { icon: React.ReactNode; value: number; label: string; isInView: boolean }) {
  const count = useCountUp(value, 1500, isInView);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
      <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1, marginBottom: '4px', color: 'var(--text-primary)' }}>{count}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</div>
      </div>
    </div>
  );
}