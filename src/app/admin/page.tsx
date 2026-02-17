'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Event, Participant } from '@/types';
import { Shield, Plus, Calendar, Users, Trophy, Trash2, Eye, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import AddParticipantForm from '@/components/admin/AddParticipantForm';
import EventManager from '@/components/admin/EventManager';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'events' | 'add' | 'manage'>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const user = session?.user as any;
  const isAdmin = user?.isAdmin;

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: eventsData } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      const { data: participantsData } = await supabase.from('participants').select('*').order('created_at', { ascending: false });
      if (eventsData) setEvents(eventsData);
      if (participantsData) setParticipants(participantsData);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  }

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" style={{ width: 32, height: 32, color: 'var(--text-secondary)' }} />
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
          <AlertCircle style={{ width: 48, height: 48, color: '#ef4444', margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Access Denied</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>You must be logged in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
          <Shield style={{ width: 48, height: 48, color: '#ef4444', margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Admin Only</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>You don&apos;t have permission to access this page.</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Your ID: <code style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>{user?.discordId}</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(255,140,0,0.1)' }}>
            <Shield style={{ width: 24, height: 24, color: 'var(--bh-accent)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>Admin Panel</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Manage events, participants, and voting</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
          <StatCard icon={<Calendar style={{ width: 20, height: 20, color: 'var(--bh-accent)' }} />} label="Events" value={events.length} />
          <StatCard icon={<Users style={{ width: 20, height: 20, color: 'var(--st-accent)' }} />} label="Participants" value={participants.length} />
          <StatCard icon={<Trophy style={{ width: 20, height: 20, color: 'var(--gold)' }} />} label="Winners" value={participants.filter((p) => p.is_winner).length} />
          <StatCard icon={<Eye style={{ width: 20, height: 20, color: '#a78bfa' }} />} label="Open Voting" value={events.filter((e) => e.voting_status === 'open').length} />
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '4px' }}>
          <TabBtn active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar style={{ width: 16, height: 16 }} />} label="Manage Events" />
          <TabBtn active={activeTab === 'add'} onClick={() => setActiveTab('add')} icon={<Plus style={{ width: 16, height: 16 }} />} label="Add Participant" />
          <TabBtn active={activeTab === 'manage'} onClick={() => setActiveTab('manage')} icon={<Users style={{ width: 16, height: 16 }} />} label="All Participants" />
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '400px' }}>
          {activeTab === 'events' && <EventManager events={events} onRefresh={fetchData} />}
          {activeTab === 'add' && <AddParticipantForm events={events} onSuccess={fetchData} />}
          {activeTab === 'manage' && <ParticipantsList participants={participants} events={events} onRefresh={fetchData} />}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }}>{icon}</div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1, marginBottom: '4px' }}>{value}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</div>
        </div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px',
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        border: active ? '1px solid rgba(255,140,0,0.2)' : '1px solid transparent',
        background: active ? 'rgba(255,140,0,0.1)' : 'rgba(255,255,255,0.05)',
        color: active ? 'var(--bh-accent)' : 'var(--text-secondary)',
        transition: 'all 0.2s',
        flexShrink: 0,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function ParticipantsList({ participants, events, onRefresh }: { participants: Participant[]; events: Event[]; onRefresh: () => void }) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Delete this participant?')) return;
    setDeleting(id);
    try {
      const res = await fetch('/api/admin/participants', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (res.ok) onRefresh();
      else alert('Failed to delete');
    } catch { alert('Error'); }
    finally { setDeleting(null); }
  }

  async function handleToggleWinner(id: string, current: boolean) {
    try {
      const res = await fetch('/api/admin/participants', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_winner: !current }) });
      if (res.ok) onRefresh();
    } catch { alert('Error'); }
  }

  async function handleSyncAvatar(discordId: string) {
    setSyncing(discordId);
    try {
      const res = await fetch('/api/admin/participants', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'sync_avatar', discord_id: discordId }) });
      if (res.ok) { onRefresh(); alert('Avatar synced!'); }
      else alert('No profile avatar to sync');
    } catch { alert('Error syncing'); }
    finally { setSyncing(null); }
  }

  function getEventTitle(eventId: string) {
    const event = events.find((e) => e.id === eventId);
    return event ? event.title : 'Unknown';
  }

  if (participants.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <Users style={{ width: 48, height: 48, color: 'var(--text-secondary)', margin: '0 auto 20px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No Participants Yet</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Add participants using the &quot;Add Participant&quot; tab.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {participants.map((p) => (
        <div key={p.id} className="glass-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Avatar */}
            <img
              src={p.discord_avatar_url || p.github_avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${p.discord_id}`}
              alt={p.discord_username}
              style={{ width: 44, height: 44, borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}
            />

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.discord_username}</h3>
                {p.is_winner && (
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(255,215,0,0.1)', color: 'var(--gold)', flexShrink: 0 }}>🏆 Winner</span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.project_name} — {getEventTitle(p.event_id)}
              </p>
            </div>

            {/* Votes */}
            <div style={{ textAlign: 'right', flexShrink: 0, marginRight: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>{p.vote_count}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>votes</div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              {/* Sync Avatar */}
              <button
                onClick={() => handleSyncAvatar(p.discord_id)}
                disabled={syncing === p.discord_id}
                style={{ padding: '8px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}
                title="Sync avatar from profile"
              >
                {syncing === p.discord_id ? <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} /> : <RefreshCw style={{ width: 16, height: 16 }} />}
              </button>

              {/* Winner Toggle */}
              <button
                onClick={() => handleToggleWinner(p.id, p.is_winner)}
                style={{
                  padding: '8px', borderRadius: '10px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: p.is_winner ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)',
                  color: p.is_winner ? 'var(--gold)' : 'var(--text-secondary)',
                }}
                title={p.is_winner ? 'Remove winner' : 'Make winner'}
              >
                <Trophy style={{ width: 16, height: 16 }} />
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(p.id)}
                disabled={deleting === p.id}
                style={{ padding: '8px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }}
                title="Delete"
              >
                {deleting === p.id ? <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} /> : <Trash2 style={{ width: 16, height: 16 }} />}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}