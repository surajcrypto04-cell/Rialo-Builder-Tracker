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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'navbar-glass shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--bh-accent)] to-[var(--st-accent)] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-bold bg-gradient-to-r from-[var(--bh-accent)] to-[var(--st-accent)] bg-clip-text text-transparent hidden sm:inline">
                Rialo Arena
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/" label="Home" />
              <NavLink href="/builders-hub" label="Builder's Hub" icon={<Hammer className="w-3.5 h-3.5" />} />
              <NavLink href="/shark-tank" label="Shark Tank" icon={<Fish className="w-3.5 h-3.5" />} />
              <NavLink href="/hall-of-fame" label="Hall of Fame" icon={<Trophy className="w-3.5 h-3.5" />} />
              {user?.isAdmin && (
                <NavLink href="/admin" label="Admin" icon={<Shield className="w-3.5 h-3.5" />} />
              )}
            </div>

            {/* Right Side: Auth + Mobile Toggle */}
            <div className="flex items-center gap-2">
              {status === 'loading' ? (
                <div className="w-8 h-8 rounded-full skeleton" />
              ) : session ? (
                <div className="flex items-center gap-2">
                  {/* User Info - Desktop */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                    {user?.image && (
                      <img
                        src={user.image}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-xs font-medium text-[var(--text-primary)] max-w-[100px] truncate">
                      {user?.username || user?.name}
                    </span>
                    {user?.isClubMember && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] font-bold">
                        2x
                      </span>
                    )}
                  </div>

                  {/* Mobile Avatar */}
                  {user?.image && (
                    <img
                      src={user.image}
                      alt=""
                      className="w-7 h-7 rounded-full sm:hidden"
                    />
                  )}

                  {/* Sign Out */}
                  <button
                    onClick={() => signOut()}
                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn('discord')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs sm:text-sm font-medium transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign in with Discord</span>
                  <span className="sm:hidden">Sign in</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="navbar-glass border-t border-white/5 px-4 py-3 space-y-1">
            <MobileLink href="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileLink href="/builders-hub" label="Builder's Hub" icon={<Hammer className="w-4 h-4" />} onClick={() => setIsMobileMenuOpen(false)} />
            <MobileLink href="/shark-tank" label="Shark Tank" icon={<Fish className="w-4 h-4" />} onClick={() => setIsMobileMenuOpen(false)} />
            <MobileLink href="/hall-of-fame" label="Hall of Fame" icon={<Trophy className="w-4 h-4" />} onClick={() => setIsMobileMenuOpen(false)} />
            {user?.isAdmin && (
              <MobileLink href="/admin" label="Admin" icon={<Shield className="w-4 h-4" />} onClick={() => setIsMobileMenuOpen(false)} />
            )}
          </div>
        </div>
      </nav>

      <div className="h-16" />
    </>
  );
}

function NavLink({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
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
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}