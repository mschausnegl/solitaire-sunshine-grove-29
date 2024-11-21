import React from 'react';
import Card from './Card';
import { Card as CardType } from '../../utils/cards';

interface FoundationPilesProps {
  foundations: CardType[][];
  highlightedCards: string[];
}

const FoundationPiles: React.FC<FoundationPilesProps> = ({
  foundations,
  highlightedCards
}) => {
  const suitSymbols = ['♥', '♠', '♦', '♣'];
  const baseCardClasses = "w-[45px] h-[63px] sm:w-[50px] sm:h-[70px] md:w-[60px] md:h-[84px] lg:w-[70px] lg:h-[98px] xl:w-[80px] xl:h-[112px]";
  
  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3">
      {foundations.map((foundation, i) => (
        <div
          key={i}
          className={`${baseCardClasses} rounded-sm border-2 border-white/30 bg-felt-green/50`}
          style={{
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
          }}
        >
          {foundation.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/40">
              {suitSymbols[i]}
            </div>
          )}
          {foundation.length > 0 && (
            <Card 
              card={foundation[foundation.length - 1]}
              isHighlighted={highlightedCards.includes(foundation[foundation.length - 1].id)}
              className={baseCardClasses}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FoundationPiles;