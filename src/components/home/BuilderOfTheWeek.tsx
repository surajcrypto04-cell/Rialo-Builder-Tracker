'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Participant } from '@/types';
import { Trophy, Github, Twitter, ExternalLink, ThumbsUp } from 'lucide-react';
import Link from 'next/link';

export default function BuilderOfTheWeek() {
    const [winner, setWinner] = useState<Participant | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWinner() {
            try {
                // Get the most recent winner across all events
                const { data } = await supabase
                    .from('participants')
                    .select('*, event:events(*)')
                    .eq('is_winner', true)
                    .order('updated_at', { ascending: false })
                    .limit(1)
                    .single();

                if (data) setWinner(data as Participant);
            } catch {
                // No winner yet
            } finally {
                setLoading(false);
            }
        }
        fetchWinner();
    }, []);

    if (loading || !winner) return null;

    const isBH = (winner as any).event?.event_type === 'builders_hub';
    const accentColor = isBH ? 'var(--bh-accent)' : 'var(--st-accent)';
    const glowColor = isBH ? 'rgba(255,140,0,0.15)' : 'rgba(0,200,255,0.15)';

    return (
        <section style={{ padding: '64px 24px 0' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Section Label */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', marginBottom: '16px' }}>
                        <Trophy style={{ width: 15, height: 15, color: 'var(--gold)' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gold)' }}>Builder of the Week</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 700 }}>
                        This Week&apos;s{' '}
                        <span style={{ background: 'linear-gradient(90deg, var(--gold), #ff8c00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Champion
                        </span>
                    </h2>
                </div>

                {/* Spotlight Card */}
                <div
                    style={{
                        position: 'relative',
                        borderRadius: '24px',
                        background: 'rgba(255,215,0,0.03)',
                        border: '1px solid rgba(255,215,0,0.2)',
                        padding: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '40px',
                        flexWrap: 'wrap',
                        boxShadow: `0 0 60px ${glowColor}, 0 20px 60px rgba(0,0,0,0.3)`,
                        overflow: 'hidden',
                    }}
                    className="animate-glow-gold"
                >
                    {/* Background glow orb */}
                    <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--gold)', opacity: 0.03, filter: 'blur(80px)', pointerEvents: 'none' }} />

                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img
                            src={winner.discord_avatar_url || winner.github_avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${winner.discord_id}`}
                            alt={winner.discord_username}
                            style={{ width: 100, height: 100, borderRadius: '20px', objectFit: 'cover', border: '3px solid rgba(255,215,0,0.4)', boxShadow: '0 8px 32px rgba(255,215,0,0.2)' }}
                            className="animate-float"
                        />
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', boxShadow: '0 4px 12px rgba(255,215,0,0.4)', border: '2px solid var(--bg-primary)' }}>
                            🏆
                        </div>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <Link href={`/profile/${winner.discord_id}`}>
                                <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}>
                                    {winner.discord_username}
                                </h3>
                            </Link>
                            <span style={{ padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600, background: isBH ? 'rgba(255,140,0,0.1)' : 'rgba(0,200,255,0.1)', color: accentColor }}>
                                {isBH ? "🏗️ Builder's Hub" : '🦈 Shark Tank'}
                            </span>
                        </div>

                        <h4 style={{ fontSize: '18px', fontWeight: 700, color: accentColor, marginBottom: '8px' }}>
                            {winner.project_name}
                        </h4>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px', maxWidth: '480px' }}>
                            {winner.project_one_liner}
                        </p>

                        {/* Links + Votes */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            {winner.twitter_handle && (
                                <a href={`https://twitter.com/${winner.twitter_handle}`} target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    <Twitter style={{ width: 13, height: 13 }} /> @{winner.twitter_handle}
                                </a>
                            )}
                            {winner.github_username && (
                                <a href={`https://github.com/${winner.github_username}`} target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    <Github style={{ width: 13, height: 13 }} /> {winner.github_username}
                                </a>
                            )}
                            {winner.project_link && (
                                <a href={winner.project_link} target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    <ExternalLink style={{ width: 13, height: 13 }} /> Live Project
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Vote Count */}
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ padding: '24px 32px', borderRadius: '20px', background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)' }}>
                            <ThumbsUp style={{ width: 28, height: 28, color: 'var(--gold)', margin: '0 auto 8px' }} />
                            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--gold)', lineHeight: 1 }}>
                                {winner.vote_count.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Community Votes</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
