import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Client Email System',
  description: 'View clients and their email scores',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <main className="container mx-auto px-4 py-8">
        <Image
            className="mb-6"
            src="/logo.png"
            alt="Logo"
            width={200}
            height={60}
          />
          {children}
        </main>
      </body>
    </html>
  );
}