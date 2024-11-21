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

  // Track which cards are newly revealed
  useEffect(() => {
    const newRevealedCards = new Set<string>();
    
    tableau.forEach((pile, pileIndex) => {
      const lastCard = pile[pile.length - 1];
      const previousPile = previousTableau[pileIndex] || [];
      const previousLastCard = previousPile[previousPile.length - 1];
      
      // Only add to revealed cards if:
      // 1. The card is face up
      // 2. The previous last card was either face down or different
      if (lastCard?.faceUp && 
          (!previousLastCard?.faceUp || previousLastCard.id !== lastCard.id)) {
        newRevealedCards.add(lastCard.id);
      }
    });

    setPreviousTableau(tableau);
    setRevealedCards(newRevealedCards);

    // Clear the revealed status after animation
    const timer = setTimeout(() => {
      setRevealedCards(new Set());
    }, 300);

    return () => clearTimeout(timer);
  }, [tableau]);

  return (
    <div className="flex gap-0.5 md:gap-2 w-full">
      {tableau.map((pile, i) => (
        <div 
          key={i} 
          className="relative flex-1 md:flex-initial w-[2.8rem] md:w-[7rem] h-[3.9rem] md:h-[9.8rem] rounded-sm border-2 border-white/30 bg-felt-green/50"
          style={{
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
          }}
        >
          {pile.map((card, j) => (
            <div
              key={card.id}
              className={`absolute transition-all ${isNewGame ? 'animate-deal' : ''}`}
              style={{ 
                top: `${j * (window.innerWidth >= 768 ? 16 : 6)}px`,
                animationDelay: isNewGame ? `${0.1 + (i * 3 + j) * 0.05}s` : undefined,
                animationFillMode: 'both',
                zIndex: j + 1
              }}
            >
              <Card 
                card={card}
                index={j}
                onDoubleClick={() => onCardDoubleClick(card)}
                isHighlighted={highlightedCards.includes(card.id)}
                isRevealed={revealedCards.has(card.id)}
                className="w-[2.8rem] md:w-[7rem] h-[3.9rem] md:h-[9.8rem]"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableauSection;