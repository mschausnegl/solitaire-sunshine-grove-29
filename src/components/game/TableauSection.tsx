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
    <div className="grid grid-cols-7 gap-2">
      {tableau.map((pile, i) => (
        <div key={i} className="relative min-h-[4rem]">
          {pile.map((card, j) => (
            <div
              key={card.id}
              className="absolute"
              style={{ top: `${j * 22}px` }}
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