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
        <div 
          key={i} 
          className="relative min-h-[8rem] w-[2.8rem] md:w-[7rem] rounded-sm border-2 border-white/30 bg-felt-green/50"
          style={{
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
          }}
        >
          {pile.map((card, j) => (
            <div
              key={card.id}
              className="absolute transition-all animate-deal"
              style={{ 
                top: `${j * (window.innerWidth >= 768 ? 32 : 12)}px`,
                animationDelay: `${(i + j) * 0.015}s`,
                animationFillMode: 'both'
              }}
            >
              <Card 
                card={card}
                index={j}
                onDoubleClick={() => onCardDoubleClick(card)}
                isHighlighted={highlightedCards.includes(card.id)}
                className="w-[2.8rem] md:w-[7rem] h-[3.9rem] md:h-[9.8rem]"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableauSection;