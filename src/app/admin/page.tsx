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
  Edit,
  Eye,
  ChevronDown,
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

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--text-secondary)]" />
      </div>
    );
  }

  // Not logged in
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-[var(--text-secondary)]">
            You must be logged in to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-8 text-center max-w-md">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Admin Only</h2>
          <p className="text-[var(--text-secondary)]">
            You don&apos;t have permission to access this page.
            <br />
            Your Discord ID: <code className="text-xs bg-white/5 px-2 py-1 rounded">{user?.discordId}</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-[var(--bh-accent)]" />
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-[var(--text-secondary)]">
            Manage events, participants, and voting.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
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
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
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
  );
}

function QuickStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="glass-card p-4 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white/5">{icon}</div>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-xs text-[var(--text-secondary)]">{label}</div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
        active
          ? 'bg-[var(--bh-accent)]/10 text-[var(--bh-accent)] border border-[var(--bh-accent)]/20'
          : 'bg-white/5 text-[var(--text-secondary)] border border-white/5 hover:bg-white/10'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ParticipantsList({
  participants,
  events,
  onRefresh,
}: {
  participants: Participant[];
  events: Event[];
  onRefresh: () => void;
}) {
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

      if (res.ok) {
        onRefresh();
      } else {
        alert('Failed to delete');
      }
    } catch {
      alert('Error deleting participant');
    } finally {
      setDeleting(null);
    }
  }

  async function handleToggleWinner(id: string, currentStatus: boolean) {
    try {
      const res = await fetch('/api/admin/participants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_winner: !currentStatus }),
      });

      if (res.ok) {
        onRefresh();
      }
    } catch {
      alert('Error updating winner status');
    }
  }

  function getEventTitle(eventId: string) {
    const event = events.find((e) => e.id === eventId);
    return event ? event.title : 'Unknown Event';
  }

  if (participants.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <Users className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
        <h3 className="text-lg font-bold mb-2">No Participants Yet</h3>
        <p className="text-[var(--text-secondary)]">
          Add participants using the &quot;Add Participant&quot; tab.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {participants.map((p) => (
        <div key={p.id} className="glass-card p-4 sm:p-5">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <img
              src={
                p.github_avatar_url ||
                p.discord_avatar_url ||
                `https://api.dicebear.com/7.x/identicon/svg?seed=${p.discord_id}`
              }
              alt={p.discord_username}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-white/10"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm sm:text-base truncate">
                  {p.discord_username}
                </h3>
                {p.is_winner && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--gold)]/10 text-[var(--gold)]">
                    🏆 Winner
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] truncate">
                {p.project_name} — {getEventTitle(p.event_id)}
              </p>
            </div>

            {/* Votes */}
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold">{p.vote_count}</div>
              <div className="text-xs text-[var(--text-secondary)]">votes</div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleWinner(p.id, p.is_winner)}
                className={`p-2 rounded-lg transition-colors ${
                  p.is_winner
                    ? 'bg-[var(--gold)]/10 text-[var(--gold)]'
                    : 'bg-white/5 text-[var(--text-secondary)] hover:text-[var(--gold)]'
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
                {deleting === p.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}