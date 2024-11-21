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

  // Calculate the offset based on the number of cards
  const stockOffset = isMobile ? 3 : 1; // pixels per card
  const maxOffset = isMobile ? 30 : 15; // maximum total offset in pixels
  const totalOffset = Math.min(stock.length * stockOffset, maxOffset);

  return (
    <div className="flex gap-2 relative z-50">
      <div
        className="w-[2.8rem] h-[3.9rem] md:w-[7rem] md:h-[9.8rem] rounded-sm border-2 border-white/30 bg-felt-green/50 cursor-pointer relative"
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
              className="w-[2.8rem] h-[3.9rem] md:w-[7rem] md:h-[9.8rem] animate-stock-appear"
            />
          </div>
        ))}
      </div>
      <div 
        className="w-[2.8rem] h-[3.9rem] md:w-[7rem] md:h-[9.8rem] rounded-sm border-2 border-white/30 bg-felt-green/50"
        style={{
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
        }}
      >
        {waste.length > 0 && (
          <Card 
            card={waste[waste.length - 1]}
            onDoubleClick={() => onCardDoubleClick(waste[waste.length - 1])}
            isHighlighted={highlightedCards.includes(waste[waste.length - 1].id)}
            className="w-[2.8rem] h-[3.9rem] md:w-[7rem] md:h-[9.8rem]"
          />
        )}
      </div>
    </div>
  );
};

export default StockAndWaste;