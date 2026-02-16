'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { ThumbsUp, Check, Loader2, Lock, Zap } from 'lucide-react';

interface VoteButtonProps {
  participantId: string;
  eventId: string;
  variant: 'builders_hub' | 'shark_tank';
}

export default function VoteButton({ participantId, eventId, variant }: VoteButtonProps) {
  const { data: session } = useSession();
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [voteMessage, setVoteMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const user = session?.user as any;
  const isBH = variant === 'builders_hub';

  const handleVote = async () => {
    // Not logged in
    if (!session) {
      signIn('discord');
      return;
    }

    // Not a Rialo member
    if (!user?.isRialoMember) {
      setVoteMessage('You must be a Rialo server member to vote');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }

    // Already voted
    if (hasVoted) return;

    setIsVoting(true);

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId, eventId }),
      });

      const data = await res.json();

      if (res.ok) {
        setHasVoted(true);
        setVoteMessage(data.message);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      } else {
        setVoteMessage(data.error);
        setShowMessage(true);
        if (data.error === 'You have already voted for this participant') {
          setHasVoted(true);
        }
        setTimeout(() => setShowMessage(false), 3000);
      }
    } catch {
      setVoteMessage('Something went wrong');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleVote}
        disabled={hasVoted || isVoting}
        className={`vote-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          hasVoted
            ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-default'
            : !session
            ? 'bg-[#5865F2]/10 text-[#5865F2] border border-[#5865F2]/20 hover:bg-[#5865F2]/20'
            : !user?.isRialoMember
            ? 'bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed'
            : isBH
            ? 'bg-[var(--bh-accent)]/10 text-[var(--bh-accent)] border border-[var(--bh-accent)]/20 hover:bg-[var(--bh-accent)]/20 active:scale-95'
            : 'bg-[var(--st-accent)]/10 text-[var(--st-accent)] border border-[var(--st-accent)]/20 hover:bg-[var(--st-accent)]/20 active:scale-95'
        }`}
      >
        {isVoting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Voting...
          </>
        ) : hasVoted ? (
          <>
            <Check className="w-4 h-4" />
            Voted ✓
          </>
        ) : !session ? (
          <>
            <Lock className="w-4 h-4" />
            Sign in to Vote
          </>
        ) : !user?.isRialoMember ? (
          <>
            <Lock className="w-4 h-4" />
            Members Only
          </>
        ) : (
          <>
            <ThumbsUp className="w-4 h-4" />
            Vote
            {user?.isClubMember && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-[10px]">
                <Zap className="w-3 h-3" />
                2x
              </span>
            )}
          </>
        )}
      </button>

      {/* Vote Message Toast */}
      {showMessage && (
        <div
          className={`absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap animate-fade-in-up z-20 ${
            hasVoted
              ? 'bg-green-500/20 text-green-400 border border-green-500/20'
              : 'bg-red-500/20 text-red-400 border border-red-500/20'
          }`}
        >
          {voteMessage}
        </div>
      )}
    </div>
  );
}