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

interface BookContextType {
  books: Book[];
  currentBook: Book | null;
  setCurrentBook: (book: Book | null) => void;
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Book>;
  updateBook: (book: Book) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
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

  const { data: books = [], isLoading, error } = useQuery<Book[], Error>(['books'], db.getAllBooks, {
    onError: (error) => console.error('Error fetching books:', error),
  });

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

  const contextValue = useMemo(() => ({
    books,
    currentBook,
    setCurrentBook,
    addBook,
    updateBook,
    deleteBook,
    isLoading,
    error,
  }), [books, currentBook, isLoading, error, addBook, updateBook, deleteBook]);

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