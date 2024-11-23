import React, { useState, useEffect } from 'react';
import Card from './Card';
import { Card as CardType } from '../../utils/cards';

interface StockAndWasteProps {
  stock: CardType[];
  waste: CardType[];
  onDraw: () => void;
  onCardDoubleClick: (card: CardType) => void;
  highlightedCards: string[];
  animatingCard?: {
    card: CardType;
    targetPosition: { x: number; y: number };
  } | null;
}

const StockAndWaste: React.FC<StockAndWasteProps> = ({
  stock,
  waste,
  onDraw,
  onCardDoubleClick,
  highlightedCards,
  animatingCard
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDraw = () => {
    onDraw();
  };

  const handleCardClick = (card: CardType) => {
    onCardDoubleClick(card);
  };

  const stockOffset = isMobile ? 0.125 : 0.25;
  const maxOffset = isMobile ? 1.5 : 3;
  const totalOffset = Math.min(stock.length * stockOffset, maxOffset);

  return (
    <div className="flex gap-1 sm:gap-1.5 md:gap-2 relative z-50">
      <div
        className="w-[2.8rem] h-[3.9rem] sm:w-[4rem] sm:h-[5.6rem] md:w-[7rem] md:h-[9.8rem] rounded-sm border-2 border-white/30 bg-felt-green/50 cursor-pointer relative"
        style={{
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
        }}
        onClick={handleDraw}
      >
        {stock.map((card, index) => (
          <div
            key={card.id}
            className="absolute"
            style={{
              bottom: `${index * stockOffset}px`,
              right: `${index * stockOffset}px`,
              transform: `translate3d(0, 0, ${index}px)`,
              boxShadow: '1px 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            <Card 
              card={card}
              onDoubleClick={() => onCardDoubleClick(card)}
              isHighlighted={highlightedCards.includes(card.id)}
              className="w-[2.8rem] h-[3.9rem] sm:w-[4rem] sm:h-[5.6rem] md:w-[7rem] md:h-[9.8rem]"
            />
          </div>
        ))}
      </div>
      <div 
        className="w-[2.8rem] h-[3.9rem] sm:w-[4rem] sm:h-[5.6rem] md:w-[7rem] md:h-[9.8rem] rounded-sm border-2 border-white/30 bg-felt-green/50 relative"
        style={{
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
        }}
      >
        {waste.length > 1 && (
          <div className="absolute inset-0">
            <Card 
              card={waste[waste.length - 2]}
              isHighlighted={highlightedCards.includes(waste[waste.length - 2].id)}
              className="w-[2.8rem] h-[3.9rem] sm:w-[4rem] sm:h-[5.6rem] md:w-[7rem] md:h-[9.8rem]"
            />
          </div>
        )}
        {waste.length > 0 && (
          <div className="absolute inset-0">
            <Card 
              card={waste[waste.length - 1]}
              onClick={() => handleCardClick(waste[waste.length - 1])}
              isHighlighted={highlightedCards.includes(waste[waste.length - 1].id)}
              className="w-[2.8rem] h-[3.9rem] sm:w-[4rem] sm:h-[5.6rem] md:w-[7rem] md:h-[9.8rem]"
              isAnimating={animatingCard?.card.id === waste[waste.length - 1].id}
              animateToPosition={animatingCard?.card.id === waste[waste.length - 1].id ? animatingCard.targetPosition : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StockAndWaste;