'use client';

import { useState, useEffect } from 'react';
import { X, Megaphone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AnnouncementBanner() {
    const [text, setText] = useState<string | null>(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        async function fetchAnnouncement() {
            try {
                const { data } = await supabase
                    .from('site_settings')
                    .select('announcement_text')
                    .single();
                if (data?.announcement_text) {
                    setText(data.announcement_text);
                }
            } catch {
                // No announcement
            }
        }
        fetchAnnouncement();
    }, []);

    if (!text || dismissed) return null;

    return (
        <div
            style={{
                position: 'relative',
                zIndex: 60,
                background: 'linear-gradient(90deg, rgba(255,140,0,0.12), rgba(0,200,255,0.12))',
                borderBottom: '1px solid rgba(255,140,0,0.2)',
                padding: '10px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
            }}
        >
            <Megaphone style={{ width: 15, height: 15, color: 'var(--bh-accent)', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', textAlign: 'center', lineHeight: 1.5 }}>
                {text}
            </p>
            <button
                onClick={() => setDismissed(true)}
                style={{
                    position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: '4px', borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                aria-label="Dismiss announcement"
            >
                <X style={{ width: 15, height: 15 }} />
            </button>
        </div>
    );
}
