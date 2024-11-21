import React, { useState, useEffect } from 'react';
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
  const [isDealing, setIsDealing] = useState(true);

  useEffect(() => {
    setIsDealing(true);
    const timer = setTimeout(() => {
      setIsDealing(false);
    }, 1000); // Reduced from 2000ms to 1000ms
    return () => clearTimeout(timer);
  }, [tableau]);

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
          {pile.map((card, j) => {
            const animationDelay = `${0.1 + (i * 3 + j) * 0.05}s`; // Reduced initial delay and interval between cards
            const shouldShow = !isDealing || (Date.now() > new Date().getTime() + parseFloat(animationDelay) * 1000);
            
            return shouldShow ? (
              <div
                key={card.id}
                className="absolute transition-all animate-deal"
                style={{ 
                  top: `${j * (window.innerWidth >= 768 ? 32 : 12)}px`,
                  animationDelay,
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
            ) : null;
          })}
        </div>
      ))}
    </div>
  );
};

export default TableauSection;