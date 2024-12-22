import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'LinkToPost',
  description: 'Created by sheninthjr',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Sidebar />
        <Footer />
        {children}
      </body>
    </html>
  );
}
