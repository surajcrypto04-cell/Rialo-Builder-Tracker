'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Zap, ArrowDown, Shield, Users, Trophy } from 'lucide-react';

export default function Hero() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--bh-accent)] opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--st-accent)] opacity-[0.03] blur-[120px]" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Floating Particles */}
        {mounted && (
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${4 + Math.random() * 6}px`,
                  height: `${4 + Math.random() * 6}px`,
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  background: i % 2 === 0 ? 'var(--bh-accent)' : 'var(--st-accent)',
                  opacity: 0.15,
                  animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-[var(--text-secondary)]">
            Season 1 — Now Live
          </span>
        </div>

        {/* Title */}
        <h1
          className={`text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight transition-all duration-700 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="text-[var(--text-primary)]">Where </span>
          <span className="bg-gradient-to-r from-[var(--bh-accent)] to-[var(--bh-accent-light)] bg-clip-text text-transparent">
            Builders
          </span>
          <br />
          <span className="text-[var(--text-primary)]">Compete & </span>
          <span className="bg-gradient-to-r from-[var(--st-accent-light)] to-[var(--st-accent)] bg-clip-text text-transparent">
            Community
          </span>
          <br />
          <span className="text-[var(--text-primary)]">Decides</span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 transition-all duration-700 delay-400 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Showcase your projects in the{' '}
          <span className="text-[var(--bh-accent)] font-medium">Builder&apos;s Hub</span>,
          pitch in the{' '}
          <span className="text-[var(--st-accent)] font-medium">Shark Tank</span>,
          and let the community vote for the best.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {!session ? (
            <button
              onClick={() => signIn('discord')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold text-base transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#5865F2]/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Sign in with Discord
            </button>
          ) : (
            <a
              href="#builders-hub"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[var(--bh-accent)] to-[var(--bh-accent-light)] text-black font-semibold text-base transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[var(--bh-accent)]/20"
            >
              <Zap className="w-5 h-5" />
              Explore Projects
            </a>
          )}

          <a
            href="#shark-tank"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-[var(--st-border)] text-[var(--st-accent)] font-semibold text-base hover:bg-[var(--st-accent)]/5 transition-all hover:scale-105 active:scale-95"
          >
            Enter Shark Tank
          </a>
        </div>

        {/* Feature Pills */}
        <div
          className={`flex flex-wrap items-center justify-center gap-3 sm:gap-6 transition-all duration-700 delay-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <FeaturePill icon={<Users className="w-4 h-4" />} text="Community Voting" />
          <FeaturePill icon={<Shield className="w-4 h-4" />} text="2x Club Member Power" />
          <FeaturePill icon={<Trophy className="w-4 h-4" />} text="Weekly Winners" />
        </div>

        {/* Scroll Indicator */}
        <div
          className={`mt-16 transition-all duration-700 delay-1000 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <a
            href="#builders-hub"
            className="inline-flex flex-col items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span className="text-xs">Scroll to explore</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-[var(--text-secondary)]">
      {icon}
      {text}
    </div>
  );
}