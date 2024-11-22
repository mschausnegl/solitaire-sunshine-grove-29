import React, { memo, useMemo, forwardRef } from 'react';
import { cn } from "../../lib/utils";
import { Card as CardType } from '../../utils/cards';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useGameStore } from '../../store/gameStore';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  card: CardType;
  isHighlighted?: boolean;
  pile?: CardType[];
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ 
  card, 
  isHighlighted = false,
  pile = [],
  className,
  ...props 
}, forwardedRef) => {
  const store = useGameStore();
  
  // Determine pile type and index from the pile array
  const pileType = pile === store.stock ? 'stock' : 
                  pile === store.waste ? 'waste' : 'tableau';
  const pileIndex = pile.findIndex(c => c.id === card.id);

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
    id: card.id,
    data: {
      card,
      pile,
      pileIndex,
      pileType
    },
    disabled: !card.faceUp || pileType === 'stock' || (pileType === 'waste' && pileIndex !== pile.length - 1)
  });

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: `${pileType}_${pileIndex}`,
    data: {
      card,
      pileIndex,
      pileType
    }
  });

  // Hide original card when dragging
  const style = isDragging ? {
    opacity: 0,
  } : undefined;

  const handleClick = () => {
    if (pileType === 'stock') {
      store.draw();
    } else if (card.faceUp) {
      store.tryAutoMoveCard(card, pileIndex, pileType);
    }
  };

  // Combine the refs
  const ref = React.useMemo(() => {
    return (node: HTMLDivElement) => {
      setNodeRef(node);
      setDroppableRef(node);
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };
  }, [setNodeRef, setDroppableRef, forwardedRef]);

  // Convert rank to number for image filename
  const getRankNumber = (rank: string): string => {
    switch (rank) {
      case 'A': return '1';
      case 'J': return '11';
      case 'Q': return '12';
      case 'K': return '13';
      default: return rank;
    }
  };

  // Convert suit to single letter for image filename
  const getSuitLetter = (suit: string): string => {
    switch (suit) {
      case 'hearts': return 'h';
      case 'diamonds': return 'd';
      case 'clubs': return 'c';
      case 'spades': return 's';
      default: return suit;
    }
  };

  return (
    <div
      ref={ref}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={cn(
        "rounded-sm",
        "aspect-[5/7] w-full",
        "transition-transform duration-200",
        "select-none touch-none",
        card.faceUp && !isDragging && "cursor-grab active:cursor-grabbing",
        isDragging && "cursor-grabbing",
        isOver && "ring-2 ring-green-500",
        className
      )}
      data-card-id={card.id}
      data-face-up={card.faceUp}
      data-pile-type={pileType}
      data-pile-index={pileIndex}
      {...props}
    >
      {isHighlighted && (
        <div className="absolute inset-0 rounded-sm ring-2 ring-yellow-400 dark:ring-yellow-500 pointer-events-none z-10" />
      )}
      <img
        src={card.faceUp ? `/cards/${getRankNumber(card.rank)}_${getSuitLetter(card.suit)}.webp` : '/cards/back.webp'}
        alt={card.faceUp ? `${card.rank} of ${card.suit}` : 'Card back'}
        className={cn(
          "w-full h-full object-contain rounded-sm",
          card.faceUp && "shadow-sm"
        )}
        draggable={false}
      />
    </div>
  );
});

Card.displayName = 'Card';

export default Card;