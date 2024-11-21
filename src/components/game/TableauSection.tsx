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
    }, 1000);
    return () => clearTimeout(timer);
  }, [tableau]);

  return (
    <div className="flex gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 xl:gap-4 w-full">
      {tableau.map((pile, i) => (
        <div 
          key={i} 
          className="relative flex-1 min-w-[40px] sm:min-w-[50px] md:min-w-[60px] lg:min-w-[80px] xl:min-w-[100px] h-[56px] sm:h-[70px] md:h-[84px] lg:h-[112px] xl:h-[140px] rounded-sm border-2 border-white/30 bg-felt-green/50"
          style={{
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
          }}
        >
          {pile.map((card, j) => {
            const animationDelay = `${0.1 + (i * 3 + j) * 0.05}s`;
            const shouldShow = !isDealing || (Date.now() > new Date().getTime() + parseFloat(animationDelay) * 1000);
            const verticalOffset = Math.min(j * (window.innerWidth < 640 ? 12 : window.innerWidth < 768 ? 16 : window.innerWidth < 1024 ? 20 : 24), 
              window.innerWidth < 640 ? 16 : window.innerWidth < 768 ? 20 : window.innerWidth < 1024 ? 24 : 28);
            
            return shouldShow ? (
              <div
                key={card.id}
                className="absolute transition-all animate-deal"
                style={{ 
                  top: `${verticalOffset}px`,
                  animationDelay,
                  animationFillMode: 'both',
                  zIndex: j + 1
                }}
              >
                <Card 
                  card={card}
                  index={j}
                  onDoubleClick={() => onCardDoubleClick(card)}
                  isHighlighted={highlightedCards.includes(card.id)}
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