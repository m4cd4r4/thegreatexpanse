import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { QueryProvider } from '@/lib/providers/query-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileMenu } from '@/components/layout/mobile-menu';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RocketWatch - For the love of space',
  description:
    'A free, inclusive space hub for everyone from 5-year-olds to aerospace engineers. Track launches, watch live streams, and explore the cosmos.',
  keywords: ['space', 'rockets', 'launches', 'SpaceX', 'NASA', 'astronomy'],
  authors: [{ name: 'RocketWatch' }],
  openGraph: {
    title: 'RocketWatch - For the love of space',
    description: 'Track every space launch, past, present, and future.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-void text-starlight antialiased">
        <QueryProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <MobileMenu />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
