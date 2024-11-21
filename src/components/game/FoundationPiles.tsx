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
  
  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-1.5 md:gap-2">
      {foundations.map((foundation, i) => (
        <div
          key={i}
          className="w-[2.8rem] h-[3.9rem] sm:w-[4rem] sm:h-[5.6rem] md:w-[7rem] md:h-[9.8rem] rounded-sm border-2 border-white/30 bg-felt-green/50"
          style={{
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
          }}
        >
          {foundation.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl md:text-4xl text-white/40">
              {suitSymbols[i]}
            </div>
          )}
          {foundation.length > 0 && (
            <Card 
              card={foundation[foundation.length - 1]}
              isHighlighted={highlightedCards.includes(foundation[foundation.length - 1].id)}
              className="w-[2.8rem] h-[3.9rem] sm:w-[4rem] sm:h-[5.6rem] md:w-[7rem] md:h-[9.8rem]"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FoundationPiles;