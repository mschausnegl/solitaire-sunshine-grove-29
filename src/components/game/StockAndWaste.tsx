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
  const stockHeight = Math.min(stock.length * (isMobile ? 0.01 : 0.025), isMobile ? 0.3 : 0.5);
  const stockWidth = Math.min(stock.length * (isMobile ? 0.05 : 0.15), isMobile ? 2 : 6);

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
              bottom: `${index * (isMobile ? 0.05 : 0.15)}px`,
              right: `${index * (isMobile ? 0.05 : 0.15)}px`,
              transform: `translate3d(${stockWidth - (index * (isMobile ? 0.05 : 0.15))}px, ${stockHeight - (index * (isMobile ? 0.05 : 0.15))}px, ${index}px)`,
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