"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DocumentCard from '@/components/DocumentCard';

// Mock data for documents
const mockDocuments = [
  { id: 1, title: 'Document 1', updatedAt: new Date() },
  { id: 2, title: 'Document 2', updatedAt: new Date() },
  { id: 3, title: 'Document 3', updatedAt: new Date() },
];

export default function LibraryPage() {
  const [documents, setDocuments] = useState(mockDocuments);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Document Library</h1>
        <Button asChild>
          <Link href="/edit">New Document</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  );
}