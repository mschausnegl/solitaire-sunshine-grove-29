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
  return (
    <div className="flex gap-3">
      <div
        className="relative w-[4rem] h-[5.6rem] rounded-lg border-2 border-white/10 bg-felt-green/30 cursor-pointer"
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
              bottom: `${index * 0.25}px`,
              right: `${index * 0.25}px`,
              transform: `translate3d(0, 0, ${index}px)`,
              transition: 'all 0.3s ease-out',
            }}
          >
            <Card 
              card={card}
              onDoubleClick={() => onCardDoubleClick(card)}
              isHighlighted={highlightedCards.includes(card.id)}
            />
          </div>
        ))}
      </div>
      <div 
        className="relative w-[4rem] h-[5.6rem] rounded-lg border-2 border-white/10 bg-felt-green/30"
        style={{
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
        }}
      >
        {waste.map((card, index) => (
          <div
            key={card.id}
            className="absolute inset-0"
            style={{
              transform: `translateX(${index * 2}px)`,
              zIndex: index
            }}
          >
            <Card 
              card={card}
              onDoubleClick={() => onCardDoubleClick(card)}
              isHighlighted={highlightedCards.includes(card.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockAndWaste;