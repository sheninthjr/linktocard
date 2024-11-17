import type { Metadata } from 'next';
import './globals.css';
import SessionWrapper from '@/lib/SessionWrapper';

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
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
