'use client';

import { useState } from 'react';
import { Event } from '@/types';
import {
  Plus,
  Calendar,
  Loader2,
  Hammer,
  Fish,
  PlayCircle,
  StopCircle,
  Trash2,
} from 'lucide-react';

interface EventManagerProps {
  events: Event[];
  onRefresh: () => void;
}

export default function EventManager({ events, onRefresh }: EventManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [eventType, setEventType] = useState<'builders_hub' | 'shark_tank'>('builders_hub');
  const [weekNumber, setWeekNumber] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          week_number: weekNumber,
          title: title || `${eventType === 'builders_hub' ? "Builder's Hub" : 'Shark Tank'} Week ${weekNumber}`,
          description,
        }),
      });

      if (res.ok) {
        setShowForm(false);
        setTitle('');
        setDescription('');
        onRefresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create event');
      }
    } catch {
      alert('Error creating event');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(eventId: string, status: string) {
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId, voting_status: status }),
      });

      if (res.ok) {
        onRefresh();
      } else {
        alert('Failed to update event');
      }
    } catch {
      alert('Error updating event');
    }
  }

  async function handleDeleteEvent(eventId: string) {
    if (!confirm('Delete this event? All participants and votes will be removed.')) return;

    try {
      const res = await fetch('/api/admin/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId }),
      });

      if (res.ok) {
        onRefresh();
      } else {
        alert('Failed to delete event');
      }
    } catch {
      alert('Error deleting event');
    }
  }

  return (
    <div>
      {/* Create Event Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bh-accent)]/10 text-[var(--bh-accent)] border border-[var(--bh-accent)]/20 hover:bg-[var(--bh-accent)]/20 transition-all mb-6"
      >
        <Plus className="w-4 h-4" />
        Create New Event
      </button>

      {/* Create Event Form */}
      {showForm && (
        <form onSubmit={handleCreateEvent} className="glass-card p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">Create New Event</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Event Type */}
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                Event Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEventType('builders_hub')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    eventType === 'builders_hub'
                      ? 'bg-[var(--bh-accent)]/10 text-[var(--bh-accent)] border border-[var(--bh-accent)]/30'
                      : 'bg-white/5 text-[var(--text-secondary)] border border-white/5'
                  }`}
                >
                  <Hammer className="w-4 h-4" />
                  Builder&apos;s Hub
                </button>
                <button
                  type="button"
                  onClick={() => setEventType('shark_tank')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    eventType === 'shark_tank'
                      ? 'bg-[var(--st-accent)]/10 text-[var(--st-accent)] border border-[var(--st-accent)]/30'
                      : 'bg-white/5 text-[var(--text-secondary)] border border-white/5'
                  }`}
                >
                  <Fish className="w-4 h-4" />
                  Shark Tank
                </button>
              </div>
            </div>

            {/* Week Number */}
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                Week Number
              </label>
              <input
                type="number"
                min={1}
                value={weekNumber}
                onChange={(e) => setWeekNumber(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors"
              />
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              Title (optional — auto-generated if empty)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`${eventType === 'builders_hub' ? "Builder's Hub" : 'Shark Tank'} Week ${weekNumber}`}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description of this week's event..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--bh-accent)]/50 transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--bh-accent)] text-black font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Create Event
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-xl bg-white/5 text-[var(--text-secondary)] text-sm hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      {events.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Calendar className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">No Events Yet</h3>
          <p className="text-[var(--text-secondary)]">
            Create your first event to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="glass-card p-4 sm:p-5">
              <div className="flex items-center gap-4">
                {/* Type Icon */}
                <div
                  className={`p-3 rounded-xl ${
                    event.event_type === 'builders_hub'
                      ? 'bg-[var(--bh-accent)]/10'
                      : 'bg-[var(--st-accent)]/10'
                  }`}
                >
                  {event.event_type === 'builders_hub' ? (
                    <Hammer
                      className="w-5 h-5"
                      style={{ color: 'var(--bh-accent)' }}
                    />
                  ) : (
                    <Fish
                      className="w-5 h-5"
                      style={{ color: 'var(--st-accent)' }}
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base truncate">
                    {event.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Week {event.week_number} •{' '}
                    {event.event_type === 'builders_hub'
                      ? "Builder's Hub"
                      : 'Shark Tank'}
                  </p>
                </div>

                {/* Status Badge */}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.voting_status === 'open'
                      ? 'bg-green-500/10 text-green-400'
                      : event.voting_status === 'upcoming'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {event.voting_status}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {event.voting_status === 'upcoming' && (
                    <button
                      onClick={() => handleUpdateStatus(event.id, 'open')}
                      className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                      title="Open Voting"
                    >
                      <PlayCircle className="w-4 h-4" />
                    </button>
                  )}

                  {event.voting_status === 'open' && (
                    <button
                      onClick={() => handleUpdateStatus(event.id, 'closed')}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Close Voting"
                    >
                      <StopCircle className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 rounded-lg bg-white/5 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}