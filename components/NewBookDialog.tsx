'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Ensure this exists
import { Input } from '@/components/ui/input'; // Ensure this exists
import { Label } from '@/components/ui/label'; // Ensure this exists
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'; // Ensure this exists
import { useBookContext } from '@/contexts/BookContext'; // Ensure this exists

const NewBookDialog: React.FC = () => {
  const [title, setTitle] = useState<string>(''); // Track new book title
  const [author, setAuthor] = useState<string>(''); // Track author name
  const [coverUrl, setCoverUrl] = useState<string>(''); // Track cover URL
  const [open, setOpen] = useState<boolean>(false); // Manage dialog open state
  const [loading, setLoading] = useState<boolean>(false); // Loading state for book creation
  const [error, setError] = useState<string | null>(null); // Track any errors
  const { addBook } = useBookContext(); // Access the book context to add a new book

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading to true during submission
    setError(null); // Clear any existing errors

    try {
      await addBook({ title, author, coverUrl, content: '' }); // Add book to the context
      setTitle(''); // Clear form fields
      setAuthor('');
      setCoverUrl('');
      setOpen(false); // Close dialog after successful submission
    } catch (err) {
      setError('Failed to add the book. Please try again.'); // Handle errors
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Book</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Enter the details of the new book you want to add to your library.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author" className="text-right">
                Author
              </Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coverUrl" className="text-right">
                Cover URL
              </Label>
              <Input
                id="coverUrl"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com/book-cover.jpg"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Book'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewBookDialog;
