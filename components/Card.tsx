import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { CardType } from '../types/kanban';

interface CardProps {
  card: CardType;
  index: number;
}

const Card: React.FC<CardProps> = ({ card, index }) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 mb-2 rounded shadow"
        >
          <h3 className="font-semibold mb-2">{card.title}</h3>
          <p className="text-sm text-gray-600">{card.content}</p>
        </div>
      )}
    </Draggable>
  );
};

export default Card;