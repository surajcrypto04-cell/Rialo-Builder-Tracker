'use client';

import { useEffect, useState } from 'react';
import { Zap, Activity, Star, TrendingUp } from 'lucide-react';

const HYPE_MESSAGES = [
    { icon: <Zap size={14} />, text: "New project submission in Builder's Hub!" },
    { icon: <Activity size={14} />, text: "Live voting is heating up! 🔥" },
    { icon: <Star size={14} />, text: "Project 'DeFi Nexus' just crossed 100 votes!" },
    { icon: <TrendingUp size={14} />, text: "Shark Tank Week 5 is now OPEN for pitches." },
    { icon: <Zap size={14} />, text: "Whale alert: 50 votes cast in the last hour! 🐳" },
    { icon: <Star size={14} />, text: "Don't forget to claim your 'Early Voter' badge." },
];

export default function HypeTicker() {
    const [isMounted, setIsMounted] = useState(false);
    const [messages, setMessages] = useState(HYPE_MESSAGES);

    useEffect(() => {
        setIsMounted(true);
        // Shuffle messages on client-side
        setMessages([...HYPE_MESSAGES].sort(() => Math.random() - 0.5));
    }, []);

    if (!isMounted) return null;

    // Triple the messages to create a seamless loop
    const displayMessages = [...messages, ...messages, ...messages];

    return (
        <div style={{
            background: 'linear-gradient(90deg, #0a0a0f, #111, #0a0a0f)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 40
        }}>
            <div style={{
                display: 'flex',
                gap: '48px',
                whiteSpace: 'nowrap',
                animation: 'marquee 40s linear infinite',
                paddingLeft: '100%',
                width: 'max-content'
            }}>
                {displayMessages.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>
                        <span style={{ color: 'var(--bh-accent)' }}>{msg.icon}</span>
                        {msg.text}
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); } 
                }
            `}</style>
        </div>
    );
}
