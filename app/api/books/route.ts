import { NextResponse } from 'next/server';
import * as db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const book = await db.getBookById(Number(id));
      return NextResponse.json(book);
    } else {
      const books = await db.getAllBooks();
      return NextResponse.json(books);
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const book = await request.json();
    const newBookId = await db.createBook(book);
    return NextResponse.json({ id: newBookId });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const book = await request.json();
    await db.updateBook(book);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    try {
      await db.deleteBook(Number(id));
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting book:', error);
      return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }
}