'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Zap, ArrowDown, Shield, Users, Trophy } from 'lucide-react';

export default function Hero() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '40px 24px' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', top: '20%', left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'var(--bh-accent)', opacity: 0.025, filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: 500, height: 500, borderRadius: '50%', background: 'var(--st-accent)', opacity: 0.025, filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        {mounted && [...Array(6)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: `${4 + Math.random() * 6}px`, height: `${4 + Math.random() * 6}px`, left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%`, background: i % 2 === 0 ? 'var(--bh-accent)' : 'var(--st-accent)', opacity: 0.12, animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`, animationDelay: `${Math.random() * 3}s` }} />
        ))}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', width: '100%', textAlign: 'center' }}>
        {/* Badge */}
        <div style={{ marginBottom: '32px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.7s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'glowPulse 2s infinite' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Season 1 — Now Live</span>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(32px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease 0.2s' }}>
          <span style={{ color: 'var(--text-primary)' }}>Where </span>
          <span style={{ background: 'linear-gradient(90deg, var(--bh-accent), var(--bh-accent-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Builders</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>Compete & </span>
          <span style={{ background: 'linear-gradient(90deg, var(--st-accent-light), var(--st-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Community</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>Decides</span>
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: 'clamp(15px, 2.5vw, 20px)', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease 0.35s' }}>
          Showcase your projects in the{' '}
          <span style={{ color: 'var(--bh-accent)', fontWeight: 600 }}>Builder&apos;s Hub</span>,
          pitch in the{' '}
          <span style={{ color: 'var(--st-accent)', fontWeight: 600 }}>Shark Tank</span>,
          and let the community vote for the best.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '48px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease 0.45s' }}>
          {!session ? (
            <button onClick={() => signIn('discord')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 32px', borderRadius: '14px', border: 'none', background: '#5865F2', color: 'white', fontSize: '15px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 24px rgba(88,101,242,0.25)', transition: 'all 0.3s' }}>
              <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Sign in with Discord
            </button>
          ) : (
            <a href="#builders-hub"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 32px', borderRadius: '14px', background: 'linear-gradient(90deg, var(--bh-accent), var(--bh-accent-light))', color: 'black', fontSize: '15px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,140,0,0.2)', transition: 'all 0.3s' }}>
              <Zap style={{ width: 20, height: 20 }} /> Explore Projects
            </a>
          )}
          <a href="#shark-tank"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 32px', borderRadius: '14px', border: '1px solid rgba(0,200,255,0.2)', background: 'transparent', color: 'var(--st-accent)', fontSize: '15px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s' }}>
            Enter Shark Tank
          </a>
        </div>

        {/* Feature Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '48px', opacity: mounted ? 1 : 0, transition: 'all 0.7s ease 0.6s' }}>
          <FeaturePill icon={<Users style={{ width: 15, height: 15 }} />} text="Community Voting" />
          <FeaturePill icon={<Shield style={{ width: 15, height: 15 }} />} text="2x Club Member Power" />
          <FeaturePill icon={<Trophy style={{ width: 15, height: 15 }} />} text="Weekly Winners" />
        </div>

        {/* Scroll */}
        <div style={{ opacity: mounted ? 1 : 0, transition: 'all 0.7s ease 0.8s' }}>
          <a href="#builders-hub" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none' }}>
            <span style={{ fontSize: '12px' }}>Scroll to explore</span>
            <ArrowDown style={{ width: 16, height: 16 }} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: 'var(--text-secondary)' }}>
      {icon} {text}
    </div>
  );
}