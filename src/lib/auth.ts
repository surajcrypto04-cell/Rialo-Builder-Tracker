import { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

const RIALO_SERVER_ID = process.env.RIALO_SERVER_ID!;
const CLUB_MEMBER_ROLE_ID = process.env.CLUB_MEMBER_ROLE_ID!;
const ADMIN_DISCORD_IDS = (process.env.ADMIN_DISCORD_IDS || '').split(',');

// Discord OAuth2 scopes
// identify: get user profile
// guilds: see what servers they're in
// guilds.members.read: check their roles in a server
const scopes = ['identify', 'guilds', 'guilds.members.read'].join(' ');

async function checkRialoMembership(accessToken: string) {
  try {
    // Check if user is in Rialo server
    const guildsRes = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!guildsRes.ok) {
      return { isRialoMember: false, isClubMember: false };
    }

    const guilds = await guildsRes.json();
    const isInRialo = guilds.some(
      (guild: { id: string }) => guild.id === RIALO_SERVER_ID
    );

    if (!isInRialo) {
      return { isRialoMember: false, isClubMember: false };
    }

    // Check roles in Rialo server
    const memberRes = await fetch(
      `https://discord.com/api/v10/users/@me/guilds/${RIALO_SERVER_ID}/member`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!memberRes.ok) {
      return { isRialoMember: true, isClubMember: false };
    }

    const member = await memberRes.json();
    const isClubMember = member.roles?.includes(CLUB_MEMBER_ROLE_ID) || false;

    return { isRialoMember: true, isClubMember };
  } catch {
    return { isRialoMember: false, isClubMember: false };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: { scope: scopes },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      // On initial sign in, store the access token and discord data
      if (account && profile) {
        token.accessToken = account.access_token;
        token.discordId = (profile as { id: string }).id;
        token.username = (profile as { username: string }).username;

        // Check Rialo membership and roles
        if (account.access_token) {
          const membership = await checkRialoMembership(account.access_token);
          token.isRialoMember = membership.isRialoMember;
          token.isClubMember = membership.isClubMember;
        }

        // Check if admin
        token.isAdmin = ADMIN_DISCORD_IDS.includes(
          (profile as { id: string }).id
        );
      }

      return token;
    },

    async session({ session, token }) {
      // Expose custom fields to the client session
      if (session.user) {
        (session as any).user.discordId = token.discordId;
        (session as any).user.username = token.username;
        (session as any).user.isRialoMember = token.isRialoMember || false;
        (session as any).user.isClubMember = token.isClubMember || false;
        (session as any).user.voteWeight = token.isClubMember ? 2 : 1;
        (session as any).user.isAdmin = token.isAdmin || false;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },

  pages: {
    signIn: '/',
    error: '/',
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};