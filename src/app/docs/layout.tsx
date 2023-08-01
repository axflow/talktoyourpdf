import { ThemeProvider } from '@/components/theme-provider';
import '@/app/globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Chat with your pdf',
    template: `%s - Chat with your pdf`,
  },
  description: `Upload any pdf, and ask it any question.`,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Record<string, string>;
  pathname: string;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className="min-h-screen bg-background antialiased">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
