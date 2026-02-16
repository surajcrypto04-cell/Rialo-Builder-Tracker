import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to vote' },
        { status: 401 }
      );
    }

    const user = session.user as any;

    // Check Rialo membership
    if (!user.isRialoMember) {
      return NextResponse.json(
        { error: 'You must be a Rialo server member to vote' },
        { status: 403 }
      );
    }

    // Get request body
    const { participantId, eventId } = await request.json();

    if (!participantId || !eventId) {
      return NextResponse.json(
        { error: 'Missing participant or event ID' },
        { status: 400 }
      );
    }

    // Check if event voting is open
    const { data: event } = await supabaseAdmin
      .from('events')
      .select('voting_status')
      .eq('id', eventId)
      .single();

    if (!event || event.voting_status !== 'open') {
      return NextResponse.json(
        { error: 'Voting is not open for this event' },
        { status: 400 }
      );
    }

    // Check if already voted
    const { data: existingVote } = await supabaseAdmin
      .from('votes')
      .select('id')
      .eq('participant_id', participantId)
      .eq('voter_discord_id', user.discordId)
      .single();

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted for this participant' },
        { status: 400 }
      );
    }

    // Determine vote weight
    const voteWeight = user.isClubMember ? 2 : 1;

    // Insert vote
    const { error: voteError } = await supabaseAdmin.from('votes').insert({
      participant_id: participantId,
      event_id: eventId,
      voter_discord_id: user.discordId,
      voter_username: user.username || user.name,
      vote_weight: voteWeight,
    });

    if (voteError) {
      console.error('Vote insert error:', voteError);
      return NextResponse.json(
        { error: 'Failed to cast vote' },
        { status: 500 }
      );
    }

    // Update participant vote count
    const { data: participant } = await supabaseAdmin
      .from('participants')
      .select('vote_count')
      .eq('id', participantId)
      .single();

    if (participant) {
      await supabaseAdmin
        .from('participants')
        .update({ vote_count: participant.vote_count + voteWeight })
        .eq('id', participantId);
    }

    return NextResponse.json({
      success: true,
      voteWeight,
      message:
        voteWeight === 2
          ? 'Vote cast with 2x Club Member power! 🔥'
          : 'Vote cast successfully! ✅',
    });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}