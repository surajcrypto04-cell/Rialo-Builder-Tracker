'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchParticipantsWithProfiles } from '@/lib/helpers';
import { Participant, Event } from '@/types';
import BuilderCard from '@/components/BuilderCard';
import { Hammer, Filter } from 'lucide-react';
import { PROJECT_CATEGORIES } from '@/lib/constants';

export default function BuildersHubPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data } = await supabase
          .from('events')
          .select('*')
          .eq('event_type', 'builders_hub')
          .order('week_number', { ascending: false });

        if (data && data.length > 0) {
          setEvents(data);
          setSelectedEventId(data[0].id);
        } else {
          setLoading(false);
        }
      } catch (error) { console.error('Error fetching events:', error); setLoading(false); }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;

    async function fetchParticipants() {
      setLoading(true);
      try {
        const parts = await fetchParticipantsWithProfiles(selectedEventId);
        setParticipants(parts);
      } catch (error) { console.error('Error fetching participants:', error); }
      finally { setLoading(false); }
    }
    fetchParticipants();
  }, [selectedEventId]);

  const filtered = selectedCategory === 'all' ? participants : participants.filter((p) => p.project_category === selectedCategory);

  // Sort by votes for ranking
  const rankedParticipants = [...filtered].sort((a, b) => b.vote_count - a.vote_count);
  const maxVotes = Math.max(...rankedParticipants.map((p) => p.vote_count), 1);

  return (
    <div className="bh-section" style={{ minHeight: '100vh', padding: '48px 0 80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.2)', marginBottom: '24px' }}>
            <Hammer style={{ width: 16, height: 16, color: 'var(--bh-accent)' }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--bh-accent)' }}>Builder&apos;s Hub</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, marginBottom: '12px' }}>
            <span style={{ background: 'linear-gradient(90deg, var(--bh-accent), var(--bh-accent-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>The Workshop</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>All Builder&apos;s Hub projects. Filter, explore, and vote.</p>
        </div>

        {/* Weekly Ladder Timeline (Tabs) */}
        {events.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', overflowX: 'auto', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', padding: '6px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {events.map((event) => {
                const isActive = selectedEventId === event.id;
                return (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    style={{
                      padding: '10px 20px', borderRadius: '12px', border: 'none',
                      background: isActive ? 'var(--bh-accent)' : 'transparent',
                      color: isActive ? 'black' : 'var(--text-secondary)',
                      fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.2s', whiteSpace: 'nowrap'
                    }}
                  >
                    Week {event.week_number}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
          {['all', ...PROJECT_CATEGORIES].map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                background: selectedCategory === cat ? 'rgba(255,140,0,0.1)' : 'rgba(255,255,255,0.05)',
                color: selectedCategory === cat ? 'var(--bh-accent)' : 'var(--text-secondary)',
                outline: selectedCategory === cat ? '1px solid rgba(255,140,0,0.3)' : '1px solid transparent',
              }}>
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {[1, 2, 3].map((i) => <div key={i} className="glass-card-bh skeleton" style={{ height: '300px', borderRadius: '16px' }} />)}
          </div>
        ) : rankedParticipants.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {rankedParticipants.map((p, idx) => (
              <BuilderCard
                key={p.id}
                participant={p}
                variant="builders_hub"
                maxVotes={maxVotes}
                rank={idx + 1} // Pass rank based on sorted order
              />
            ))}
          </div>
        ) : (
          <div className="glass-card-bh" style={{ padding: '64px', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏗️</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No Projects Found</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {selectedCategory !== 'all' ? `No ${selectedCategory} projects for Week ${events.find(e => e.id === selectedEventId)?.week_number}.` : 'No projects found for this week.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}