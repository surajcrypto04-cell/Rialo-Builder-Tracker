'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchParticipantsWithProfiles } from '@/lib/helpers';
import { Participant, Event } from '@/types';
import BuilderCard from '@/components/BuilderCard';
import { Fish, Filter } from 'lucide-react';
import { PROJECT_CATEGORIES } from '@/lib/constants';

export default function SharkTankPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('latest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: eventsData } = await supabase.from('events').select('*').eq('event_type', 'shark_tank').order('week_number', { ascending: false });
        if (eventsData && eventsData.length > 0) {
          setEvents(eventsData);
          const eventId = selectedEvent === 'latest' ? eventsData[0].id : selectedEvent;
          const parts = await fetchParticipantsWithProfiles(eventId);
          setParticipants(parts);
        }
      } catch (error) { console.error('Error:', error); }
      finally { setLoading(false); }
    }
    fetchData();
  }, [selectedEvent]);

  const filtered = selectedCategory === 'all' ? participants : participants.filter((p) => p.project_category === selectedCategory);
  const maxVotes = Math.max(...filtered.map((p) => p.vote_count), 1);

  return (
    <div className="st-section" style={{ minHeight: '100vh', padding: '48px 0 80px', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="bubble" /><div className="bubble" /><div className="bubble" /><div className="bubble" />
        <div className="bubble" /><div className="bubble" /><div className="bubble" /><div className="bubble" />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', background: 'rgba(0,200,255,0.08)', border: '1px solid rgba(0,200,255,0.2)', marginBottom: '24px' }}>
            <Fish style={{ width: 16, height: 16, color: 'var(--st-accent)' }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--st-accent)' }}>Shark Tank</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, marginBottom: '12px' }}>
            <span style={{ background: 'linear-gradient(90deg, var(--st-accent-light), var(--st-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>The Deep End</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>High stakes pitches. Bold ideas. The community decides.</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter style={{ width: 16, height: 16, color: 'var(--text-secondary)' }} />
            <select value={selectedEvent} onChange={(e) => { setSelectedEvent(e.target.value); setLoading(true); }}
              style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer' }}>
              <option value="latest" style={{ background: 'var(--bg-secondary)' }}>Latest Week</option>
              {events.map((e) => <option key={e.id} value={e.id} style={{ background: 'var(--bg-secondary)' }}>{e.title}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['all', ...PROJECT_CATEGORIES].map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', border: 'none', transition: 'all 0.3s',
                  background: selectedCategory === cat ? 'rgba(0,200,255,0.1)' : 'rgba(255,255,255,0.05)',
                  color: selectedCategory === cat ? 'var(--st-accent)' : 'var(--text-secondary)',
                  outline: selectedCategory === cat ? '1px solid rgba(0,200,255,0.3)' : '1px solid transparent',
                }}>
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[1, 2, 3].map((i) => <div key={i} className="glass-card-st skeleton" style={{ height: '300px', borderRadius: '16px' }} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {filtered.map((p) => <BuilderCard key={p.id} participant={p} variant="shark_tank" maxVotes={maxVotes} />)}
          </div>
        ) : (
          <div className="glass-card-st" style={{ padding: '64px', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🦈</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No Pitches Found</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {selectedCategory !== 'all' ? `No ${selectedCategory} pitches. Try another category.` : 'No pitches yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}