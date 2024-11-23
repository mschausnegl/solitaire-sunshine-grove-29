import React from 'react';
import Card from './Card';
import { Card as CardType } from '../../utils/cards';

interface TableauSectionProps {
  tableau: CardType[][];
  onCardDoubleClick: (card: CardType) => void;
  highlightedCards: string[];
  isNewGame?: boolean;
}

const TableauSection: React.FC<TableauSectionProps> = ({ 
  tableau, 
  onCardDoubleClick, 
  highlightedCards,
}) => {
  const getFaceDownOffset = () => window.innerWidth >= 768 ? 24 : 8;
  const getFaceUpOffset = () => window.innerWidth >= 768 ? 32 : 12;

  return (
    <div className="grid grid-cols-7 gap-1 w-full">
      {tableau.map((pile, i) => (
        <div 
          key={i} 
          className="relative aspect-[5/7] rounded-sm border-2 border-white/30 bg-felt-green/50"
          style={{
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
          }}
        >
          {pile.map((card, j) => {
            let offset = 0;
            for (let k = 0; k < j; k++) {
              offset += pile[k].faceUp ? getFaceUpOffset() : getFaceDownOffset();
            }

            return (
              <div
                key={card.id}
                className="absolute left-0"
                style={{ 
                  top: `${offset}px`,
                  zIndex: j + 1
                }}
              >
                <Card 
                  card={card}
                  index={j}
                  onClick={() => onCardDoubleClick(card)}
                  isHighlighted={highlightedCards.includes(card.id)}
                  pile={pile}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default TableauSection;