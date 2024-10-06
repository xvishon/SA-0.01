import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { FaUser, FaMapMarkerAlt, FaCalendarAlt, FaCube, FaStickyNote, FaGlobe } from 'react-icons/fa';

interface CategoryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEntry: (entry: { category: string; title: string; content: string }) => void;
}

const categories = [
  { name: 'Characters', icon: FaUser },
  { name: 'Locations', icon: FaMapMarkerAlt },
  { name: 'Events', icon: FaCalendarAlt },
  { name: 'Items', icon: FaCube },
  { name: 'Notes', icon: FaStickyNote },
  { name: 'World Building', icon: FaGlobe },
];

const CategoryPopup: React.FC<CategoryPopupProps> = ({ isOpen, onClose, onAddEntry }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      onAddEntry({ category: selectedCategory, title, content });
      setSelectedCategory(null);
      setTitle('');
      setContent('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card p-6 rounded-lg shadow-xl w-full max-w-4xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add to Codex</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            {!selectedCategory ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className="h-32 flex flex-col items-center justify-center text-lg"
                  >
                    <category.icon className="h-8 w-8 mb-2" />
                    {category.name}
                  </Button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-semibold">{selectedCategory}</h3>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={5}
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setSelectedCategory(null)}>
                    Back
                  </Button>
                  <Button type="submit">Add Entry</Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryPopup;