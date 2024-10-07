import { NextResponse } from 'next/server';
import { getBookById, getAllBooks, createBook, updateBook, deleteBook } from '@/lib/db'; // Ensure these functions exist in db

// GET request handler for fetching books.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const book = await getBookById(Number(id));
      return NextResponse.json(book);
    } else {
      const books = await getAllBooks();
      return NextResponse.json(books);
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

// POST request handler for creating a new book.
export async function POST(request: Request) {
  try {
    const book = await request.json();
    const newBookId = await createBook(book);
    return NextResponse.json({ id: newBookId });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}

// PUT request handler for updating an existing book.
export async function PUT(request: Request) {
  try {
    const book = await request.json();
    await updateBook(book);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

// DELETE request handler for deleting a book.
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    try {
      await deleteBook(Number(id));
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting book:', error);
      return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }
}
