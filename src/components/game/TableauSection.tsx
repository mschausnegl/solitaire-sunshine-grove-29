import React, { useState, useEffect } from 'react';
import Card from './Card';
import { Card as CardType } from '../../utils/cards';

interface TableauSectionProps {
  tableau: CardType[][];
  onCardDoubleClick: (card: CardType) => void;
  highlightedCards: string[];
  isNewGame?: boolean;
}

const TableauSection: React.FC<TableauSectionProps> = ({ 
  tableau, 
  onCardDoubleClick, 
  highlightedCards,
  isNewGame = false
}) => {
  const [isDealing, setIsDealing] = useState(false);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());
  const [previousTableau, setPreviousTableau] = useState<CardType[][]>([]);

  useEffect(() => {
    if (isNewGame) {
      setIsDealing(true);
      const timer = setTimeout(() => {
        setIsDealing(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isNewGame]);

  useEffect(() => {
    const newRevealedCards = new Set<string>();
    tableau.forEach((pile, pileIndex) => {
      const previousPile = previousTableau[pileIndex] || [];
      const lastCard = pile[pile.length - 1];
      const previousLastCard = previousPile[previousPile.length - 1];
      
      if (lastCard?.faceUp && previousLastCard && !previousLastCard.faceUp) {
        newRevealedCards.add(lastCard.id);
      }
    });

    setPreviousTableau(tableau);
    setRevealedCards(newRevealedCards);

    const timer = setTimeout(() => {
      setRevealedCards(new Set());
    }, 300);

    return () => clearTimeout(timer);
  }, [tableau]);

  return (
    <div className="w-full mx-auto px-[theme(spacing.stack-space)] transition-all duration-150">
      <div className="@container">
        <div className="grid grid-cols-2 @[600px]:grid-cols-4 @[900px]:grid-cols-7 gap-[theme(spacing.stack-space)]">
          {tableau.map((pile, i) => (
            <div 
              key={i} 
              className="relative aspect-[5/7] rounded-sm border-2 border-white/30 bg-felt-green/50 min-h-[120px]"
              style={{
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
              }}
            >
              {pile.map((card, j) => (
                <div
                  key={card.id}
                  className={`absolute left-0 right-0 transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] ${isNewGame ? 'animate-deal' : ''}`}
                  style={{ 
                    top: `${j * Math.min(25, (100 - 25) / Math.max(pile.length - 1, 1))}%`,
                    animationDelay: isNewGame ? `${0.1 + (i * 3 + j) * 0.05}s` : undefined,
                    animationFillMode: 'both',
                    zIndex: j + 1
                  }}
                >
                  <Card 
                    card={card}
                    onDoubleClick={() => onCardDoubleClick(card)}
                    isHighlighted={highlightedCards.includes(card.id)}
                    isRevealed={revealedCards.has(card.id)}
                    pile={pile}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableauSection;