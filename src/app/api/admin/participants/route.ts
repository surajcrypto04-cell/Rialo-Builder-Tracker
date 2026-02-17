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

/* =======================================================
   POST – CREATE PARTICIPANT
======================================================= */

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
    discord_avatar_url: body.discord_avatar_url || null,
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

  const { data, error } = await supabaseAdmin
    .from('participants')
    .insert(participantData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

/* =======================================================
   PATCH – MARK WINNER
======================================================= */

export async function PATCH(request: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const body = await request.json();

  const { error } = await supabaseAdmin
    .from('participants')
    .update({ is_winner: body.is_winner })
    .eq('id', body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

/* =======================================================
   DELETE – REMOVE PARTICIPANT
======================================================= */

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

/* =======================================================
   PUT – UPDATE / SYNC AVATAR
======================================================= */

export async function PUT(request: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const body = await request.json();

  // Sync avatar across all participations
  if (body.action === 'sync_avatar') {
    const { data: profile } = await supabaseAdmin
      .from('builder_profiles')
      .select('discord_avatar_url')
      .eq('discord_id', body.discord_id)
      .single();

    if (profile?.discord_avatar_url) {
      await supabaseAdmin
        .from('participants')
        .update({ discord_avatar_url: profile.discord_avatar_url })
        .eq('discord_id', body.discord_id);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'No profile avatar found' }, { status: 400 });
  }

  // Update specific participant
  if (body.id) {
    const updateData: any = {};

    if (body.discord_avatar_url !== undefined)
      updateData.discord_avatar_url = body.discord_avatar_url;

    if (body.discord_username !== undefined)
      updateData.discord_username = body.discord_username;

    if (body.project_name !== undefined)
      updateData.project_name = body.project_name;

    if (body.project_one_liner !== undefined)
      updateData.project_one_liner = body.project_one_liner;

    if (Object.keys(updateData).length > 0) {
      await supabaseAdmin
        .from('participants')
        .update(updateData)
        .eq('id', body.id);
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}