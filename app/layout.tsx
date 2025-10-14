import './globals.css';
import RefCapture from '@/components/RefCapture';

export const metadata = { 
  title: 'The Jaayvee World',
  description: 'Explore our ventures across different domains - Building Connections, Creating Memories',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink">
        <RefCapture />
        {children}
      </body>
    </html>
  );
}
