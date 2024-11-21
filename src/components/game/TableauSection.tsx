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

  // Calculate the vertical offset for face-up and face-down cards
  const getFaceDownOffset = () => window.innerWidth >= 768 ? 24 : 8;
  const getFaceUpOffset = () => window.innerWidth >= 768 ? 32 : 12;

  return (
    <div className="grid grid-cols-7 gap-1 w-full">
      {tableau.map((pile, i) => (
        <div 
          key={i} 
          className="relative aspect-[5/7] rounded-sm border-2 border-white/30 bg-felt-green/50"
          style={{
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
          }}
        >
          {pile.map((card, j) => {
            // Calculate offset based on whether previous cards are face up or down
            let offset = 0;
            for (let k = 0; k < j; k++) {
              offset += pile[k].faceUp ? getFaceUpOffset() : getFaceDownOffset();
            }

            return (
              <div
                key={card.id}
                className={`absolute left-0 transition-all ${isNewGame ? 'animate-deal' : ''}`}
                style={{ 
                  top: `${offset}px`,
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
                  pile={pile}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default TableauSection;