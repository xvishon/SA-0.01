"use client"

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as db from '@/lib/db';

interface Book {
  id?: number;
  title: string;
  author: string;
  coverUrl: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CodexEntry {
  id: number;
  bookId: number | null; // null for global entries
  category: string;
  name: string;
  description: string;
}

interface BookContextType {
  books: Book[];
  currentBook: Book | null;
  setCurrentBook: (book: Book | null) => void;
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Book>;
  updateBook: (book: Book) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  codexEntries: CodexEntry[];
  addCodexEntry: (entry: Omit<CodexEntry, 'id'>) => Promise<CodexEntry>;
  updateCodexEntry: (entry: CodexEntry) => Promise<void>;
  deleteCodexEntry: (id: number) => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BookProviderInner>{children}</BookProviderInner>
    </QueryClientProvider>
  );
};

const BookProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const queryClient = useQueryClient();

  const { data: books = [], isLoading: isBooksLoading, error: booksError } = useQuery<Book[], Error>(['books'], db.getAllBooks);
  const { data: codexEntries = [], isLoading: isCodexLoading, error: codexError } = useQuery<CodexEntry[], Error>(['codexEntries'], db.getAllCodexEntries);

  const addBookMutation = useMutation(db.createBook, {
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
    },
  });

  const updateBookMutation = useMutation(db.updateBook, {
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
    },
  });

  const deleteBookMutation = useMutation(db.deleteBook, {
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
    },
  });

  const addCodexEntryMutation = useMutation(db.createCodexEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries(['codexEntries']);
    },
  });

  const updateCodexEntryMutation = useMutation(db.updateCodexEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries(['codexEntries']);
    },
  });

  const deleteCodexEntryMutation = useMutation(db.deleteCodexEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries(['codexEntries']);
    },
  });

  const addBook = useCallback(async (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> => {
    const newBook = await addBookMutation.mutateAsync(book);
    return newBook;
  }, [addBookMutation]);

  const updateBook = useCallback(async (book: Book) => {
    if (!book.id) {
      console.error('Cannot update book without an id');
      return;
    }
    await updateBookMutation.mutateAsync(book);
  }, [updateBookMutation]);

  const deleteBook = useCallback(async (id: number) => {
    await deleteBookMutation.mutateAsync(id);
  }, [deleteBookMutation]);

  const addCodexEntry = useCallback(async (entry: Omit<CodexEntry, 'id'>): Promise<CodexEntry> => {
    const newEntry = await addCodexEntryMutation.mutateAsync(entry);
    return newEntry;
  }, [addCodexEntryMutation]);

  const updateCodexEntry = useCallback(async (entry: CodexEntry) => {
    await updateCodexEntryMutation.mutateAsync(entry);
  }, [updateCodexEntryMutation]);

  const deleteCodexEntry = useCallback(async (id: number) => {
    await deleteCodexEntryMutation.mutateAsync(id);
  }, [deleteCodexEntryMutation]);

  const contextValue = useMemo(() => ({
    books,
    currentBook,
    setCurrentBook,
    addBook,
    updateBook,
    deleteBook,
    isLoading: isBooksLoading || isCodexLoading,
    error: booksError || codexError,
    codexEntries,
    addCodexEntry,
    updateCodexEntry,
    deleteCodexEntry,
  }), [books, currentBook, codexEntries, isBooksLoading, isCodexLoading, booksError, codexError, addBook, updateBook, deleteBook, addCodexEntry, updateCodexEntry, deleteCodexEntry]);

  return (
    <BookContext.Provider value={contextValue}>
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBookContext must be used within a BookProvider');
  }
  return context;
};