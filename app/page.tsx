"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import DocumentCard from '@/components/DocumentCard';
import NewBookDialog from '@/components/NewBookDialog';
import { Grid, List, BookPlus, Search, ArrowUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBookContext } from '@/contexts/BookContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '@/contexts/SettingsContext';

export default function LibraryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();
  const { books, setCurrentBook, deleteBook, isLoading, error } = useBookContext();
  const { pageWidth } = useSettings();

  const [filteredBooks, setFilteredBooks] = useState(books);

  useEffect(() => {
    const filtered = books.filter(book => 
      (book.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (book.author?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    );

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'title') {
        comparison = (a.title || '').localeCompare(b.title || '');
      } else if (sortBy === 'author') {
        comparison = (a.author || '').localeCompare(b.author || '');
      } else if (sortBy === 'updated') {
        comparison = (new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredBooks(sorted);
  }, [books, searchTerm, sortBy, sortOrder]);

  const handleDeleteBook = async (id: number) => {
    await deleteBook(id);
  };

  const handleOpen = (book: any) => {
    setCurrentBook(book);
    router.push(`/edit/${book.id}`);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className={`container mx-auto p-4 ${pageWidth === 'narrow' ? 'max-w-2xl' : pageWidth === 'medium' ? 'max-w-4xl' : 'max-w-6xl'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Document Library</h1>
        <NewBookDialog />
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Search className="text-gray-400" />
        </div>
        <div className="flex items-center space-x-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="updated">Last Updated</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortOrder}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {filteredBooks.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-xl mb-4">Your library is empty. Add some books to get started!</p>
          <NewBookDialog />
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {filteredBooks.map((book) => (
            <DocumentCard
              key={book.id}
              document={book}
              viewMode={viewMode}
              onDelete={() => handleDeleteBook(book.id!)}
              onOpen={() => handleOpen(book)}
            />
          ))}
        </div>
      )}
    </div>
  );
}