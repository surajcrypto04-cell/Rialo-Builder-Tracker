import { Zap, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--bh-accent)] to-[var(--st-accent)] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-[var(--bh-accent)] to-[var(--st-accent)] bg-clip-text text-transparent">
                Rialo Arena
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs">
              Where builders compete and the community decides. 
              Showcase your projects, earn votes, and build your reputation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              <FooterLink href="/builders-hub" label="Builder's Hub" />
              <FooterLink href="/shark-tank" label="Shark Tank" />
              <FooterLink href="/hall-of-fame" label="Hall of Fame" />
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              Community
            </h4>
            <ul className="space-y-2">
              <FooterLink href="https://discord.gg/rialo" label="Discord" external />
              <FooterLink href="https://twitter.com/rialo" label="Twitter / X" external />
            </ul>
          </div>

          {/* Voting Info */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              Voting
            </h4>
            <div className="space-y-2 text-sm text-[var(--text-secondary)]">
              <p className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-[var(--st-accent)]/10 text-[var(--st-accent)] text-xs font-medium">
                  1x
                </span>
                Community Members
              </p>
              <p className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-medium">
                  2x
                </span>
                Club Members
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-secondary)]">
            © {new Date().getFullYear()} Rialo Builders Arena
          </p>
          <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by the community
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  if (external) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          {label}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        {label}
      </Link>
    </li>
  );
}