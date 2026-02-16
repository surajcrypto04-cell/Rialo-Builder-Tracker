import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const adminIds = (process.env.ADMIN_DISCORD_IDS || '').split(',');
  return user && adminIds.includes(user.discordId);
}

export async function POST(request: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const body = await request.json();
  const githubData = body.github_data;

  const participantData: any = {
    event_id: body.event_id,
    discord_id: body.discord_id,
    discord_username: body.discord_username,
    twitter_handle: body.twitter_handle || null,
    github_username: body.github_username || null,
    project_name: body.project_name,
    project_one_liner: body.project_one_liner,
    project_pitch: body.project_pitch || null,
    project_link: body.project_link || null,
    project_github_link: body.project_github_link || null,
    project_screenshot_url: body.project_screenshot_url || null,
    project_category: body.project_category || null,
    tech_stack: body.tech_stack || [],
    project_status: body.project_status || 'building',
    team_size: body.team_size || 'solo',
  };

  // Add GitHub data if available
  if (githubData) {
    participantData.github_avatar_url = githubData.user?.avatar_url || null;
    participantData.github_bio = githubData.user?.bio || null;
    participantData.github_public_repos = githubData.allReposCount || 0;
    participantData.github_followers = githubData.user?.followers || 0;
    participantData.github_total_stars = githubData.totalStars || 0;
    participantData.github_top_languages = githubData.topLanguages || [];
    participantData.github_repos_data = githubData.repos || [];
    participantData.github_created_at = githubData.user?.created_at || null;
  }

  // Insert participant
  const { data, error } = await supabaseAdmin
    .from('participants')
    .insert(participantData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Update or create builder profile
  const { data: existingProfile } = await supabaseAdmin
    .from('builder_profiles')
    .select('*')
    .eq('discord_id', body.discord_id)
    .single();

  if (existingProfile) {
    await supabaseAdmin
      .from('builder_profiles')
      .update({
        discord_username: body.discord_username,
        twitter_handle: body.twitter_handle || existingProfile.twitter_handle,
        github_username: body.github_username || existingProfile.github_username,
        discord_avatar_url: githubData?.user?.avatar_url || existingProfile.discord_avatar_url,
        total_participations: existingProfile.total_participations + 1,
      })
      .eq('discord_id', body.discord_id);
  } else {
    await supabaseAdmin.from('builder_profiles').insert({
      discord_id: body.discord_id,
      discord_username: body.discord_username,
      twitter_handle: body.twitter_handle || null,
      github_username: body.github_username || null,
      discord_avatar_url: githubData?.user?.avatar_url || null,
      total_participations: 1,
      badges: ['first_timer'],
    });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const body = await request.json();

  const updateData: any = {};
  if (body.is_winner !== undefined) updateData.is_winner = body.is_winner;

  const { error } = await supabaseAdmin
    .from('participants')
    .update(updateData)
    .eq('id', body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // If marking as winner, update builder profile
  if (body.is_winner === true) {
    const { data: participant } = await supabaseAdmin
      .from('participants')
      .select('discord_id')
      .eq('id', body.id)
      .single();

    if (participant) {
      const { data: profile } = await supabaseAdmin
        .from('builder_profiles')
        .select('*')
        .eq('discord_id', participant.discord_id)
        .single();

      if (profile) {
        const badges = [...(profile.badges || [])];
        if (!badges.includes('champion')) badges.push('champion');

        await supabaseAdmin
          .from('builder_profiles')
          .update({
            total_wins: profile.total_wins + 1,
            badges,
          })
          .eq('discord_id', participant.discord_id);
      }
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const body = await request.json();

  const { error } = await supabaseAdmin
    .from('participants')
    .delete()
    .eq('id', body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}