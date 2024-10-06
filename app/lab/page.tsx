"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSettings } from '@/contexts/SettingsContext';
import KanbanBoard from '@/components/KanbanBoard';
import { KanbanData } from '@/types/kanban';

const initialKanbanData: KanbanData = {
  cards: {
    'card-1': { id: 'card-1', title: 'Experiment 1', content: 'Test new potion recipe' },
    'card-2': { id: 'card-2', title: 'Experiment 2', content: 'Analyze magical artifacts' },
    'card-3': { id: 'card-3', title: 'Experiment 3', content: 'Develop new spell' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Planned',
      cardIds: ['card-1', 'card-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      cardIds: ['card-3'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Completed',
      cardIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

export default function LabPage() {
  const { pageWidth } = useSettings();

  return (
    <div className={`container mx-auto p-4 ${pageWidth === 'narrow' ? 'max-w-2xl' : pageWidth === 'medium' ? 'max-w-4xl' : 'max-w-6xl'}`}>
      <h1 className="text-3xl font-bold mb-6">The Alchemist's Lab</h1>
      
      {/* Existing content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Experiment #1: Button Styles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="default">Default Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Experiment #2: Input Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input type="text" placeholder="Standard Input" />
            <Input type="password" placeholder="Password Input" />
            <Input type="number" placeholder="Number Input" />
            <Input type="date" />
          </CardContent>
        </Card>
      </div>
      
      {/* New Kanban board section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Experiment #3: Alchemical Project Board</h2>
        <p className="mb-6 text-muted-foreground">
          Use this Kanban board to organize and track your alchemical experiments and projects.
        </p>
        <KanbanBoard initialData={initialKanbanData} />
      </div>
    </div>
  );
}