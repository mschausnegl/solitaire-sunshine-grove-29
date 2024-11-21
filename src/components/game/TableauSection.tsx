import React from 'react';
import Card from './Card';
import { Card as CardType } from '../../utils/cards';

interface TableauSectionProps {
  tableau: CardType[][];
  onCardDoubleClick: (card: CardType) => void;
  highlightedCards: string[];
}

const TableauSection: React.FC<TableauSectionProps> = ({ 
  tableau, 
  onCardDoubleClick, 
  highlightedCards 
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-4 w-full">
      {tableau.map((pile, i) => (
        <div key={i} className="relative w-16 sm:w-24 min-h-[9rem] sm:min-h-[12rem]">
          {pile.map((card, j) => (
            <div
              key={card.id}
              className="absolute"
              style={{ top: `${j * 20}px` }}
            >
              <Card 
                card={card}
                index={j}
                onDoubleClick={() => onCardDoubleClick(card)}
                isHighlighted={highlightedCards.includes(card.id)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableauSection;