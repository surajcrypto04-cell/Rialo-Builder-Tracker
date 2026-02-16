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
  ChevronDown,
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'navbar-glass shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[var(--bh-accent)] to-[var(--st-accent)] flex items-center justify-center transition-transform group-hover:scale-110">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-[var(--bh-accent)] to-[var(--st-accent)] bg-clip-text text-transparent">
                  Rialo Arena
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] leading-none hide-mobile">
                  Builders Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/" label="Home" />
              <NavLink href="/builders-hub" label="Builder's Hub" icon={<Hammer className="w-4 h-4" />} />
              <NavLink href="/shark-tank" label="Shark Tank" icon={<Fish className="w-4 h-4" />} />
              <NavLink href="/hall-of-fame" label="Hall of Fame" icon={<Trophy className="w-4 h-4" />} />

              {user?.isAdmin && (
                <NavLink href="/admin" label="Admin" icon={<Shield className="w-4 h-4" />} />
              )}
            </div>

            {/* Auth Button + Mobile Toggle */}
            <div className="flex items-center gap-3">
              {/* Auth Section */}
              {status === 'loading' ? (
                <div className="w-8 h-8 rounded-full skeleton" />
              ) : session ? (
                <div className="flex items-center gap-3">
                  {/* User Info */}
                  <div className="hidden sm:flex items-center gap-2">
                    {user?.image && (
                      <img
                        src={user.image}
                        alt={user.name || 'User'}
                        className="w-8 h-8 rounded-full border border-white/10"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {user?.username || user?.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {user?.isClubMember && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] font-medium">
                            Club 2x
                          </span>
                        )}
                        {user?.isRialoMember && !user?.isClubMember && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--st-accent)]/10 text-[var(--st-accent)] font-medium">
                            Member
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mobile avatar only */}
                  <div className="sm:hidden">
                    {user?.image && (
                      <img
                        src={user.image}
                        alt={user.name || 'User'}
                        className="w-8 h-8 rounded-full border border-white/10"
                      />
                    )}
                  </div>

                  {/* Sign Out */}
                  <button
                    onClick={() => signOut()}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn('discord')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-medium transition-all hover:scale-105 active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign in with Discord</span>
                  <span className="sm:hidden">Sign in</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="navbar-glass border-t border-white/5 px-4 py-4 space-y-1">
            <MobileNavLink href="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileNavLink
              href="/builders-hub"
              label="Builder's Hub"
              icon={<Hammer className="w-4 h-4" />}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavLink
              href="/shark-tank"
              label="Shark Tank"
              icon={<Fish className="w-4 h-4" />}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavLink
              href="/hall-of-fame"
              label="Hall of Fame"
              icon={<Trophy className="w-4 h-4" />}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {user?.isAdmin && (
              <MobileNavLink
                href="/admin"
                label="Admin Panel"
                icon={<Shield className="w-4 h-4" />}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {session && (
              <button
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content going behind fixed navbar */}
      <div className="h-16 sm:h-20" />
    </>
  );
}

// Desktop Nav Link
function NavLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-all"
    >
      {icon}
      {label}
    </Link>
  );
}

// Mobile Nav Link
function MobileNavLink({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}