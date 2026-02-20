'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Trophy, Shield, Hammer, Fish } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 0.3s',
          background: isScrolled ? 'rgba(10, 10, 15, 0.85)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
          }}
        >
          {/* LEFT — Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, textDecoration: 'none' }}>
            <img
              src="/rialo-logo.png"
              alt="Rialo"
              style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <span
              style={{
                fontSize: '16px',
                fontWeight: 700,
                background: 'linear-gradient(90deg, var(--bh-accent), var(--st-accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Rialo Arena
            </span>
          </Link>

          {/* CENTER — Navigation Links (Desktop) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hide-mobile">
            <DesktopLink href="/" label="Home" />
            <DesktopLink href="/builders-hub" label="Builder's Hub" icon={<Hammer style={{ width: 14, height: 14 }} />} />
            <DesktopLink href="/shark-tank" label="Shark Tank" icon={<Fish style={{ width: 14, height: 14 }} />} />
            <DesktopLink href="/hall-of-fame" label="Hall of Fame" icon={<Trophy style={{ width: 14, height: 14 }} />} />
          </div>

          {/* RIGHT — Season Badge + Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Season Badge */}
            <div
              className="hide-mobile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: 'rgba(255,140,0,0.08)',
                border: '1px solid rgba(255,140,0,0.2)',
              }}
            >
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'glowPulse 2s infinite' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--bh-accent)' }}>Season 1 Live</span>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hide-desktop"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '8px', borderRadius: '10px', border: 'none',
                background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer',
              }}
            >
              {isMobileMenuOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          style={{
            overflow: 'hidden',
            maxHeight: isMobileMenuOpen ? '400px' : '0px',
            opacity: isMobileMenuOpen ? 1 : 0,
            transition: 'all 0.3s ease',
            background: 'rgba(10, 10, 15, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: isMobileMenuOpen ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}
          className="hide-desktop"
        >
          <div style={{ padding: '12px 24px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <MobileLink href="/builders-hub" label="Builder's Hub" icon={<Hammer style={{ width: 18, height: 18 }} />} onClick={() => setIsMobileMenuOpen(false)} />
            <MobileLink href="/shark-tank" label="Shark Tank" icon={<Fish style={{ width: 18, height: 18 }} />} onClick={() => setIsMobileMenuOpen(false)} />
            <MobileLink href="/hall-of-fame" label="Hall of Fame" icon={<Trophy style={{ width: 18, height: 18 }} />} onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div style={{ height: '64px' }} />
    </>
  );
}

function DesktopLink({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '8px 14px', borderRadius: '10px',
        fontSize: '13px', fontWeight: 500,
        color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileLink({ href, label, icon, onClick }: { href: string; label: string; icon?: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 16px', borderRadius: '12px',
        fontSize: '14px', color: 'var(--text-secondary)',
        textDecoration: 'none', transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {icon}
      {label}
    </Link>
  );
}