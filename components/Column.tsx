import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import { ColumnType, CardType } from '../types/kanban';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
}

const Column: React.FC<ColumnProps> = ({ column, cards }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-72">
      <h2 className="font-bold mb-4">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="min-h-[100px]"
          >
            {cards.map((card, index) => (
              <Card key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;