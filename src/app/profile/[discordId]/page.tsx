import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProfileClient from '@/components/profile/ProfileClient';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ discordId: string }>;
}) {
  const { discordId } = await params;

  // Fetch builder profile
  const { data: profile } = await supabase
    .from('builder_profiles')
    .select('*')
    .eq('discord_id', discordId)
    .single();

  if (!profile) {
    notFound();
  }

  // Fetch all participations
  const { data: participations } = await supabase
    .from('participants')
    .select('*, event:events(*)')
    .eq('discord_id', discordId)
    .order('created_at', { ascending: false });

  return (
    <ProfileClient
      profile={profile}
      participations={participations || []}
    />
  );
}