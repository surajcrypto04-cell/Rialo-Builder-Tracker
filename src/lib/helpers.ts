import { supabase } from './supabase';
import { Participant } from '@/types';

// Fetch participants and merge with latest profile avatars
export async function fetchParticipantsWithProfiles(eventId: string): Promise<Participant[]> {
  // Get participants
  const { data: participants } = await supabase
    .from('participants')
    .select('*')
    .eq('event_id', eventId)
    .order('vote_count', { ascending: false });

  if (!participants || participants.length === 0) return [];

  // Get unique discord IDs
  const discordIds = [...new Set(participants.map((p) => p.discord_id))];

  // Fetch profiles for these IDs
  const { data: profiles } = await supabase
    .from('builder_profiles')
    .select('discord_id, discord_username, discord_avatar_url')
    .in('discord_id', discordIds);

  if (!profiles) return participants;

  // Create a lookup map
  const profileMap = new Map(profiles.map((p) => [p.discord_id, p]));

  // Merge: use profile avatar if participant doesn't have one, or profile has a newer one
  return participants.map((participant) => {
    const profile = profileMap.get(participant.discord_id);
    if (profile) {
      return {
        ...participant,
        // Profile avatar takes priority (it's the latest)
        discord_avatar_url: profile.discord_avatar_url || participant.discord_avatar_url,
        // Keep username consistent with profile
        discord_username: profile.discord_username || participant.discord_username,
      };
    }
    return participant;
  });
}