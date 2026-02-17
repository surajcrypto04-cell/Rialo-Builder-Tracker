'use client';

import { Zap, Heart, Github, Twitter, ArrowUpRight, Hammer, Fish, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: '80px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: 'linear-gradient(180deg, var(--bg-primary) 0%, rgba(12,12,18,1) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle glow effects */}
      <div style={{ position: 'absolute', bottom: '-200px', left: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--bh-accent)', opacity: 0.015, filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-200px', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--st-accent)', opacity: 0.015, filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px 32px', position: 'relative', zIndex: 1 }}>
        {/* Top Section — Brand + CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '40px', marginBottom: '56px' }}>
          {/* Brand */}
          <div style={{ maxWidth: '340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '14px', background: 'linear-gradient(135deg, var(--bh-accent), var(--st-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap style={{ width: 24, height: 24, color: 'white' }} />
              </div>
              <div>
                <span style={{ fontSize: '20px', fontWeight: 800, background: 'linear-gradient(90deg, var(--bh-accent), var(--st-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block', lineHeight: 1.2 }}>
                  Rialo Arena
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>BUILDERS HUB</span>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Where builders compete and the community decides. Showcase your projects, earn votes, and build your reputation in the Rialo ecosystem.
            </p>
          </div>

          {/* Voting Power Card */}
          <div
            style={{
              padding: '24px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              minWidth: '260px',
            }}
          >
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Voting Power
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '28px', borderRadius: '8px', background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: 'var(--st-accent)' }}>
                  1x
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Community Members</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Join the Rialo Discord</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '28px', borderRadius: '8px', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: 'var(--gold)' }}>
                  2x
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Club Members</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Double the impact</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section — Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            paddingBottom: '48px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            marginBottom: '32px',
          }}
        >
          {/* Explore */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Explore
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FooterNavLink href="/builders-hub" label="Builder's Hub" icon={<Hammer style={{ width: 14, height: 14 }} />} color="var(--bh-accent)" />
              <FooterNavLink href="/shark-tank" label="Shark Tank" icon={<Fish style={{ width: 14, height: 14 }} />} color="var(--st-accent)" />
              <FooterNavLink href="/hall-of-fame" label="Hall of Fame" icon={<Trophy style={{ width: 14, height: 14 }} />} color="var(--gold)" />
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Community
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FooterExtLink href="https://discord.gg/rialo" label="Discord Server" icon={
                <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.373-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" /></svg>
              } />
              <FooterExtLink href="https://twitter.com/rialo" label="Twitter / X" icon={<Twitter style={{ width: 14, height: 14 }} />} />
              <FooterExtLink href="https://github.com/rialo" label="GitHub" icon={<Github style={{ width: 14, height: 14 }} />} />
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              How It Works
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <StepItem number="01" text="Builders submit their projects" />
              <StepItem number="02" text="Community members vote" />
              <StepItem number="03" text="Winners are crowned weekly" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Rialo Builders Arena. All rights reserved.
          </p>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built with
            <Heart style={{ width: 12, height: 12, color: '#ef4444', fill: '#ef4444' }} />
            for the builder community
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterNavLink({ href, label, icon, color }: { href: string; label: string; icon: React.ReactNode; color: string }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        fontSize: '13px', color: 'var(--text-secondary)',
        textDecoration: 'none', transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = color; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
    >
      <div style={{ opacity: 0.7 }}>{icon}</div>
      {label}
    </Link>
  );
}

function FooterExtLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        fontSize: '13px', color: 'var(--text-secondary)',
        textDecoration: 'none', transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
    >
      <div style={{ opacity: 0.7 }}>{icon}</div>
      {label}
      <ArrowUpRight style={{ width: 12, height: 12, opacity: 0.4 }} />
    </a>
  );
}

function StepItem({ number, text }: { number: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span
        style={{
          fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)',
          width: '28px', height: '28px', borderRadius: '8px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {number}
      </span>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}