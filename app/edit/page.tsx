'use client';

import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext'; // Ensure SettingsContext exists
import TextEditor from '@/components/TextEditor'; // Ensure TextEditor exists

const EditPage: React.FC = () => {
  const { pageWidth } = useSettings(); // Fetch settings like page width from the context
  const [content, setContent] = useState<string>(''); // Track editor content in state

  const handleContentChange = (newContent: string) => {
    setContent(newContent); // Update state when content changes
  };

  return (
    <div
      className={`container mx-auto p-4 ${
        pageWidth === 'narrow'
          ? 'max-w-2xl'
          : pageWidth === 'medium'
          ? 'max-w-4xl'
          : 'max-w-6xl'
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Edit Book</h1>
      <TextEditor
        bookId={1} // Dummy book ID (adjust as needed)
        initialContent={content} // Initial content for the editor
        onContentChange={handleContentChange} // Callback for content change
      />
    </div>
  );
};

export default EditPage;
