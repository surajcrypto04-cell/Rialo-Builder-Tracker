import { Zap, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--bh-accent)] to-[var(--st-accent)] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-[var(--bh-accent)] to-[var(--st-accent)] bg-clip-text text-transparent">
                Rialo Arena
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
              Where builders compete and the community decides.
              Showcase your projects, earn votes, and build your reputation.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Explore</h4>
            <ul className="space-y-3">
              <li><Link href="/builders-hub" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Builder&apos;s Hub</Link></li>
              <li><Link href="/shark-tank" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Shark Tank</Link></li>
              <li><Link href="/hall-of-fame" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Hall of Fame</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Community</h4>
            <ul className="space-y-3">
              <li><a href="https://discord.gg/rialo" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Discord</a></li>
              <li><a href="https://twitter.com/rialo" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Twitter / X</a></li>
            </ul>
          </div>

          {/* Voting */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Voting Power</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-md bg-[var(--st-accent)]/10 text-[var(--st-accent)] text-xs font-bold">1x</span>
                <span className="text-sm text-[var(--text-secondary)]">Community Members</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-md bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-bold">2x</span>
                <span className="text-sm text-[var(--text-secondary)]">Club Members</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Rialo Builders Arena
          </p>
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by the community
          </p>
        </div>
      </div>
    </footer>
  );
}