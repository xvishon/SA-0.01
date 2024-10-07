"use client";

import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import CodexSidebar from '@/components/CodexSidebar';
import CategoryPopup from '@/components/CategoryPopup';
import { v4 as uuidv4 } from 'uuid';
import { CodexEntry } from '@/types/types';

export default function TestPage() {
  const { pageWidth } = useSettings();
  
  // Define codexEntries state to manage entries
  const [codexEntries, setCodexEntries] = useState<CodexEntry[]>([
    { id: '1', category: 'Notes', title: 'First Entry', content: 'This is the content.', name: 'First Name', description: 'First description' },
    { id: '2', category: 'Items', title: 'Second Entry', content: 'Another content.', name: 'Second Name', description: 'Second description' }
  ]);
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Update the handleAddEntry function to accept the proper entry type
  const handleAddEntry = (entry: { category: string; title: string; content: string }) => {
    const newEntry: CodexEntry = { 
      ...entry, 
      id: uuidv4(), 
      name: entry.title,  // Adding default values for name and description
      description: 'A new codex entry' 
    };
    setCodexEntries([...codexEntries, newEntry]);
    setIsPopupOpen(false);
  };

  return (
    <div className={`container mx-auto p-4 ${pageWidth === 'narrow' ? 'max-w-2xl' : pageWidth === 'medium' ? 'max-w-4xl' : 'max-w-6xl'}`}>
      <h1 className="text-3xl font-bold mb-6">Codex Testing Ground</h1>
      <div className="flex">
        <CodexSidebar 
          bookId="test-book" 
          entries={codexEntries} 
          onAddEntry={() => setIsPopupOpen(true)} 
        />
        <div className="flex-grow ml-4">
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-2">Main Content Area</h2>
            <p>This is where the main content of your book would be displayed.</p>
          </div>
        </div>
      </div>
      <CategoryPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        onAddEntry={handleAddEntry} 
      />
    </div>
  );
}
