import './globals.css';
import RefCapture from '@/components/RefCapture';

export const metadata = { title: 'Jaayvee World' };

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
