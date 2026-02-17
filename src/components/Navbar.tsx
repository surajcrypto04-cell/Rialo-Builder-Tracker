'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  Menu,
  X,
  LogIn,
  LogOut,
  Trophy,
  Shield,
  Hammer,
  Fish,
  Zap,
} from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = session?.user as any;

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
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                }}
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

          {/* CENTER — Navigation Links (Desktop Only) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            className="hide-mobile"
          >
            <DesktopLink href="/" label="Home" />
            <DesktopLink href="/builders-hub" label="Builder's Hub" icon={<Hammer style={{ width: 14, height: 14 }} />} />
            <DesktopLink href="/shark-tank" label="Shark Tank" icon={<Fish style={{ width: 14, height: 14 }} />} />
            <DesktopLink href="/hall-of-fame" label="Hall of Fame" icon={<Trophy style={{ width: 14, height: 14 }} />} />
            {user?.isAdmin && (
              <DesktopLink href="/admin" label="Admin" icon={<Shield style={{ width: 14, height: 14 }} />} />
            )}
          </div>

          {/* RIGHT — Auth + Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Auth Section */}
            {status === 'loading' ? (
              <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
            ) : session ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* User Info — Desktop Only */}
                <div
                  className="hide-mobile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {user?.image && (
                    <img
                      src={user.image}
                      alt=""
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user?.username || user?.name}
                  </span>
                  {user?.isClubMember && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: 'rgba(255, 215, 0, 0.1)',
                        color: 'var(--gold)',
                      }}
                    >
                      2x
                    </span>
                  )}
                  {user?.isRialoMember && !user?.isClubMember && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: 'rgba(0, 200, 255, 0.1)',
                        color: 'var(--st-accent)',
                      }}
                    >
                      Member
                    </span>
                  )}
                </div>

                {/* Mobile Avatar Only */}
                <div className="hide-desktop">
                  {user?.image && (
                    <img
                      src={user.image}
                      alt=""
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    />
                  )}
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={() => signOut()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                  title="Sign Out"
                >
                  <LogOut style={{ width: 18, height: 18 }} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('discord')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#5865F2',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#4752C4'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#5865F2'; }}
              >
                <LogIn style={{ width: 16, height: 16 }} />
                <span className="hide-mobile">Sign in with Discord</span>
                <span className="hide-desktop">Sign in</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hide-desktop"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '10px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                cursor: 'pointer',
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
            <MobileLink href="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileLink href="/builders-hub" label="Builder's Hub" icon={<Hammer style={{ width: 18, height: 18 }} />} onClick={() => setIsMobileMenuOpen(false)} />
            <MobileLink href="/shark-tank" label="Shark Tank" icon={<Fish style={{ width: 18, height: 18 }} />} onClick={() => setIsMobileMenuOpen(false)} />
            <MobileLink href="/hall-of-fame" label="Hall of Fame" icon={<Trophy style={{ width: 18, height: 18 }} />} onClick={() => setIsMobileMenuOpen(false)} />
            {user?.isAdmin && (
              <MobileLink href="/admin" label="Admin Panel" icon={<Shield style={{ width: 18, height: 18 }} />} onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {session && (
              <>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />
                <button
                  onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'transparent',
                    color: '#ef4444',
                    fontSize: '14px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <LogOut style={{ width: 18, height: 18 }} />
                  Sign Out
                </button>
              </>
            )}
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
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        transition: 'all 0.2s',
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
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '12px',
        fontSize: '14px',
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        transition: 'all 0.2s',
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