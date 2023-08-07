import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ax framework demos --  chat with your pdf',
  description:
    'A chat with your pdf demo built with the Ax framework (https://github.com/axill-io/ax)',
  icons: {
    icon: '/favicon.ico',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-background antialiased">
            <main className="flex h-screen flex-col">
              <div className="flex items-center justify-between border border-border bg-background px-6 py-4">
                <Link href="https://axilla.io" target="_blank">
                  <Image
                    src="/axilla-logo-text-white.png"
                    height={30}
                    width={90}
                    alt="Axilla logo"
                  />
                </Link>
                <Link href="https://github.com/axilla-io/ax">
                  <div className="flex items-center gap-4">
                    <p className="font-mono">made with ax</p>
                    <Image src="/github-mark-white.png" width={32} height={32} alt="GitHub logo" />
                  </div>
                </Link>
              </div>
              <div className="">{children}</div>
            </main>
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
