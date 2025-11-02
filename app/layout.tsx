import './globals.css';
import RefCapture from '@/components/RefCapture';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://thejaayveeworld.com'),
  title: 'The Jaayvee World',
  description: 'Explore our ventures across different domains - Building Connections, Creating Memories',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Jaayvee World',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#1e3a8a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/static/logos/talaash/talaash_fav.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Jaayvee World" />
      </head>
      <body className="min-h-screen bg-paper text-ink">
        <RefCapture />
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
