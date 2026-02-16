'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .eq('event_type', 'shark_tank')
          .order('week_number', { ascending: false });

        if (eventsData && eventsData.length > 0) {
          setEvents(eventsData);

          const eventId = selectedEvent === 'latest' ? eventsData[0].id : selectedEvent;

          const { data: parts } = await supabase
            .from('participants')
            .select('*')
            .eq('event_id', eventId)
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
  }, [selectedEvent]);

  const filteredParticipants =
    selectedCategory === 'all'
      ? participants
      : participants.filter((p) => p.project_category === selectedCategory);

  const maxVotes = Math.max(...filteredParticipants.map((p) => p.vote_count), 1);

  return (
    <div className="st-section min-h-screen py-12 sm:py-20 relative">
      {/* Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bubble" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--st-accent)]/10 border border-[var(--st-accent)]/20 mb-6">
            <Fish className="w-4 h-4 text-[var(--st-accent)]" />
            <span className="text-sm font-medium text-[var(--st-accent)]">Shark Tank</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[var(--st-accent-light)] to-[var(--st-accent)] bg-clip-text text-transparent">
              The Deep End
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
            High stakes pitches. Bold ideas. The community decides who survives.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--text-secondary)]" />
            <select
              value={selectedEvent}
              onChange={(e) => {
                setSelectedEvent(e.target.value);
                setLoading(true);
              }}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--st-accent)]/50 appearance-none cursor-pointer"
            >
              <option value="latest" className="bg-[var(--bg-secondary)]">Latest Week</option>
              {events.map((e) => (
                <option key={e.id} value={e.id} className="bg-[var(--bg-secondary)]">
                  {e.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[var(--st-accent)]/10 text-[var(--st-accent)] border border-[var(--st-accent)]/30'
                  : 'bg-white/5 text-[var(--text-secondary)] border border-white/5 hover:bg-white/10'
              }`}
            >
              All
            </button>
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[var(--st-accent)]/10 text-[var(--st-accent)] border border-[var(--st-accent)]/30'
                    : 'bg-white/5 text-[var(--text-secondary)] border border-white/5 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card-st p-6 h-64 skeleton" />
            ))}
          </div>
        ) : filteredParticipants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParticipants.map((participant, index) => (
              <div
                key={participant.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BuilderCard
                  participant={participant}
                  variant="shark_tank"
                  maxVotes={maxVotes}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card-st p-12 text-center max-w-lg mx-auto">
            <div className="text-5xl mb-4">🦈</div>
            <h3 className="text-xl font-bold mb-2">No Pitches Found</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {selectedCategory !== 'all'
                ? `No ${selectedCategory} pitches this round. Try another category.`
                : 'No pitches this round yet. The sharks are waiting!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}