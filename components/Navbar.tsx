"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useBookContext } from '@/contexts/BookContext';
import { BookOpen, Feather, Beaker, TestTube } from 'lucide-react';
import SettingsPopover from '@/components/SettingsPopover';
import { useSettings } from '@/contexts/SettingsContext';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentBook } = useBookContext();
  const { pageWidth } = useSettings();

  const handleWriteClick = () => {
    if (currentBook) {
      router.push(`/edit/${currentBook.id}`);
    } else {
      router.push('/new-book');
    }
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-10">
      <div className={`mx-auto px-4 ${pageWidth === 'narrow' ? 'max-w-2xl' : pageWidth === 'medium' ? 'max-w-4xl' : 'max-w-6xl'}`}>
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold text-foreground flex items-center">
              <Beaker className="h-6 w-6 mr-2 text-primary" />
              Story Alchemist
            </Link>
            <Button
              variant={pathname === '/' ? 'default' : 'ghost'}
              onClick={() => router.push('/')}
              className="hidden sm:inline-flex"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Library
            </Button>
            <Button
              variant={pathname.startsWith('/edit') || pathname === '/new-book' ? 'default' : 'ghost'}
              onClick={handleWriteClick}
              className="hidden sm:inline-flex"
            >
              <Feather className="h-4 w-4 mr-2" />
              Write
            </Button>
            <Button
              variant={pathname === '/lab' ? 'default' : 'ghost'}
              onClick={() => router.push('/lab')}
              className="hidden sm:inline-flex"
            >
              <Beaker className="h-4 w-4 mr-2" />
              Lab
            </Button>
            <Button
              variant={pathname === '/test' ? 'default' : 'ghost'}
              onClick={() => router.push('/test')}
              className="hidden sm:inline-flex"
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test
            </Button>
          </div>
          <SettingsPopover />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;