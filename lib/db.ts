import { openDB, DBSchema } from 'idb';

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
  id?: number;
  bookId: number | null; // null for global entries
  category: string;
  name: string;
  description: string;
}

interface MyDB extends DBSchema {
  books: {
    key: number;
    value: Book;
    indexes: { 'by-title': string };
  };
  codexEntries: {
    key: number;
    value: CodexEntry;
    indexes: { 'by-book': number, 'by-category': string };
  };
}

const DB_NAME = 'alchemist-library';
const DB_VERSION = 2;

const dbPromise = openDB<MyDB>(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    if (oldVersion < 1) {
      const bookStore = db.createObjectStore('books', { keyPath: 'id', autoIncrement: true });
      bookStore.createIndex('by-title', 'title');
    }
    if (oldVersion < 2) {
      const codexStore = db.createObjectStore('codexEntries', { keyPath: 'id', autoIncrement: true });
      codexStore.createIndex('by-book', 'bookId');
      codexStore.createIndex('by-category', 'category');
    }
  },
});

// Book-related functions
export async function getAllBooks(): Promise<Book[]> {
  const db = await dbPromise;
  return db.getAll('books');
}

export async function getBookById(id: number): Promise<Book | undefined> {
  const db = await dbPromise;
  return db.get('books', id);
}

export async function createBook(book: Omit<Book, 'id'>): Promise<Book> {
  const db = await dbPromise;
  const id = await db.add('books', {
    ...book,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { ...book, id };
}

export async function updateBook(book: Book): Promise<void> {
  const db = await dbPromise;
  const updatedBook = { ...book, updatedAt: new Date() };
  await db.put('books', updatedBook);
}

export async function deleteBook(id: number): Promise<void> {
  const db = await dbPromise;
  await db.delete('books', id);
}

// Codex-related functions
export async function getAllCodexEntries(): Promise<CodexEntry[]> {
  const db = await dbPromise;
  return db.getAll('codexEntries');
}

export async function getCodexEntriesByBook(bookId: number | null): Promise<CodexEntry[]> {
  const db = await dbPromise;
  return db.getAllFromIndex('codexEntries', 'by-book', bookId);
}

export async function getCodexEntriesByCategory(category: string): Promise<CodexEntry[]> {
  const db = await dbPromise;
  return db.getAllFromIndex('codexEntries', 'by-category', category);
}

export async function createCodexEntry(entry: Omit<CodexEntry, 'id'>): Promise<CodexEntry> {
  const db = await dbPromise;
  const id = await db.add('codexEntries', entry);
  return { ...entry, id };
}

export async function updateCodexEntry(entry: CodexEntry): Promise<void> {
  const db = await dbPromise;
  await db.put('codexEntries', entry);
}

export async function deleteCodexEntry(id: number): Promise<void> {
  const db = await dbPromise;
  await db.delete('codexEntries', id);
}