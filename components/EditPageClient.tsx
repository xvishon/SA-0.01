'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TextEditor from '@/components/TextEditor';
import NewBookDialog from '@/components/NewBookDialog';
import { useBookContext } from '@/contexts/BookContext';
import { Save } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import * as db from '@/lib/db';
import { useSettings } from '@/contexts/SettingsContext';
import CodexSidebar from '@/components/CodexSidebar';
import { CodexEntry } from '@/types/types';

interface EditPageClientProps {
  params: { id: string };
}

const EditPageClient: React.FC<EditPageClientProps> = ({ params }) => {
  const router = useRouter();
  const { currentBook, setCurrentBook, updateBook } = useBookContext();
  const [title, setTitle] = useState<string>(''); // Track book title
  const [content, setContent] = useState<string>(''); // Track book content
  const { pageWidth } = useSettings();
  const [codexEntries, setCodexEntries] = useState<CodexEntry[]>([]); // Manage Codex entries
  const [isSaving, setIsSaving] = useState<boolean>(false); // Saving state
  const [isCodexSidebarOpen, setIsCodexSidebarOpen] = useState<boolean>(false); // Control Codex Sidebar state

  const { data: book, isLoading, error } = useQuery(['book', params.id], () => db.getBookById(Number(params.id)), {
    onSuccess: (data) => {
      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setCurrentBook(data); // Set current book in the context
      }
    },
  });

  const updateMutation = useMutation(updateBook, {
    onSuccess: () => {
      setIsSaving(false);
    },
    onError: () => {
      setIsSaving(false);
    },
  });

  const handleSave = useCallback(() => {
    if (currentBook) {
      setIsSaving(true);
      const updatedBook = { ...currentBook, title, content };
      updateMutation.mutate(updatedBook); // Use mutation to save changes
    }
  }, [currentBook, title, content, updateMutation]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    if (currentBook) {
      setCurrentBook({ ...currentBook, content: newContent });
    }
  }, [currentBook, setCurrentBook]);

  const handleAddCodexEntry = useCallback((newEntry: Omit<CodexEntry, 'id'>) => {
    if (newEntry.name && newEntry.description) {
      const entryWithId = { ...newEntry, id: Date.now().toString() };
      setCodexEntries((prevEntries) => [...prevEntries, entryWithId]);
    } else {
      console.error('New entry must have a name and description');
    }
  }, []);

  const toggleCodexSidebar = () => {
    setIsCodexSidebarOpen((prev) => !prev); // Toggle the sidebar state
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave(); // Trigger save on Ctrl+S or Cmd+S
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message || 'An unknown error occurred'}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div className={`container mx-auto p-4 ${pageWidth === 'narrow' ? 'max-w-2xl' : pageWidth === 'medium' ? 'max-w-4xl' : 'max-w-6xl'}`}>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold w-1/2"
        />
        <div className="flex items-center space-x-2">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <NewBookDialog /> {/* Display new book dialog */}
          <Button onClick={toggleCodexSidebar}> {/* Button to toggle sidebar */}
            {isCodexSidebarOpen ? 'Close Codex' : 'Open Codex'}
          </Button>
        </div>
      </div>

      <TextEditor
        bookId={book.id!} // Pass the book ID
        initialContent={content} // Initial content for the editor
        onContentChange={handleContentChange} // Handle content changes
      />

      <CodexSidebar
        bookId={params.id} // Pass the book ID to the sidebar
        entries={codexEntries} // Pass Codex entries
        onAddEntry={handleAddCodexEntry} // Handle adding new Codex entries
        isOpen={isCodexSidebarOpen} // Use state to control visibility
        onClose={toggleCodexSidebar} // Close the sidebar
      />
    </div>
  );
};

export default React.memo(EditPageClient); // Use React.memo for performance optimization
