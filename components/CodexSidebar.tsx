import React, { useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronLeft, ChevronRight, Search, X, Plus, ArrowLeftRight, Filter } from 'lucide-react';
import { FaUser, FaMapMarkerAlt, FaCalendarAlt, FaCube, FaStickyNote, FaGlobe } from 'react-icons/fa';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CategoryPopup from './CategoryPopup';
import { CodexSidebarProps } from '@/types/types';
import { debounce } from 'lodash';

const CodexSidebar: React.FC<CodexSidebarProps> = ({ isOpen, onClose, bookId, entries = [], onAddEntry }) => {
  const [position, setPosition] = useState<'left' | 'right'>('right');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const debouncedSearchTerm = useMemo(() => debounce(setSearchTerm, 300), []);

  const categories = [
    { name: 'Characters', icon: FaUser },
    { name: 'Locations', icon: FaMapMarkerAlt },
    { name: 'Events', icon: FaCalendarAlt },
    { name: 'Items', icon: FaCube },
    { name: 'Notes', icon: FaStickyNote },
    { name: 'World Building', icon: FaGlobe },
  ];

  const togglePosition = () => {
    setPosition(position === 'left' ? 'right' : 'left');
  };

  const filteredEntries = entries.filter(entry =>
    (entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === 'all' || entry.category === selectedCategory)
  );

  const handleAddEntry = (entry: { category: string; title: string; content: string }) => {
    onAddEntry({
      category: entry.category,
      title: entry.title,
      content: entry.content,
      name: entry.title, // Providing name
      description: entry.content.substring(0, 50), // Providing description as first 50 characters of content
    });
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      {/* Sidebar UI */}
      <motion.div
        ref={sidebarRef}
        initial={{ x: position === 'right' ? '100%' : '-100%' }}
        animate={{ x: isOpen ? 0 : (position === 'right' ? '100%' : '-100%') }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 ${position}-0 w-80 h-full bg-gray-900 text-white overflow-y-auto z-50`}
        style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Codex</h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={togglePosition}>
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => debouncedSearchTerm(e.target.value)} // Use debounced function
              className="flex-grow"
            />
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-200">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {categories.map((category) => (
              <AccordionItem key={category.name} value={category.name}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-2">
                    <category.icon className="h-4 w-4" />
                    <span>{category.name}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {filteredEntries
                    .filter(entry => entry.category === category.name)
                    .map(entry => (
                      <div key={entry.id} className="py-2">
                        <h3 className="font-semibold">{entry.title}</h3>
                        <p className="text-sm text-gray-400">{entry.content.substring(0, 50)}...</p>
                      </div>
                    ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button onClick={() => setIsPopupOpen(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Entry
          </Button>
        </div>
      </motion.div>

      {/* Animate the Sidebar Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed ${position}-0 top-1/2 transform -translate-y-1/2 z-50`}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className={`${position === 'left' ? 'rounded-r' : 'rounded-l'}`}
            >
              {position === 'left' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Popup */}
      <CategoryPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup} // Pass the actual close handler
        onAddEntry={handleAddEntry} // Passing the correct handle function
      />
    </>
  );
};

export default CodexSidebar;
