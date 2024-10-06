"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookContext } from '@/contexts/BookContext';
import { useSettings } from '@/contexts/SettingsContext';

export default function NewBookPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const router = useRouter();
  const { addBook } = useBookContext();
  const { pageWidth } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBook = await addBook({ title, author, coverUrl, content: '' });
    router.push(`/edit/${newBook.id}`);
  };

  return (
    <div className={`container mx-auto px-4 ${pageWidth === 'narrow' ? 'max-w-2xl' : pageWidth === 'medium' ? 'max-w-4xl' : 'max-w-6xl'}`}>
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Create New Book</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="coverUrl">Cover Image URL</Label>
                <Input
                  id="coverUrl"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://example.com/book-cover.jpg"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSubmit}>Create Book</Button>
        </CardFooter>
      </Card>
    </div>
  );
}