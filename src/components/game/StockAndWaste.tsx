import React from 'react';
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
  // Calculate the offset based on the number of cards
  const stockHeight = Math.min(stock.length * 0.035, 1); // Medium height multiplier and max height
  const stockWidth = Math.min(stock.length * 0.15, 6); // Medium width multiplier and max width

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
              bottom: `${index * 0.15}px`, // Medium vertical spacing
              right: `${index * 0.15}px`, // Medium horizontal spacing
              transform: `translate3d(${stockWidth - (index * 0.15)}px, ${stockHeight - (index * 0.15)}px, ${index}px)`,
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