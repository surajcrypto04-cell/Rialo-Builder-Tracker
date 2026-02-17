import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProfileClient from '@/components/profile/ProfileClient';

// Force dynamic rendering — never cache this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ discordId: string }>;
}) {
  const { discordId } = await params;

  // Try to get builder profile
  const { data: profile } = await supabase
    .from('builder_profiles')
    .select('*')
    .eq('discord_id', discordId)
    .single();

  // Fetch all participations regardless of profile
  const { data: participations } = await supabase
    .from('participants')
    .select('*, event:events(*)')
    .eq('discord_id', discordId)
    .order('created_at', { ascending: false });

  // If no profile AND no participations, then 404
  if (!profile && (!participations || participations.length === 0)) {
    notFound();
  }

  // If participations exist but no profile, build a temporary profile
  const displayProfile = profile || {
    discord_id: discordId,
    discord_username: participations?.[0]?.discord_username || 'Unknown Builder',
    discord_avatar_url: participations?.[0]?.discord_avatar_url || null,
    twitter_handle: participations?.[0]?.twitter_handle || null,
    github_username: participations?.[0]?.github_username || null,
    total_participations: participations?.length || 0,
    total_wins: participations?.filter((p) => p.is_winner).length || 0,
    total_votes_received: participations?.reduce((sum, p) => sum + p.vote_count, 0) || 0,
    badges: ['first_timer'],
    first_participated_at: participations?.[0]?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <ProfileClient
      profile={displayProfile}
      participations={participations || []}
    />
  );
}