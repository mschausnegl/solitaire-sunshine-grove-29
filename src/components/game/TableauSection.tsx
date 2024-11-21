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
    <div className="flex gap-0.5 md:gap-2">
      {tableau.map((pile, i) => (
        <div key={i} className="relative min-h-[8rem] w-[2.8rem] md:w-[11rem]">
          {pile.map((card, j) => (
            <div
              key={card.id}
              className="absolute transition-all"
              style={{ top: `${j * (window.innerWidth >= 768 ? 64 : 12)}px` }}
            >
              <Card 
                card={card}
                index={j}
                onDoubleClick={() => onCardDoubleClick(card)}
                isHighlighted={highlightedCards.includes(card.id)}
                className="w-[2.8rem] md:w-[11rem] h-[3.9rem] md:h-[15.4rem]"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableauSection;