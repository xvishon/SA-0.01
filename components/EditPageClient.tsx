"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TextEditor from '@/components/TextEditor';
import NewBookDialog from '@/components/NewBookDialog';
import { useBookContext } from '@/contexts/BookContext';
import { Save, BookPlus } from 'lucide-react';
import { debounce } from 'lodash';
import { useQuery, useMutation } from '@tanstack/react-query';
import * as db from '@/lib/db';
import { useSettings } from '@/contexts/SettingsContext';

const EditPageClient: React.FC<{ params: { id: string } }> = ({ params }) => {
  const { setCurrentBook, updateBook } = useBookContext();
  const [showNewBookDialog, setShowNewBookDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localBook, setLocalBook] = useState<db.Book | null>(null);
  const router = useRouter();
  const contentRef = useRef('');
  const { pageWidth } = useSettings();

  const { data: fetchedBook, isLoading, error } = useQuery(
    ['book', params.id],
    () => db.getBookById(parseInt(params.id)),
    {
      enabled: !!params.id,
      onSuccess: (data) => {
        if (data) {
          setLocalBook(data);
          setCurrentBook(data);
          contentRef.current = data.content;
        }
      },
    }
  );

  const updateBookMutation = useMutation(updateBook, {
    onSuccess: (updatedBook) => {
      if (updatedBook) {
        setLocalBook(updatedBook);
        setCurrentBook(updatedBook);
      }
      setIsSaving(false);
    },
  });

  const debouncedUpdateBook = useCallback(
    debounce((book: db.Book) => {
      setIsSaving(true);
      updateBookMutation.mutate(book);
    }, 1000),
    [updateBookMutation]
  );

  useEffect(() => {
    if (fetchedBook) {
      setLocalBook(fetchedBook);
      contentRef.current = fetchedBook.content;
    }
  }, [fetchedBook]);

  const handleSave = async () => {
    if (localBook && localBook.id) {
      setIsSaving(true);
      await updateBookMutation.mutateAsync(localBook);
    }
  };

  const handleNewBook = async (newBook: { title: string; author: string; coverUrl: string }) => {
    const newDocument = { ...newBook, content: '' };
    const addedBook = await db.createBook(newDocument);
    setCurrentBook(addedBook);
    setLocalBook(addedBook);
    contentRef.current = '';
    setShowNewBookDialog(false);
    router.push(`/edit/${addedBook.id}`);
  };

  const handleContentChange = (content: string) => {
    if (localBook && localBook.id) {
      contentRef.current = content;
      const updatedBook = { ...localBook, content };
      setLocalBook(updatedBook);
      debouncedUpdateBook(updatedBook);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localBook && localBook.id) {
      const updatedBook = { ...localBook, title: e.target.value };
      setLocalBook(updatedBook);
      debouncedUpdateBook(updatedBook);
    }
  };

  if (isLoading) {
    return <div className="loading-glow">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (showNewBookDialog) {
    return <NewBookDialog onAddBook={handleNewBook} />;
  }

  if (!localBook || !localBook.id) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Tome Selected</h2>
          <Button onClick={() => setShowNewBookDialog(true)} className="bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
            <BookPlus className="h-4 w-4 mr-2" />
            Create New Tome
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 ${pageWidth === 'narrow' ? 'max-w-2xl' : pageWidth === 'medium' ? 'max-w-4xl' : 'max-w-6xl'}`}>
      <div className={`bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-6 ${isSaving ? 'loading-glow' : ''}`}>
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <Input
              type="text"
              value={localBook.title}
              onChange={handleTitleChange}
              className="text-2xl font-bold bg-transparent border-none focus:ring-0 flex-grow mr-4"
              placeholder="Enter book title..."
            />
            <Button 
              onClick={handleSave} 
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
        <TextEditor 
          bookId={localBook.id}
          initialContent={contentRef.current}
          onContentChange={handleContentChange}
        />
      </div>
    </div>
  );
};

export default React.memo(EditPageClient);