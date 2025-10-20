import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppProviders from './AppProviders';
import RootLayoutContent from '@/components/RootLayoutContent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TrendRadar Hub',
  description: 'AI-powered trend analysis and content management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders>
          <RootLayoutContent>{children}</RootLayoutContent>
        </AppProviders>
      </body>
    </html>
  );
}