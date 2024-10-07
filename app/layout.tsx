"use client"

import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from '@/components/Navbar';
import { BookProvider } from '@/contexts/BookContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const ErrorBoundary = dynamic(() => import('@/components/ErrorBoundary'), { ssr: false });

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarState, setSidebarState] = useState<{ isOpen: boolean; position: 'left' | 'right' }>({
    isOpen: false,
    position: 'right'
  });

  const mainContainerClass = sidebarState.isOpen
    ? `main-container sidebar-open-${sidebarState.position}`
    : 'main-container';

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
                  <main className={`flex-grow ${mainContainerClass} py-8`}>
                    <div className="content-wrapper">
                      {children}
                    </div>
                  </main>
                  <footer className="text-center py-4 text-muted-foreground">
                    © 2024 Story Alchemist. All rights reserved.
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