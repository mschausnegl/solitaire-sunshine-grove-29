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
        className="w-[2.8rem] h-[3.9rem] md:w-[7rem] md:h-[9.8rem] rounded-sm border border-white/20 cursor-pointer"
        onClick={onDraw}
      >
        {stock.length > 0 && (
          <Card 
            card={stock[stock.length - 1]}
            onDoubleClick={() => onCardDoubleClick(stock[stock.length - 1])}
            isHighlighted={highlightedCards.includes(stock[stock.length - 1].id)}
            className="w-[2.8rem] h-[3.9rem] md:w-[7rem] md:h-[9.8rem]"
          />
        )}
      </div>
      <div className="w-[2.8rem] h-[3.9rem] md:w-[7rem] md:h-[9.8rem] rounded-sm border border-white/20">
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