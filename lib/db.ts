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

interface MyDB extends DBSchema {
  books: {
    key: number;
    value: Book;
    indexes: { 'by-title': string };
  };
}

const DB_NAME = 'alchemist-library';
const DB_VERSION = 1;

const dbPromise = openDB<MyDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('books')) {
      console.log('initDB: Creating books object store');
      const bookStore = db.createObjectStore('books', { keyPath: 'id', autoIncrement: true });
      bookStore.createIndex('by-title', 'title');
    }
  },
});

export async function getAllBooks(): Promise<Book[]> {
  console.log('getAllBooks: Starting...');
  try {
    const db = await dbPromise;
    const books = await db.getAll('books');
    console.log('getAllBooks: Fetched books', books);
    return books;
  } catch (error) {
    console.error('getAllBooks: Error getting all books:', error);
    return [];
  }
}

export async function getBookById(id: number): Promise<Book | undefined> {
  console.log('getBookById: Starting...', id);
  try {
    const db = await dbPromise;
    const book = await db.get('books', id);
    console.log('getBookById: Fetched book', book);
    return book;
  } catch (error) {
    console.error('getBookById: Error getting book:', error);
    throw error;
  }
}

export async function createBook(book: Omit<Book, 'id'>): Promise<Book> {
  console.log('createBook: Starting...', book);
  try {
    const db = await dbPromise;
    const id = await db.add('books', {
      ...book,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const newBook = { ...book, id };
    console.log('createBook: Book created', newBook);
    return newBook;
  } catch (error) {
    console.error('createBook: Error creating book:', error);
    throw error;
  }
}

export async function updateBook(book: Book): Promise<Book> {
  console.log('updateBook: Starting...', book);
  try {
    const db = await dbPromise;
    const updatedBook = { ...book, updatedAt: new Date() };
    await db.put('books', updatedBook);
    console.log('updateBook: Book updated', updatedBook);
    return updatedBook;
  } catch (error) {
    console.error('updateBook: Error updating book:', error);
    throw error;
  }
}

export async function deleteBook(id: number): Promise<void> {
  console.log('deleteBook: Starting...', id);
  try {
    const db = await dbPromise;
    await db.delete('books', id);
    console.log('deleteBook: Book deleted', id);
  } catch (error) {
    console.error('deleteBook: Error deleting book:', error);
    throw error;
  }
}