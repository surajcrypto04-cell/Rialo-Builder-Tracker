'use client';

import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { supabase } from '@/lib/supabase';
import { Participant, Event } from '@/types';
import BuilderCard from '@/components/BuilderCard';
import { Hammer, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BuildersHubSection() {
  const { ref, isInView } = useInView(0.1);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get the latest builders hub event
        const { data: events } = await supabase
          .from('events')
          .select('*')
          .eq('event_type', 'builders_hub')
          .order('week_number', { ascending: false })
          .limit(1);

        if (events && events.length > 0) {
          const event = events[0];
          setCurrentEvent(event);

          // Get participants for this event
          const { data: parts } = await supabase
            .from('participants')
            .select('*')
            .eq('event_id', event.id)
            .order('vote_count', { ascending: false });

          if (parts) setParticipants(parts);
        }
      } catch (error) {
        console.error('Error fetching builders hub data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const maxVotes = Math.max(...participants.map((p) => p.vote_count), 1);

  return (
    <section id="builders-hub" className="bh-section py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={ref}
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Section Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bh-accent)]/10 border border-[var(--bh-accent)]/20 mb-6">
            <Hammer className="w-4 h-4 text-[var(--bh-accent)]" />
            <span className="text-sm font-medium text-[var(--bh-accent)]">
              Builder&apos;s Hub
            </span>
            {currentEvent && (
              <span className="text-xs text-[var(--text-secondary)]">
                — Week {currentEvent.week_number}
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[var(--text-primary)]">The </span>
            <span className="bg-gradient-to-r from-[var(--bh-accent)] to-[var(--bh-accent-light)] bg-clip-text text-transparent">
              Workshop
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Where builders showcase their latest projects. Vote for your favorites
            and help the best ideas rise to the top.
          </p>

          {/* Voting Status */}
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
              <CardSkeleton key={i} />
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
                    variant="builders_hub"
                    maxVotes={maxVotes}
                  />
                </div>
              ))}
            </div>

            {/* View All Link */}
            <div className="text-center mt-10">
              <Link
                href="/builders-hub"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--bh-border)] text-[var(--bh-accent)] hover:bg-[var(--bh-accent)]/5 transition-all hover:scale-105"
              >
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          <EmptyState variant="builders_hub" />
        )}
      </div>
    </section>
  );
}

function CardSkeleton() {
  return (
    <div className="glass-card-bh p-6">
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

function EmptyState({ variant }: { variant: string }) {
  const isBH = variant === 'builders_hub';

  return (
    <div
      className={`${isBH ? 'glass-card-bh' : 'glass-card-st'} p-12 sm:p-16 text-center max-w-lg mx-auto`}
    >
      <div className="text-5xl mb-4">{isBH ? '🏗️' : '🦈'}</div>
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
        Coming Soon
      </h3>
      <p className="text-sm text-[var(--text-secondary)]">
        {isBH
          ? "The Builder's Hub is gearing up! Projects will appear here once the first week kicks off."
          : 'The Shark Tank is preparing! Pitches will appear here once the first round begins.'}
      </p>
    </div>
  );
}