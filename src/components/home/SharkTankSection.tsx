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
          setCurrentEvent(events[0]);
          const { data: parts } = await supabase
            .from('participants')
            .select('*')
            .eq('event_id', events[0].id)
            .order('vote_count', { ascending: false });
          if (parts) setParticipants(parts);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const maxVotes = Math.max(...participants.map((p) => p.vote_count), 1);

  return (
    <section id="shark-tank" className="st-section" style={{ padding: '80px 0', position: 'relative' }}>
      {/* Bubbles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="bubble" /><div className="bubble" /><div className="bubble" /><div className="bubble" />
        <div className="bubble" /><div className="bubble" /><div className="bubble" /><div className="bubble" />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div ref={ref} style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '9999px',
              background: 'rgba(0, 200, 255, 0.08)',
              border: '1px solid rgba(0, 200, 255, 0.2)',
              marginBottom: '24px',
            }}
          >
            <Fish style={{ width: 16, height: 16, color: 'var(--st-accent)' }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--st-accent)' }}>Shark Tank</span>
            {currentEvent && (
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>— Week {currentEvent.week_number}</span>
            )}
          </div>

          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-primary)' }}>The </span>
            <span style={{ background: 'linear-gradient(90deg, var(--st-accent-light), var(--st-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Deep End
            </span>
          </h2>

          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            High stakes, big pitches. Builders present their boldest ideas and the community decides who survives the tank.
          </p>

          {currentEvent && (
            <div
              style={{
                marginTop: '24px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div
                style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: currentEvent.voting_status === 'open' ? '#22c55e' : currentEvent.voting_status === 'upcoming' ? '#eab308' : '#ef4444',
                }}
              />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Voting {currentEvent.voting_status === 'open' ? 'Open' : currentEvent.voting_status === 'upcoming' ? 'Opens Soon' : 'Closed'}
              </span>
            </div>
          )}
        </div>

        {/* Cards */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card-st" style={{ padding: '24px', height: '300px' }}>
                <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
              </div>
            ))}
          </div>
        ) : participants.length > 0 ? (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: participants.length === 1 ? '1fr' : participants.length === 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                gap: '24px',
                maxWidth: participants.length === 1 ? '420px' : participants.length === 2 ? '840px' : '100%',
                margin: '0 auto',
              }}
            >
              {participants.map((participant) => (
                <BuilderCard key={participant.id} participant={participant} variant="shark_tank" maxVotes={maxVotes} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link
                href="/shark-tank"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 200, 255, 0.2)',
                  color: 'var(--st-accent)',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                View All Pitches
                <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>
          </>
        ) : (
          <div className="glass-card-st" style={{ padding: '64px 24px', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🦈</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Coming Soon</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              The Shark Tank is preparing! Pitches will appear here once the first round begins.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}