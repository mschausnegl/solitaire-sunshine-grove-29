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
  return (
    <div className="grid grid-cols-4 gap-2">
      {foundations.map((foundation, i) => (
        <div
          key={i}
          className="w-[3.5rem] h-[5rem] sm:w-16 sm:h-24 rounded-lg border-2 border-white/20"
        >
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