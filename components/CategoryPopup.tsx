import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
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
  { name: 'World Building', icon: FaGlobe },
  { name: 'Notes', icon: FaStickyNote },
  { name: 'Concepts', icon: FaCube },
  { name: 'References', icon: FaStickyNote },
  { name: 'Custom', icon: FaGlobe },
];

const CategoryPopup: React.FC<CategoryPopupProps> = ({ isOpen, onClose, onAddEntry }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Characters');
  const [showForm, setShowForm] = useState(false);

  const handleAddEntry = () => {
    if (title.trim() && content.trim()) {
      onAddEntry({
        category: selectedCategory,
        title,
        content,
      });
      setTitle('');
      setContent('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="bg-white rounded-lg p-8 max-w-4xl w-full"
        >
          <DialogHeader>
            <DialogTitle>{showForm ? `Add New ${selectedCategory} Entry` : 'Select a Category'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {!showForm && categories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSelectedCategory(category.name); setShowForm(true); }}
                className="bg-gray-200 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer"
              >
                <category.icon className="h-12 w-12 mb-2" />
                <span className="font-bold">{category.name}</span>
              </motion.div>
            ))}
          </div>
          {showForm && (
            <div className="space-y-4 mt-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full"
              />
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                className="w-full"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      <category.icon className="h-4 w-4 mr-2" />
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button onClick={() => setShowForm(false)} variant="ghost">
              {showForm ? 'Back to Categories' : 'Cancel'}
            </Button>
            {showForm && (
              <Button onClick={handleAddEntry}>
                Add Entry
              </Button>
            )}
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryPopup;
