import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Elizabeth Lee Dream Dress Studio',
  description: 'Customize your perfect bridal gown',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white">{children}</body>
    </html>
  );
}
