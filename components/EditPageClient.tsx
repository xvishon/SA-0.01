"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TextEditor from '@/components/TextEditor';
import NewBookDialog from '@/components/NewBookDialog';
import { useBookContext } from '@/contexts/BookContext';
import { Save, BookPlus } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import * as db from '@/lib/db';
import { useSettings } from '@/contexts/SettingsContext';
import CodexSidebar from '@/components/CodexSidebar';
import { CodexEntry } from '@/types/types'; // Import CodexEntry type

const EditPageClient: React.FC<{ params: { id: string } }> = ({ params }) => {
  const router = useRouter();
  const { currentBook, setCurrentBook, updateBook } = useBookContext();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { pageWidth } = useSettings();
  const [codexEntries, setCodexEntries] = useState<CodexEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { data: book, isLoading, error } = useQuery(['book', params.id], () => db.getBookById(Number(params.id)), {
    onSuccess: (data) => {
      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setCurrentBook(data);
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
      updateMutation.mutate(updatedBook);
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
      setCodexEntries(prevEntries => [...prevEntries, entryWithId]);
    } else {
      console.error("New entry must have a name and description");
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any)?.message || "An unknown error occurred"}</div>;
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

          <NewBookDialog /> {/* Use this directly */}
        </div>
      </div>

      <TextEditor
        bookId={book.id!}
        initialContent={content}
        content={content}
        setContent={setContent}
        onContentChange={handleContentChange}
      />

      <CodexSidebar
        bookId={params.id}
        entries={codexEntries}
        onAddEntry={handleAddCodexEntry}
      />
    </div>
  );
};

export default React.memo(EditPageClient);
