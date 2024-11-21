import React, { useState, useEffect } from 'react';
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
  isNewGame = false
}) => {
  const [isDealing, setIsDealing] = useState(false);

  useEffect(() => {
    if (isNewGame) {
      setIsDealing(true);
      const timer = setTimeout(() => {
        setIsDealing(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isNewGame]);

  return (
    <div className="flex gap-0.5 md:gap-2 w-full">
      {tableau.map((pile, i) => (
        <div 
          key={i} 
          className="relative flex-1 md:flex-initial w-[2.8rem] md:w-[7rem] h-[3.9rem] md:h-[9.8rem] rounded-sm border-2 border-white/30 bg-felt-green/50"
          style={{
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
          }}
        >
          {pile.map((card, j) => {
            const animationDelay = `${0.1 + (i * 3 + j) * 0.05}s`;
            const shouldShow = !isDealing || (Date.now() > new Date().getTime() + parseFloat(animationDelay) * 1000);
            
            return shouldShow ? (
              <div
                key={card.id}
                className={`absolute transition-all ${isNewGame ? 'animate-deal' : ''}`}
                style={{ 
                  top: `${j * (window.innerWidth >= 768 ? 16 : 6)}px`,
                  animationDelay: isNewGame ? animationDelay : undefined,
                  animationFillMode: 'both',
                  zIndex: j + 1
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
            ) : null;
          })}
        </div>
      ))}
    </div>
  );
};

export default TableauSection;