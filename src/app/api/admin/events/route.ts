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

  const { data, error } = await supabaseAdmin.from('events').insert({
    event_type: body.event_type,
    week_number: body.week_number,
    title: body.title,
    description: body.description || null,
    voting_status: 'upcoming',
  }).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
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
  if (body.voting_status) updateData.voting_status = body.voting_status;
  if (body.title) updateData.title = body.title;

  const { error } = await supabaseAdmin
    .from('events')
    .update(updateData)
    .eq('id', body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
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
    .from('events')
    .delete()
    .eq('id', body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}