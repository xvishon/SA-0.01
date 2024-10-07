'use client';

import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext'; // Ensure this exists
import CodexSidebar from '@/components/CodexSidebar'; // Ensure this exists
import CategoryPopup from '@/components/CategoryPopup'; // Ensure this exists
import { v4 as uuidv4 } from 'uuid'; // Use uuid for generating unique IDs
// import { 

interface CodexEntry {
  id: string;
  category: string;
  title: string;
  content: string;
  description: string;
  name: string;
}

const TestPage: React.FC = () => {
  const { pageWidth } = useSettings();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Control for isOpen in sidebar
  const [codexEntries, setCodexEntries] = useState<CodexEntry[]>([
    {
      id: '1', 
      category: 'Characters',
      title: '',
      name: 'John Doe', 
      content: 'A mysterious character',
      description: 'very plain'
    },
    {
      id: '2', 
      category: 'Locations',
      title: '',
      name: 'Mystic Forest', 
      content: 'A magical place',
      description: 'Its a big woods'
    },
  ]);

  const handleAddEntry = (entry: Omit<CodexEntry, 'id'>) => {
    const newEntry = { ...entry, id: uuidv4() }; // Generate unique ID for the new entry
    setCodexEntries([...codexEntries, newEntry]);
    setIsPopupOpen(false);
  };

  const handleCloseSidebar = () => setIsSidebarOpen(false); // Close sidebar

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
      <h1 className="text-3xl font-bold mb-6">Codex Testing Ground</h1>
      <div className="flex">
          <div className="flex-grow ml-4">
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-2">Main Content Area</h2>
            <ul>
              <li>Make database save data and fetch from markdown files saved locally.</li>
              <li>Implement Codex features:
                <ul>
                  <li>Search functionality</li>
                  <li>Filtering by category</li>
                  <li>Sorting options (alphabetical, date created, etc.)</li>
                </ul>
              </li>
              <li>Integrate TipTap editor for rich text editing experience within codex entries.</li>
              <li>Develop an interface for editing and managing the database content.</li>
              <li>Implement a "Shelves" feature to allow users to organize entries into custom collections.</li>
              <li>Improve UI/UX:
                <ul>
                  <li>Implement drag-and-drop functionality for reordering entries.</li>
                  <li>Enhance the visual design and layout of the Codex.</li>
                  <li>Add loading states and error handling for a smoother user experience.</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      /
    </div>
  );
};

export default TestPage;
