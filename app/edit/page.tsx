"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TextEditor from '@/components/TextEditor';

export default function EditPage() {
  const [title, setTitle] = useState('Untitled Document');
  const [content, setContent] = useState('');

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving document:', { title, content });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold w-1/2"
        />
        <Button onClick={handleSave}>Save</Button>
      </div>
      <TextEditor content={content} setContent={setContent} />
    </div>
  );
}