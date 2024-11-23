import React from 'react';
import Card from './Card';
import EmptyPileSpace from './EmptyPileSpace';
import { Card as CardType } from '../../utils/cards';
import { cn } from '../../lib/utils';

interface StockAndWasteProps {
  stock: CardType[];
  waste: CardType[];
  highlightedCards: string[];
  onDraw: () => void;
  onCardDoubleClick?: (card: CardType) => void;
}

const StockAndWaste: React.FC<StockAndWasteProps> = ({ 
  stock, 
  waste, 
  highlightedCards, 
  onDraw,
  onCardDoubleClick 
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {/* Stock pile */}
      <div 
        onClick={onDraw} 
        data-pile-type="stock"
        className="aspect-[5/7] w-full"
      >
        {stock.length > 0 ? (
          <Card 
            card={stock[stock.length - 1]}
            pile={stock}
            pileType="stock"
            pileIndex={stock.length - 1}
            isHighlighted={highlightedCards.includes('stock')}
          />
        ) : (
          <div 
            className={cn(
              "aspect-[5/7] w-full",
              "rounded-sm",
              "border-2 border-white/20",
              "flex items-center justify-center cursor-pointer hover:border-white/40",
              "transition-colors"
            )}
          >
            <div className="text-white/50 text-2xl">↻</div>
          </div>
        )}
      </div>

      {/* Waste pile */}
      <div 
        data-pile-type="waste"
        data-pile-index={0}
        className="aspect-[5/7] w-full relative"
      >
        {waste.length === 0 ? (
          <EmptyPileSpace index={1} pileType="waste" />
        ) : (
          <>
            {waste.length > 1 && (
              <div className="absolute inset-0">
                <Card 
                  card={waste[waste.length - 2]}
                  isHighlighted={highlightedCards.includes(waste[waste.length - 2].id)}
                  pile={waste}
                  pileType="waste"
                  pileIndex={waste.length - 2}
                  className="w-full h-full"
                  onClick={() => onCardDoubleClick?.(waste[waste.length - 2])}
                />
              </div>
            )}
            <div className="absolute inset-0" style={{ zIndex: waste.length > 1 ? 1 : 0 }}>
              <Card 
                card={waste[waste.length - 1]}
                isHighlighted={highlightedCards.includes(waste[waste.length - 1].id)}
                pile={waste}
                pileType="waste"
                pileIndex={waste.length - 1}
                className="w-full h-full"
                onClick={() => onCardDoubleClick?.(waste[waste.length - 1])}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StockAndWaste;