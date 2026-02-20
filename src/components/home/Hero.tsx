'use client';

import { useEffect, useState } from 'react';
import { Zap, ArrowDown, Shield, Users, Trophy } from 'lucide-react';

export default function Hero() {
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
          <a href="/builders-hub"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 32px', borderRadius: '14px', background: 'linear-gradient(90deg, var(--bh-accent), var(--bh-accent-light))', color: 'black', fontSize: '15px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 8px 24px rgba(255,140,0,0.2)', transition: 'all 0.3s' }}>
            <Zap style={{ width: 20, height: 20 }} /> Explore Projects
          </a>
          <a href="/shark-tank"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 32px', borderRadius: '14px', border: '1px solid rgba(0,200,255,0.2)', background: 'transparent', color: 'var(--st-accent)', fontSize: '15px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s' }}>
            Enter Shark Tank
          </a>
          <a href="/arena"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 32px', borderRadius: '14px', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', fontSize: '15px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s' }}>
            <Trophy style={{ width: 18, height: 18 }} /> Enter The Arena
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