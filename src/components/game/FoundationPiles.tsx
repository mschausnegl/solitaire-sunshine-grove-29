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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
      {foundations.map((foundation, i) => (
        <div
          key={i}
          className="w-16 h-24 sm:w-24 sm:h-36 rounded-lg border-2 border-white/20"
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