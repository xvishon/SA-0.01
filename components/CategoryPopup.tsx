import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem } from '@/components/ui/select';
import { X } from 'lucide-react';
import { FaUser, FaMapMarkerAlt, FaCalendarAlt, FaCube, FaStickyNote, FaGlobe, FaLightbulb, FaBook } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import { SelectTrigger, SelectValue, SelectContent, } from '@/components/ui/select';

interface CategoryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEntry: (entry: { category: string; data: any }) => void;
}

const categories = [
  { name: 'Characters', icon: FaUser },
  { name: 'Locations', icon: FaMapMarkerAlt },
  { name: 'Events', icon: FaCalendarAlt },
  { name: 'Items', icon: FaCube },
  { name: 'Notes', icon: FaStickyNote },
  { name: 'World Building', icon: FaGlobe },
  { name: 'Concepts', icon: FaLightbulb },
  { name: 'References', icon: FaBook },
  { name: 'Custom', icon: MdAdd },
];

const CategoryPopup: React.FC<CategoryPopupProps> = ({ isOpen, onClose, onAddEntry }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [data, setData] = useState<any>({ type: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      onAddEntry({ category: selectedCategory, data });
      setSelectedCategory(null);
      setData({ type: '' });
    }
  };

  const renderFormFields = () => {
    switch (selectedCategory) {
      case 'Characters':
        return (
          <>
                        <Select value={data.characterRole} onValueChange={(value) => setData({ ...data, characterRole: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a character role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="protagonist">Protagonist</SelectItem>
                <SelectItem value="antagonist">Antagonist</SelectItem>
                <SelectItem value="supporting">Supporting</SelectItem>
                <SelectItem value="minor">Minor Character</SelectItem>
                <SelectItem value="loveInterest">Love Interest</SelectItem>
                {/* Add more options for character role */}
              </SelectContent>
            </Select>
            <Input placeholder="Name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
            <Input placeholder="Pronouns" value={data.pronouns} onChange={(e) => setData({ ...data, pronouns: e.target.value })} />
            <Input placeholder="Aliases/Other Names" value={data.aliases} onChange={(e) => setData({ ...data, aliases: e.target.value })} />
            <Textarea placeholder="Groups" value={data.groups} onChange={(e) => setData({ ...data, personality: e.target.value })} />
            <Textarea placeholder="Personality" value={data.personality} onChange={(e) => setData({ ...data, personality: e.target.value })} />
            <Textarea placeholder="Background" value={data.background} onChange={(e) => setData({ ...data, background: e.target.value })} />
            <Textarea placeholder="Physical Description" value={data.physicalDescription} onChange={(e) => setData({ ...data, physicalDescription: e.target.value })} />
            <Textarea placeholder="Dialogue Style" value={data.dialogueStyle} onChange={(e) => setData({ ...data, dialogueStyle: e.target.value })} />
            {/* Add image upload button */}
          </>
        );
      case 'Locations':
        return (
          <>
            <Input placeholder="Name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
            <Input placeholder="Region/Continent" value={data.region} onChange={(e) => setData({ ...data, region: e.target.value })} />
            <Textarea placeholder="Landmarks" value={data.landmarks} onChange={(e) => setData({ ...data, landmarks: e.target.value })} />
            <Textarea placeholder="Geography/Climate" value={data.geography} onChange={(e) => setData({ ...data, geography: e.target.value })} />
            <Input placeholder="Population" value={data.population} onChange={(e) => setData({ ...data, population: e.target.value })} />
            <Textarea placeholder="Culture" value={data.culture} onChange={(e) => setData({ ...data, culture: e.target.value })} />
            <Textarea placeholder="Economy" value={data.economy} onChange={(e) => setData({ ...data, economy: e.target.value })} />
            <Input placeholder="Government/Leadership" value={data.government} onChange={(e) => setData({ ...data, government: e.target.value })} />
          </>
        );
      case 'Events':
        return (
          <>
            <Input placeholder="Name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
            <Input placeholder="Date/Time Period" value={data.date} onChange={(e) => setData({ ...data, date: e.target.value })} />
            <Input placeholder="Participants" value={data.participants} onChange={(e) => setData({ ...data, participants: e.target.value })} />
            <Textarea placeholder="Description" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
            <Textarea placeholder="Consequences" value={data.consequences} onChange={(e) => setData({ ...data, consequences: e.target.value })} />
            <Textarea placeholder="Significance" value={data.significance} onChange={(e) => setData({ ...data, significance: e.target.value })} />
          </>
        );
        case 'Items':
          return (
            <>
              <Input placeholder="Name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
              <Select value={data.type} onValueChange={(value) => setData({ ...data, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weapon">Weapon</SelectItem>
                  <SelectItem value="artifact">Artifact</SelectItem>
                  {/* Add more options for Items */}
                </SelectContent>
              </Select>
              <Textarea placeholder="Description" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
              <Textarea placeholder="Materials" value={data.materials} onChange={(e) => setData({ ...data, materials: e.target.value })} />
              <Textarea placeholder="Origin" value={data.origin} onChange={(e) => setData({ ...data, origin: e.target.value })} />
              <Textarea placeholder="Powers/Properties" value={data.powers} onChange={(e) => setData({ ...data, powers: e.target.value })} />
              <Input placeholder="Rarity" value={data.rarity} onChange={(e) => setData({ ...data, rarity: e.target.value })} />
            </>
          );
      case 'Notes':
        return (
          <>
            <Input placeholder="Title" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
            <Textarea placeholder="Content" value={data.content} onChange={(e) => setData({ ...data, content: e.target.value })} />
          </>
        );
      case 'World Building':
        return (
          <>
            <Input placeholder="Name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
            <Textarea placeholder="Description" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
            <Textarea placeholder="History" value={data.history} onChange={(e) => setData({ ...data, history: e.target.value })} />
            <Textarea placeholder="Culture" value={data.culture} onChange={(e) => setData({ ...data, culture: e.target.value })} />
            <Textarea placeholder="Religion" value={data.religion} onChange={(e) => setData({ ...data, religion: e.target.value })} />
            <Textarea placeholder="Technology" value={data.technology} onChange={(e) => setData({ ...data, technology: e.target.value })} />
            <Textarea placeholder="Magic System" value={data.magicSystem} onChange={(e) => setData({ ...data, magicSystem: e.target.value })} />
          </>
        );
      case 'Concepts':
        return (
          <>
            <Input placeholder="Name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
            <Textarea placeholder="Description" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
            <Textarea placeholder="Examples" value={data.examples} onChange={(e) => setData({ ...data, examples: e.target.value })} />
          </>
        );
      case 'References':
        return (
          <>
            <Input placeholder="Title" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
            <Input placeholder="Author" value={data.author} onChange={(e) => setData({ ...data, author: e.target.value })} />
            <Input placeholder="Publication Date" value={data.publicationDate} onChange={(e) => setData({ ...data, publicationDate: e.target.value })} />
            <Textarea placeholder="Summary" value={data.summary} onChange={(e) => setData({ ...data, summary: e.target.value })} />
            <Input placeholder="Link" value={data.link} onChange={(e) => setData({ ...data, link: e.target.value })} />
          </>
        );
      case 'Custom':
        return (
          <>
            {/* Add custom fields here */}
          </>
        );
      default:
        return null;
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
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{selectedCategory}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {renderFormFields()}
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setSelectedCategory(null)}>
                      Back
                    </Button>
                    <Button type="submit">Add Entry</Button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryPopup;
