'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Event, Participant } from '@/types';
import {
  Shield,
  Plus,
  Calendar,
  Users,
  Trophy,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
} from 'lucide-react';
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

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      const { data: participantsData } = await supabase
        .from('participants')
        .select('*')
        .order('created_at', { ascending: false });
      if (eventsData) setEvents(eventsData);
      if (participantsData) setParticipants(participantsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--text-secondary)]" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="glass-card p-10 text-center max-w-md w-full">
          <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-5" />
          <h2 className="text-2xl font-bold mb-3">Access Denied</h2>
          <p className="text-[var(--text-secondary)] text-sm">
            You must be logged in to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="glass-card p-10 text-center max-w-md w-full">
          <Shield className="w-14 h-14 text-red-400 mx-auto mb-5" />
          <h2 className="text-2xl font-bold mb-3">Admin Only</h2>
          <p className="text-[var(--text-secondary)] text-sm mb-4">
            You don&apos;t have permission to access this page.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Your ID: <code className="bg-white/5 px-2 py-1 rounded text-[var(--text-secondary)]">{user?.discordId}</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:pt-8 sm:pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-[var(--bh-accent)]/10">
              <Shield className="w-6 h-6 text-[var(--bh-accent)]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Manage events, participants, and voting
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <QuickStat
            icon={<Calendar className="w-5 h-5 text-[var(--bh-accent)]" />}
            label="Events"
            value={events.length}
          />
          <QuickStat
            icon={<Users className="w-5 h-5 text-[var(--st-accent)]" />}
            label="Participants"
            value={participants.length}
          />
          <QuickStat
            icon={<Trophy className="w-5 h-5 text-[var(--gold)]" />}
            label="Winners"
            value={participants.filter((p) => p.is_winner).length}
          />
          <QuickStat
            icon={<Eye className="w-5 h-5 text-purple-400" />}
            label="Open Voting"
            value={events.filter((e) => e.voting_status === 'open').length}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabButton
            active={activeTab === 'events'}
            onClick={() => setActiveTab('events')}
            icon={<Calendar className="w-4 h-4" />}
            label="Manage Events"
          />
          <TabButton
            active={activeTab === 'add'}
            onClick={() => setActiveTab('add')}
            icon={<Plus className="w-4 h-4" />}
            label="Add Participant"
          />
          <TabButton
            active={activeTab === 'manage'}
            onClick={() => setActiveTab('manage')}
            icon={<Users className="w-4 h-4" />}
            label="All Participants"
          />
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'events' && (
            <EventManager events={events} onRefresh={fetchData} />
          )}
          {activeTab === 'add' && (
            <AddParticipantForm events={events} onSuccess={fetchData} />
          )}
          {activeTab === 'manage' && (
            <ParticipantsList
              participants={participants}
              events={events}
              onRefresh={fetchData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function QuickStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/5 flex-shrink-0">{icon}</div>
        <div>
          <div className="text-xl sm:text-2xl font-bold leading-none mb-1">{value}</div>
          <div className="text-[11px] sm:text-xs text-[var(--text-secondary)]">{label}</div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
        active
          ? 'bg-[var(--bh-accent)]/10 text-[var(--bh-accent)] border border-[var(--bh-accent)]/20'
          : 'bg-white/5 text-[var(--text-secondary)] border border-transparent hover:bg-white/8 hover:border-[var(--border-subtle)]'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ParticipantsList({ participants, events, onRefresh }: { participants: Participant[]; events: Event[]; onRefresh: () => void }) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this participant?')) return;
    setDeleting(id);
    try {
      const res = await fetch('/api/admin/participants', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) onRefresh();
      else alert('Failed to delete');
    } catch { alert('Error deleting participant'); }
    finally { setDeleting(null); }
  }

  async function handleToggleWinner(id: string, currentStatus: boolean) {
    try {
      const res = await fetch('/api/admin/participants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_winner: !currentStatus }),
      });
      if (res.ok) onRefresh();
    } catch { alert('Error updating winner status'); }
  }

  function getEventTitle(eventId: string) {
    const event = events.find((e) => e.id === eventId);
    return event ? event.title : 'Unknown';
  }

  if (participants.length === 0) {
    return (
      <div className="glass-card p-14 text-center">
        <Users className="w-14 h-14 text-[var(--text-secondary)] mx-auto mb-5" />
        <h3 className="text-lg font-bold mb-2">No Participants Yet</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Add participants using the &quot;Add Participant&quot; tab.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {participants.map((p) => (
        <div key={p.id} className="glass-card p-4 sm:p-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src={
                p.discord_avatar_url ||
                p.github_avatar_url ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${p.discord_id}`
              }
              alt={p.discord_username}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border border-[var(--border-subtle)] flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-sm truncate">{p.discord_username}</h3>
                {p.is_winner && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] flex-shrink-0">
                    🏆 Winner
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {p.project_name} — {getEventTitle(p.event_id)}
              </p>
            </div>
            <div className="text-right hidden sm:block flex-shrink-0 mr-2">
              <div className="text-sm font-bold">{p.vote_count}</div>
              <div className="text-[10px] text-[var(--text-secondary)]">votes</div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => handleToggleWinner(p.id, p.is_winner)}
                className={`p-2 rounded-lg transition-colors ${
                  p.is_winner
                    ? 'bg-[var(--gold)]/10 text-[var(--gold)]'
                    : 'bg-white/5 text-[var(--text-secondary)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/5'
                }`}
                title={p.is_winner ? 'Remove winner' : 'Make winner'}
              >
                <Trophy className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                disabled={deleting === p.id}
                className="p-2 rounded-lg bg-white/5 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Delete"
              >
                {deleting === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}