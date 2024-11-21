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
    <div className="flex gap-2 sm:gap-4">
      <div
        className="w-16 h-24 sm:w-24 sm:h-36 rounded-lg border-2 border-white/20 cursor-pointer"
        onClick={onDraw}
      >
        {stock.length > 0 && (
          <Card 
            card={stock[stock.length - 1]}
            onDoubleClick={() => onCardDoubleClick(stock[stock.length - 1])}
            isHighlighted={highlightedCards.includes(stock[stock.length - 1].id)}
          />
        )}
      </div>
      <div className="w-16 h-24 sm:w-24 sm:h-36 rounded-lg border-2 border-white/20">
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