'use client';

import { ThumbsUp } from 'lucide-react';

interface VoteDisplayProps {
    voteCount: number;
    variant: 'builders_hub' | 'shark_tank';
    isWinner?: boolean;
}

export default function VoteDisplay({ voteCount, variant, isWinner }: VoteDisplayProps) {
    const isBH = variant === 'builders_hub';
    const accentColor = isBH ? 'var(--bh-accent)' : 'var(--st-accent)';
    const bgColor = isBH ? 'rgba(255,140,0,0.08)' : 'rgba(0,200,255,0.08)';
    const borderColor = isBH ? 'rgba(255,140,0,0.2)' : 'rgba(0,200,255,0.2)';

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '12px',
                background: isWinner ? 'rgba(255,215,0,0.08)' : bgColor,
                border: `1px solid ${isWinner ? 'rgba(255,215,0,0.25)' : borderColor}`,
                width: '100%',
            }}
        >
            <ThumbsUp
                style={{
                    width: 15,
                    height: 15,
                    color: isWinner ? 'var(--gold)' : accentColor,
                    flexShrink: 0,
                }}
            />
            <span
                style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: isWinner ? 'var(--gold)' : accentColor,
                }}
            >
                {voteCount.toLocaleString()}
            </span>
            <span
                style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                }}
            >
                {voteCount === 1 ? 'vote' : 'votes'}
            </span>
        </div>
    );
}
