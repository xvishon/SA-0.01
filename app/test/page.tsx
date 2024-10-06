"use client"

import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import CodexSidebar from '@/components/CodexSidebar';
import CategoryPopup from '@/components/CategoryPopup';
import { v4 as uuidv4 } from 'uuid';

interface CodexEntry {
  id: string;
  category: string;
  title: string;
  content: string;
}

export default function TestPage() {
  const { pageWidth } = useSettings();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [codexEntries, setCodexEntries] = useState<CodexEntry[]>([
    { id: '1', category: 'Characters', title: 'John Doe', content: 'A mysterious character' },
    { id: '2', category: 'Locations', title: 'Mystic Forest', content: 'A magical place' },
  ]);

  const handleAddEntry = (entry: Omit<CodexEntry, 'id'>) => {
    const newEntry = { ...entry, id: uuidv4() };
    setCodexEntries([...codexEntries, newEntry]);
    setIsPopupOpen(false);
  };

  return (
    <div className={`container mx-auto p-4 ${pageWidth === 'narrow' ? 'max-w-2xl' : pageWidth === 'medium' ? 'max-w-4xl' : 'max-w-6xl'}`}>
      <h1 className="text-3xl font-bold mb-6">Codex Testing Ground</h1>
      <div className="flex">
        <CodexSidebar bookId="test-book" entries={codexEntries} onAddEntry={() => setIsPopupOpen(true)} />
        <div className="flex-grow ml-4">
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-2">Main Content Area</h2>
            <p>To do: 1. Make database save data and fetch from markdown files saved local.
                      2. Codex features 
                      3. TipTap
                      4. Edit Database
                      5. Shelves
                      6. 

            </p>
          </div>
        </div>
      </div>
      <CategoryPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} onAddEntry={handleAddEntry} />
    </div>
  );
}