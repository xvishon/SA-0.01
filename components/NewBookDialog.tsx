"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBookContext } from '@/contexts/BookContext';

export default function NewBookDialog() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [open, setOpen] = useState(false);
  const { addBook } = useBookContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addBook({ title, author, coverUrl, content: '' });
    setTitle('');
    setAuthor('');
    setCoverUrl('');
    setOpen(false);
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
          <DialogFooter>
            <Button type="submit">Add Book</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}