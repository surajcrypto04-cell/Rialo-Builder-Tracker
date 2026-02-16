import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Rialo Builders Arena | Where Builders Compete',
  description:
    'Showcase your projects, earn community votes, and build your reputation in the Rialo Builders Hub and Shark Tank.',
  keywords: ['web3', 'builders', 'solana', 'defi', 'nft', 'hackathon', 'voting'],
  openGraph: {
    title: 'Rialo Builders Arena',
    description: 'Where builders compete and the community decides.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <SessionProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}