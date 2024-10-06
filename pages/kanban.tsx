import React from 'react';
import KanbanBoard from '../components/KanbanBoard';
import { KanbanData } from '../types/kanban';

const initialData: KanbanData = {
  cards: {
    'card-1': { id: 'card-1', title: 'Task 1', content: 'Do something' },
    'card-2': { id: 'card-2', title: 'Task 2', content: 'Do something else' },
    'card-3': { id: 'card-3', title: 'Task 3', content: 'Do another thing' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      cardIds: ['card-1', 'card-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      cardIds: ['card-3'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      cardIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const KanbanPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Kanban Board</h1>
      <KanbanBoard initialData={initialData} />
    </div>
  );
};

export default KanbanPage;