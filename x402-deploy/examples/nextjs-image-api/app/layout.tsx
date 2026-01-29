import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Image Processing API - x402',
  description: 'Credit-based image processing with cryptocurrency payments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
