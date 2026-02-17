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

  // Build participant data
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

  // ============================================
  // SMART PROFILE MANAGEMENT
  // ============================================

  // Check if profile already exists for this discord_id
  const { data: existingProfile } = await supabaseAdmin
    .from('builder_profiles')
    .select('*')
    .eq('discord_id', body.discord_id)
    .single();

  if (existingProfile) {
    // Profile EXISTS — only update participation count
    // DO NOT change username, avatar, or other identity fields
    // unless they are currently empty/null
    const updates: any = {
      total_participations: existingProfile.total_participations + 1,
    };

    // Only fill in fields that are currently empty
    if (!existingProfile.twitter_handle && body.twitter_handle) {
      updates.twitter_handle = body.twitter_handle;
    }
    if (!existingProfile.github_username && body.github_username) {
      updates.github_username = body.github_username;
    }
    if (!existingProfile.discord_avatar_url && body.discord_avatar_url) {
      updates.discord_avatar_url = body.discord_avatar_url;
    }
    if (!existingProfile.discord_avatar_url && githubData?.user?.avatar_url) {
      updates.discord_avatar_url = githubData.user.avatar_url;
    }

    // Update badges
    const badges = [...(existingProfile.badges || [])];
    if (!badges.includes('first_timer')) badges.push('first_timer');

    // Check for veteran badge (5+ participations)
    if (existingProfile.total_participations + 1 >= 5 && !badges.includes('veteran')) {
      badges.push('veteran');
    }

    // Check for code_is_law badge (has GitHub)
    if (body.github_username && !badges.includes('code_is_law')) {
      badges.push('code_is_law');
    }

    updates.badges = badges;

    await supabaseAdmin
      .from('builder_profiles')
      .update(updates)
      .eq('discord_id', body.discord_id);

  } else {
    // Profile DOES NOT EXIST — create new one
    const badges = ['first_timer'];

    if (body.github_username) {
      badges.push('code_is_law');
    }

    // Check GitHub-based badges
    if (githubData) {
      if (githubData.totalStars >= 100) badges.push('star_collector');
      if (githubData.totalStars >= 500) badges.push('open_source_king');
      if (githubData.user?.followers >= 100) badges.push('community_builder');
      if (githubData.topLanguages && githubData.topLanguages.length >= 3) badges.push('polyglot');
    }

    await supabaseAdmin.from('builder_profiles').insert({
      discord_id: body.discord_id,
      discord_username: body.discord_username,
      twitter_handle: body.twitter_handle || null,
      github_username: body.github_username || null,
      discord_avatar_url: body.discord_avatar_url || githubData?.user?.avatar_url || null,
      total_participations: 1,
      total_wins: 0,
      total_votes_received: 0,
      badges,
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
      .select('discord_id, event_id')
      .eq('id', body.id)
      .single();

    if (participant) {
      // Get event type to determine which badge to give
      const { data: event } = await supabaseAdmin
        .from('events')
        .select('event_type')
        .eq('id', participant.event_id)
        .single();

      const { data: profile } = await supabaseAdmin
        .from('builder_profiles')
        .select('*')
        .eq('discord_id', participant.discord_id)
        .single();

      if (profile) {
        const badges = [...(profile.badges || [])];

        // Add appropriate winner badge
        if (event?.event_type === 'builders_hub' && !badges.includes('champion')) {
          badges.push('champion');
        }
        if (event?.event_type === 'shark_tank' && !badges.includes('shark_king')) {
          badges.push('shark_king');
        }

        // Check for diamond badge (won both)
        if (badges.includes('champion') && badges.includes('shark_king') && !badges.includes('diamond')) {
          badges.push('diamond');
        }

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

  // If removing winner status, decrease win count
  if (body.is_winner === false) {
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

      if (profile && profile.total_wins > 0) {
        await supabaseAdmin
          .from('builder_profiles')
          .update({ total_wins: profile.total_wins - 1 })
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

  // Get participant info BEFORE deleting
  const { data: participant } = await supabaseAdmin
    .from('participants')
    .select('discord_id, is_winner, vote_count')
    .eq('id', body.id)
    .single();

  // Delete the participant
  const { error } = await supabaseAdmin
    .from('participants')
    .delete()
    .eq('id', body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // ============================================
  // SMART PROFILE CLEANUP AFTER DELETE
  // ============================================

  if (participant) {
    // Check if this discord_id has ANY remaining participants
    const { data: remaining } = await supabaseAdmin
      .from('participants')
      .select('id, discord_username, discord_avatar_url, vote_count, is_winner')
      .eq('discord_id', participant.discord_id);

    if (!remaining || remaining.length === 0) {
      // NO remaining participants — delete the profile entirely
      await supabaseAdmin
        .from('builder_profiles')
        .delete()
        .eq('discord_id', participant.discord_id);
    } else {
      // HAS remaining participants — update profile stats
      const totalVotes = remaining.reduce((sum, p) => sum + p.vote_count, 0);
      const totalWins = remaining.filter((p) => p.is_winner).length;

      // Use the FIRST (oldest) remaining participant's username
      // This ensures consistency
      const { data: firstParticipant } = await supabaseAdmin
        .from('participants')
        .select('discord_username, discord_avatar_url')
        .eq('discord_id', participant.discord_id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      const updates: any = {
        total_participations: remaining.length,
        total_wins: totalWins,
        total_votes_received: totalVotes,
      };

      // Restore the original username from the first participation
      if (firstParticipant) {
        updates.discord_username = firstParticipant.discord_username;
        if (firstParticipant.discord_avatar_url) {
          updates.discord_avatar_url = firstParticipant.discord_avatar_url;
        }
      }

      await supabaseAdmin
        .from('builder_profiles')
        .update(updates)
        .eq('discord_id', participant.discord_id);
    }
  }

  return NextResponse.json({ success: true });
}