import React, { useState, useEffect } from 'react';
import Card from './Card';
import { Card as CardType } from '../../utils/cards';

interface StockAndWasteProps {
  stock: CardType[];
  waste: CardType[];
  onDraw: () => void;
  onCardDoubleClick: (card: CardType) => void;
  highlightedCards: string[];
}

const StockAndWaste: React.FC<StockAndWasteProps> = ({
  stock,
  waste,
  onDraw,
  onCardDoubleClick,
  highlightedCards
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stockOffset = isMobile ? 0.125 : 0.25;
  const maxOffset = isMobile ? 1 : 2;
  const totalOffset = Math.min(stock.length * stockOffset, maxOffset);

  const baseCardClasses = "w-[45px] h-[63px] sm:w-[50px] sm:h-[70px] md:w-[60px] md:h-[84px] lg:w-[70px] lg:h-[98px] xl:w-[80px] xl:h-[112px]";

  return (
    <div className="flex gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3 relative z-50">
      <div
        className={`${baseCardClasses} rounded-sm border-2 border-white/30 bg-felt-green/50 cursor-pointer relative`}
        style={{
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
        }}
        onClick={onDraw}
      >
        {stock.map((card, index) => (
          <div
            key={card.id}
            className="absolute"
            style={{
              bottom: `${index * stockOffset}px`,
              right: `${index * stockOffset}px`,
              transform: `translate3d(0, 0, ${index}px)`,
              transition: 'all 0.3s ease-out',
              boxShadow: '1px 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            <Card 
              card={card}
              onDoubleClick={() => onCardDoubleClick(card)}
              isHighlighted={highlightedCards.includes(card.id)}
              className={`${baseCardClasses} animate-stock-appear`}
            />
          </div>
        ))}
      </div>
      <div 
        className={`${baseCardClasses} rounded-sm border-2 border-white/30 bg-felt-green/50`}
        style={{
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
        }}
      >
        {waste.length > 0 && (
          <Card 
            card={waste[waste.length - 1]}
            onDoubleClick={() => onCardDoubleClick(waste[waste.length - 1])}
            isHighlighted={highlightedCards.includes(waste[waste.length - 1].id)}
            className={baseCardClasses}
          />
        )}
      </div>
    </div>
  );
};

export default StockAndWaste;