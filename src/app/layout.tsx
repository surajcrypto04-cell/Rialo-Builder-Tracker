import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import HypeTicker from '@/components/HypeTicker';
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Rialo Builders Arena | Where Builders Compete',
  description:
    'Showcase your projects, earn community votes, and build your reputation in the Rialo Builders Hub and Shark Tank.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="flex flex-col min-h-screen">
          <AnnouncementBanner />
          <Navbar />
          <div style={{ position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 40 }}>
            <HypeTicker />
          </div>
          <main className="flex-1 pt-[100px]">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}