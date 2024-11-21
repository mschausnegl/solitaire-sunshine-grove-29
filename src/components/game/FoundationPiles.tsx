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
    <div className="grid grid-cols-4 gap-2">
      {foundations.map((foundation, i) => (
        <div
          key={i}
          className="relative aspect-[2.5/3.5] rounded-sm border-2 border-white/30 bg-felt-green/50"
          style={{
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
          }}
        >
          {foundation.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-4xl text-white/40">
              {suitSymbols[i]}
            </div>
          )}
          {foundation.length > 0 && (
            <Card 
              card={foundation[foundation.length - 1]}
              isHighlighted={highlightedCards.includes(foundation[foundation.length - 1].id)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FoundationPiles;