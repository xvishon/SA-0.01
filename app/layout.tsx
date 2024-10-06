import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from '@/components/Navbar';
import { BookProvider } from '@/contexts/BookContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import dynamic from 'next/dynamic';

const ErrorBoundary = dynamic(() => import('@/components/ErrorBoundary'), { ssr: false });

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Story Alchemist',
  description: 'A magical text editor application for aspiring storytellers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark alchemist-bg min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SettingsProvider>
            <BookProvider>
              <ErrorBoundary>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-grow main-container py-8">
                    <div className="content-wrapper">
                      {children}
                    </div>
                  </main>
                  <footer className="text-center py-4 text-muted-foreground">
                    © 2023 Story Alchemist. All rights reserved.
                  </footer>
                </div>
              </ErrorBoundary>
            </BookProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}