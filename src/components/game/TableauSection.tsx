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

  // Calculate vertical offsets based on screen size
  const getFaceDownOffset = () => {
    if (window.innerWidth >= 1024) return 24; // lg
    if (window.innerWidth >= 768) return 20;  // md
    if (window.innerWidth >= 640) return 16;  // sm
    return 12; // xs
  };

  const getFaceUpOffset = () => {
    if (window.innerWidth >= 1024) return 32; // lg
    if (window.innerWidth >= 768) return 28;  // md
    if (window.innerWidth >= 640) return 24;  // sm
    return 16; // xs
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-2">
      <div className="grid grid-cols-7 gap-x-2 md:gap-x-3 lg:gap-x-4">
        {tableau.map((pile, i) => (
          <div 
            key={i} 
            className="relative aspect-[5/7] rounded-sm border-2 border-white/30 bg-felt-green/50"
            style={{
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
            }}
          >
            {pile.map((card, j) => {
              let offset = 0;
              for (let k = 0; k < j; k++) {
                offset += pile[k].faceUp ? getFaceUpOffset() : getFaceDownOffset();
              }

              return (
                <div
                  key={card.id}
                  className={`absolute left-1/2 -translate-x-1/2 transition-all ${isNewGame ? 'animate-deal' : ''}`}
                  style={{ 
                    top: `${offset}px`,
                    animationDelay: isNewGame ? `${0.1 + (i * 3 + j) * 0.05}s` : undefined,
                    animationFillMode: 'both',
                    zIndex: j + 1,
                    width: '100%'
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
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableauSection;