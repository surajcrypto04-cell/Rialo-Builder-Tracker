'use client';

import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { supabase } from '@/lib/supabase';
import { Participant, Event } from '@/types';
import BuilderCard from '@/components/BuilderCard';
import { Fish, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SharkTankSection() {
  const { ref, isInView } = useInView(0.1);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: events } = await supabase
          .from('events')
          .select('*')
          .eq('event_type', 'shark_tank')
          .order('week_number', { ascending: false })
          .limit(1);

        if (events && events.length > 0) {
          const event = events[0];
          setCurrentEvent(event);

          const { data: parts } = await supabase
            .from('participants')
            .select('*')
            .eq('event_id', event.id)
            .order('vote_count', { ascending: false });

          if (parts) setParticipants(parts);
        }
      } catch (error) {
        console.error('Error fetching shark tank data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const maxVotes = Math.max(...participants.map((p) => p.vote_count), 1);

  return (
    <section id="shark-tank" className="st-section py-20 sm:py-28 relative">
      {/* Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
        <div className="bubble" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          ref={ref}
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--st-accent)]/10 border border-[var(--st-accent)]/20 mb-6">
            <Fish className="w-4 h-4 text-[var(--st-accent)]" />
            <span className="text-sm font-medium text-[var(--st-accent)]">
              Shark Tank
            </span>
            {currentEvent && (
              <span className="text-xs text-[var(--text-secondary)]">
                — Week {currentEvent.week_number}
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[var(--text-primary)]">The </span>
            <span className="bg-gradient-to-r from-[var(--st-accent-light)] to-[var(--st-accent)] bg-clip-text text-transparent">
              Deep End
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            High stakes, big pitches. Builders present their boldest ideas
            and the community decides who survives the tank.
          </p>

          {currentEvent && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5">
              <div
                className={`w-2 h-2 rounded-full ${
                  currentEvent.voting_status === 'open'
                    ? 'bg-green-500 animate-pulse'
                    : currentEvent.voting_status === 'upcoming'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              />
              <span className="text-sm text-[var(--text-secondary)]">
                Voting{' '}
                {currentEvent.voting_status === 'open'
                  ? 'Open'
                  : currentEvent.voting_status === 'upcoming'
                  ? 'Opens Soon'
                  : 'Closed'}
              </span>
              {currentEvent.voting_closes_at && currentEvent.voting_status === 'open' && (
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Closes{' '}
                  {new Date(currentEvent.voting_closes_at).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Participants Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <SharkCardSkeleton key={i} />
            ))}
          </div>
        ) : participants.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {participants.map((participant, index) => (
                <div
                  key={participant.id}
                  className={`transition-all duration-500 ${
                    isInView
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 150}ms` }}
                >
                  <BuilderCard
                    participant={participant}
                    variant="shark_tank"
                    maxVotes={maxVotes}
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/shark-tank"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--st-border)] text-[var(--st-accent)] hover:bg-[var(--st-accent)]/5 transition-all hover:scale-105"
              >
                View All Pitches
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}

function SharkCardSkeleton() {
  return (
    <div className="glass-card-st p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl skeleton" />
        <div className="flex-1">
          <div className="w-32 h-5 skeleton mb-2" />
          <div className="w-20 h-3 skeleton" />
        </div>
      </div>
      <div className="w-full h-36 skeleton mb-4 rounded-lg" />
      <div className="w-48 h-5 skeleton mb-2" />
      <div className="w-full h-4 skeleton mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="w-16 h-5 skeleton rounded-full" />
        <div className="w-16 h-5 skeleton rounded-full" />
      </div>
      <div className="w-full h-8 skeleton rounded-lg" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-card-st p-12 sm:p-16 text-center max-w-lg mx-auto">
      <div className="text-5xl mb-4">🦈</div>
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
        Coming Soon
      </h3>
      <p className="text-sm text-[var(--text-secondary)]">
        The Shark Tank is preparing! Pitches will appear here once the first round begins.
      </p>
    </div>
  );
}