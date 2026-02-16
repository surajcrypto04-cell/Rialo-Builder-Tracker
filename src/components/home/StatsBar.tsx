'use client';

import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { Users, Code, Vote, Trophy } from 'lucide-react';

export default function StatsBar() {
  const { ref, isInView } = useInView(0.3);

  return (
    <div ref={ref} className="relative py-8 border-y border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <StatItem
            icon={<Users className="w-5 h-5 text-[var(--bh-accent)]" />}
            value={0}
            label="Builders"
            isInView={isInView}
          />
          <StatItem
            icon={<Code className="w-5 h-5 text-[var(--st-accent)]" />}
            value={0}
            label="Projects"
            isInView={isInView}
          />
          <StatItem
            icon={<Vote className="w-5 h-5 text-purple-400" />}
            value={0}
            label="Votes Cast"
            isInView={isInView}
          />
          <StatItem
            icon={<Trophy className="w-5 h-5 text-[var(--gold)]" />}
            value={0}
            label="Winners"
            isInView={isInView}
          />
        </div>
      </div>
    </div>
  );
}

function StatItem({
  icon,
  value,
  label,
  isInView,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  isInView: boolean;
}) {
  const count = useCountUp(value, 1500, isInView);

  return (
    <div className="flex items-center gap-3 justify-center">
      <div className="p-2 rounded-lg bg-white/5">{icon}</div>
      <div>
        <div className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
          {count}
        </div>
        <div className="text-xs sm:text-sm text-[var(--text-secondary)]">{label}</div>
      </div>
    </div>
  );
}