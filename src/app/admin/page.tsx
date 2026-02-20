'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Event, Participant } from '@/types';
import { Shield, Plus, Calendar, Users, Trophy, Trash2, Eye, Loader2, AlertCircle, RefreshCw, Lock, CheckCircle, Vote } from 'lucide-react';
import AddParticipantForm from '@/components/admin/AddParticipantForm';
import EventManager from '@/components/admin/EventManager';

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [pinError, setPinError] = useState('');
  const [pinLoading, setPinLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'events' | 'add' | 'manage'>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  // Check auth on mount by trying to fetch data
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      // Try to fetch events to see if we have access
      const res = await fetch('/api/admin/events');
      if (res.ok) {
        setAuthenticated(true);
        fetchData();
      } else {
        setAuthenticated(false);
        setLoading(false);
      }
    } catch {
      setAuthenticated(false);
      setLoading(false);
    }
  }

  async function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPinLoading(true);
    setPinError('');
    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        setAuthenticated(true);
        fetchData();
      } else {
        setPinError('Incorrect PIN. Please try again.');
        setPin('');
      }
    } catch {
      setPinError('Error verifying PIN. Please try again.');
    } finally {
      setPinLoading(false);
    }
  }

  async function fetchData() {
    setLoading(true);
    try {
      const { data: eventsData } = await fetch('/api/admin/events').then(res => res.json());
      const { data: participantsData } = await fetch('/api/admin/participants').then(res => res.json());
      if (Array.isArray(eventsData)) setEvents(eventsData);
      if (Array.isArray(participantsData)) setParticipants(participantsData);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setAuthenticated(false);
      setPin('');
      window.location.reload();
    } catch {
      window.location.reload();
    }
  }

  // ── PIN Gate ──
  if (!authenticated) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
          <div style={{ width: 64, height: 64, borderRadius: '20px', background: 'rgba(255,140,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Lock style={{ width: 28, height: 28, color: 'var(--bh-accent)' }} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Admin Access</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Enter your admin PIN to continue
          </p>

          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setPinError(''); }}
              placeholder="Enter PIN"
              suppressHydrationWarning
              autoFocus
              style={{
                width: '100%', padding: '14px 18px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.05)', border: `1px solid ${pinError ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
                color: 'var(--text-primary)', fontSize: '18px', outline: 'none',
                textAlign: 'center', letterSpacing: '6px', marginBottom: '12px',
              }}
            />

            {pinError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '16px' }}>
                <AlertCircle style={{ width: 15, height: 15, color: '#ef4444', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#ef4444' }}>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={pinLoading || !pin.trim()}
              style={{
                width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, var(--bh-accent), var(--bh-accent-light))',
                color: 'black', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                opacity: pinLoading || !pin.trim() ? 0.5 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {pinLoading ? <Loader2 className="animate-spin" style={{ width: 18, height: 18 }} /> : <CheckCircle style={{ width: 18, height: 18 }} />}
              {pinLoading ? 'Verifying...' : 'Enter Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Admin Panel ──
  const stats = {
    events: events.length,
    participants: participants.length,
    winners: participants.filter((p) => p.is_winner).length,
    openVoting: events.filter((e) => e.voting_status === 'open').length,
  };

  return (
    <div style={{ minHeight: '80vh', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(255,140,0,0.1)' }}>
              <Shield style={{ width: 24, height: 24, color: 'var(--bh-accent)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>Admin Panel</h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Manage events, participants, and voting</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={fetchData}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}
            >
              <RefreshCw style={{ width: 14, height: 14 }} /> Refresh
            </button>
            <button
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', fontSize: '13px', cursor: 'pointer' }}
            >
              <Lock style={{ width: 14, height: 14 }} /> Lock
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {[
            { icon: <Calendar style={{ width: 20, height: 20, color: 'var(--bh-accent)' }} />, label: 'Events', value: stats.events, color: 'rgba(255,140,0,0.1)' },
            { icon: <Users style={{ width: 20, height: 20, color: 'var(--st-accent)' }} />, label: 'Participants', value: stats.participants, color: 'rgba(0,200,255,0.1)' },
            { icon: <Trophy style={{ width: 20, height: 20, color: 'var(--gold)' }} />, label: 'Winners', value: stats.winners, color: 'rgba(255,215,0,0.1)' },
            { icon: <Vote style={{ width: 20, height: 20, color: '#22c55e' }} />, label: 'Open Voting', value: stats.openVoting, color: 'rgba(34,197,94,0.1)' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: stat.color, flexShrink: 0 }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0' }}>
          {(['events', 'add', 'manage'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px', borderRadius: '10px 10px 0 0', border: 'none',
                background: activeTab === tab ? 'rgba(255,140,0,0.1)' : 'transparent',
                color: activeTab === tab ? 'var(--bh-accent)' : 'var(--text-secondary)',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                borderBottom: activeTab === tab ? '2px solid var(--bh-accent)' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {tab === 'events' && <><Calendar style={{ width: 14, height: 14, display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />Manage Events</>}
              {tab === 'add' && <><Plus style={{ width: 14, height: 14, display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />Add Participant</>}
              {tab === 'manage' && <><Eye style={{ width: 14, height: 14, display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />All Participants</>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px' }}>
            <Loader2 className="animate-spin" style={{ width: 32, height: 32, color: 'var(--text-secondary)' }} />
          </div>
        ) : (
          <>
            {activeTab === 'events' && <EventManager events={events} onRefresh={fetchData} />}
            {activeTab === 'add' && <AddParticipantForm events={events} onSuccess={fetchData} />}
            {activeTab === 'manage' && <ParticipantsList participants={participants} events={events} onRefresh={fetchData} />}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Participants List ── */
function ParticipantsList({ participants, events, onRefresh }: { participants: Participant[]; events: Event[]; onRefresh: () => void }) {
  const [editingVotes, setEditingVotes] = useState<string | null>(null);
  const [voteInput, setVoteInput] = useState('');
  const [savingVotes, setSavingVotes] = useState(false);

  const getEventTitle = (eventId: string) => events.find((e) => e.id === eventId)?.title || 'Unknown Event';

  async function handleDeleteParticipant(id: string) {
    if (!confirm('Delete this participant?')) return;
    try {
      const res = await fetch('/api/admin/participants', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) onRefresh();
      else alert('Failed to delete');
    } catch { alert('Error'); }
  }

  async function handleToggleWinner(participant: Participant) {
    try {
      const res = await fetch('/api/admin/participants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: participant.id, is_winner: !participant.is_winner }),
      });
      if (res.ok) onRefresh();
    } catch { alert('Error'); }
  }

  async function handleSaveVotes(participant: Participant) {
    const newCount = parseInt(voteInput);
    if (isNaN(newCount) || newCount < 0) { alert('Invalid vote count'); return; }

    setSavingVotes(true);
    try {
      const res = await fetch('/api/admin/participants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: participant.id, vote_count: newCount }),
      });
      if (res.ok) { setEditingVotes(null); onRefresh(); }
      else alert('Failed to update votes');
    } catch { alert('Error'); }
    finally { setSavingVotes(false); }
  }

  if (participants.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <Users style={{ width: 48, height: 48, color: 'var(--text-secondary)', margin: '0 auto 20px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No Participants Yet</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Add participants using the "Add Participant" tab.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {participants.map((p) => (
        <div key={p.id} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <img
            src={p.discord_avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${p.discord_id}`}
            alt={p.discord_username}
            style={{ width: 40, height: 40, borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.discord_username} — <span style={{ color: 'var(--bh-accent)', fontWeight: 500 }}>{p.project_name}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{getEventTitle(p.event_id)}</div>
          </div>

          {/* Vote Count Editor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {editingVotes === p.id ? (
              <>
                <input
                  type="number"
                  value={voteInput}
                  onChange={(e) => setVoteInput(e.target.value)}
                  min={0}
                  style={{ width: '70px', padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
                  autoFocus
                />
                <button
                  onClick={() => handleSaveVotes(p)}
                  disabled={savingVotes}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {savingVotes ? '...' : 'Save'}
                </button>
                <button
                  onClick={() => setEditingVotes(null)}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </>
            ) : (
              <button
                onClick={() => { setEditingVotes(p.id); setVoteInput(String(p.vote_count)); }}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer' }}
              >
                🗳️ {p.vote_count} votes
              </button>
            )}
          </div>

          {/* Winner Toggle */}
          <button
            onClick={() => handleToggleWinner(p)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: p.is_winner ? 'rgba(255,215,0,0.1)' : 'rgba(255,215,0,0.04)', color: p.is_winner ? 'var(--gold)' : 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, cursor: 'pointer', flexShrink: 0 }}
          >
            {p.is_winner ? '🏆 Winner' : 'Mark Winner'}
          </button>

          {/* Delete */}
          <button
            onClick={() => handleDeleteParticipant(p.id)}
            style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.06)', color: '#ef4444', cursor: 'pointer', flexShrink: 0 }}
          >
            <Trash2 style={{ width: 15, height: 15 }} />
          </button>
        </div>
      ))}
    </div>
  );
}