'use client';

import { useState } from 'react';
import { Event } from '@/types';
import { Plus, Calendar, Loader2, Hammer, Fish, PlayCircle, StopCircle, Trash2 } from 'lucide-react';

interface EventManagerProps { events: Event[]; onRefresh: () => void; }

export default function EventManager({ events, onRefresh }: EventManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState<'builders_hub' | 'shark_tank'>('builders_hub');
  const [weekNumber, setWeekNumber] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: eventType, week_number: weekNumber, title: title || `${eventType === 'builders_hub' ? "Builder's Hub" : 'Shark Tank'} Week ${weekNumber}`, description }),
      });
      if (res.ok) { setShowForm(false); setTitle(''); setDescription(''); onRefresh(); }
      else { const d = await res.json(); alert(d.error || 'Failed'); }
    } catch { alert('Error'); }
    finally { setLoading(false); }
  }

  async function handleStatus(id: string, status: string) {
    try { const res = await fetch('/api/admin/events', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, voting_status: status }) }); if (res.ok) onRefresh(); }
    catch { alert('Error'); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event and all its participants?')) return;
    try { const res = await fetch('/api/admin/events', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); if (res.ok) onRefresh(); }
    catch { alert('Error'); }
  }

  return (
    <div>
      {/* Create Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: '1px solid rgba(255,140,0,0.2)', background: 'rgba(255,140,0,0.1)', color: 'var(--bh-accent)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', marginBottom: '24px' }}
      >
        <Plus style={{ width: 16, height: 16 }} /> Create New Event
      </button>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Create New Event</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Event Type</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setEventType('builders_hub')}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: eventType === 'builders_hub' ? '1px solid rgba(255,140,0,0.3)' : '1px solid rgba(255,255,255,0.06)', background: eventType === 'builders_hub' ? 'rgba(255,140,0,0.1)' : 'rgba(255,255,255,0.03)', color: eventType === 'builders_hub' ? 'var(--bh-accent)' : 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                  <Hammer style={{ width: 16, height: 16 }} /> Builder&apos;s Hub
                </button>
                <button type="button" onClick={() => setEventType('shark_tank')}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: eventType === 'shark_tank' ? '1px solid rgba(0,200,255,0.3)' : '1px solid rgba(255,255,255,0.06)', background: eventType === 'shark_tank' ? 'rgba(0,200,255,0.1)' : 'rgba(255,255,255,0.03)', color: eventType === 'shark_tank' ? 'var(--st-accent)' : 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                  <Fish style={{ width: 16, height: 16 }} /> Shark Tank
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Week Number</label>
              <input type="number" min={1} value={weekNumber} onChange={(e) => setWeekNumber(parseInt(e.target.value) || 1)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Title (optional)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`${eventType === 'builders_hub' ? "Builder's Hub" : 'Shark Tank'} Week ${weekNumber}`}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Brief description..."
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', resize: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '12px', border: 'none', background: 'var(--bh-accent)', color: 'black', fontSize: '13px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.5 : 1 }}>
              {loading ? <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} /> : <Plus style={{ width: 16, height: 16 }} />} Create Event
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      {events.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Calendar style={{ width: 48, height: 48, color: 'var(--text-secondary)', margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No Events Yet</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Create your first event to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {events.map((event) => (
            <div key={event.id} className="glass-card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Icon */}
                <div style={{ padding: '12px', borderRadius: '12px', background: event.event_type === 'builders_hub' ? 'rgba(255,140,0,0.1)' : 'rgba(0,200,255,0.1)', flexShrink: 0 }}>
                  {event.event_type === 'builders_hub'
                    ? <Hammer style={{ width: 20, height: 20, color: 'var(--bh-accent)' }} />
                    : <Fish style={{ width: 20, height: 20, color: 'var(--st-accent)' }} />}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Week {event.week_number} • {event.event_type === 'builders_hub' ? "Builder's Hub" : 'Shark Tank'}</p>
                </div>

                {/* Status */}
                <span style={{
                  padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600, flexShrink: 0,
                  background: event.voting_status === 'open' ? 'rgba(34,197,94,0.1)' : event.voting_status === 'upcoming' ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)',
                  color: event.voting_status === 'open' ? '#22c55e' : event.voting_status === 'upcoming' ? '#eab308' : '#ef4444',
                }}>
                  {event.voting_status}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  {event.voting_status === 'upcoming' && (
                    <button onClick={() => handleStatus(event.id, 'open')}
                      style={{ padding: '8px', borderRadius: '10px', border: 'none', background: 'rgba(34,197,94,0.1)', color: '#22c55e', cursor: 'pointer' }} title="Open Voting">
                      <PlayCircle style={{ width: 16, height: 16 }} />
                    </button>
                  )}
                  {event.voting_status === 'open' && (
                    <button onClick={() => handleStatus(event.id, 'closed')}
                      style={{ padding: '8px', borderRadius: '10px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer' }} title="Close Voting">
                      <StopCircle style={{ width: 16, height: 16 }} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(event.id)}
                    style={{ padding: '8px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Delete">
                    <Trash2 style={{ width: 16, height: 16 }} />
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