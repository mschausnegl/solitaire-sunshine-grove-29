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
    <div className="flex gap-2">
      <div
        className="relative aspect-[2.5/3.5] rounded-sm border-2 border-white/30 bg-felt-green/50 cursor-pointer"
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
              bottom: `${index * 0.5}px`,
              right: `${index * 0.5}px`,
              transform: `translate3d(0, 0, ${index}px)`,
              transition: 'all 0.3s ease-out',
              boxShadow: '1px 1px 2px rgba(0,0,0,0.2)'
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
        className="relative aspect-[2.5/3.5] rounded-sm border-2 border-white/30 bg-felt-green/50"
        style={{
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
        }}
      >
        {waste.length > 0 && (
          <Card 
            card={waste[waste.length - 1]}
            onDoubleClick={() => onCardDoubleClick(waste[waste.length - 1])}
            isHighlighted={highlightedCards.includes(waste[waste.length - 1].id)}
          />
        )}
      </div>
    </div>
  );
};

export default StockAndWaste;