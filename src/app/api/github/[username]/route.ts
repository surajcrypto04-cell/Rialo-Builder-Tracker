import { NextRequest, NextResponse } from 'next/server';
import { fetchFullGitHubProfile } from '@/lib/github';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  const profile = await fetchFullGitHubProfile(username);

  if (!profile) {
    return NextResponse.json(
      { error: 'GitHub user not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(profile);
}