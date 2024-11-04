import type { Metadata } from 'next';
import '../globals.css';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';

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
      <body className={`antialiased`}>
        <Navbar />
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
