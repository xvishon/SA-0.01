import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaUser, FaMapMarkerAlt, FaCalendarAlt, FaCube, FaStickyNote, FaGlobe } from 'react-icons/fa';

interface CategoryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEntry: (entry: { category: string; title: string; content: string }) => void;
}

const CategoryPopup: React.FC<CategoryPopupProps> = ({ isOpen, onClose, onAddEntry }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Characters');

  const categories = [
    { name: 'Characters', icon: FaUser },
    { name: 'Locations', icon: FaMapMarkerAlt },
    { name: 'Events', icon: FaCalendarAlt },
    { name: 'Items', icon: FaCube },
    { name: 'Notes', icon: FaStickyNote },
    { name: 'World Building', icon: FaGlobe },
  ];

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
        <DialogFooter>
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button onClick={handleAddEntry}>
            Add Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryPopup;
