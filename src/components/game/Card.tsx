import React from "react";
import { Card as CardType, Suit } from "../../utils/cards";
import { cn } from "@/lib/utils";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { measureCardOperation } from "@/utils/performance";

interface CardProps {
  card: CardType;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onDrop?: (draggedCard: CardType) => void;
  className?: string;
  index?: number;
  isHighlighted?: boolean;
  isShuffling?: boolean;
  isRevealed?: boolean;
  style?: React.CSSProperties;
  pile?: CardType[]; // Add pile prop to know about cards above
}

const suitSymbols: Record<Suit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const Card = React.memo(({ 
  card, 
  onClick, 
  onDoubleClick, 
  onDrop, 
  className, 
  index = 0,
  isHighlighted = false,
  isShuffling = false,
  isRevealed = false,
  style,
  pile = []
}: CardProps) => {
  // Find all cards that should move with this one (cards above in the pile)
  const cardIndex = pile.findIndex(c => c.id === card.id);
  const cardsToMove = cardIndex !== -1 ? pile.slice(cardIndex) : [card];

  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: card.id,
    data: {
      card,
      cardsToMove // Pass all cards that should move together
    },
    disabled: !card.faceUp || (pile.length > 0 && cardIndex !== -1 && !pile[cardIndex].faceUp),
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `droppable-${card.id}`,
    data: card,
  });

  const ref = (node: HTMLDivElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  const baseCardClasses = "w-[2.8rem] h-[3.9rem] md:w-[7rem] md:h-[9.8rem] rounded-sm border border-gray-300";

  const startTime = performance.now();
  
  if (!card.faceUp) {
    measureCardOperation('Render Face Down Card', startTime);
    return (
      <div
        ref={ref}
        {...attributes}
        {...listeners}
        style={{
          zIndex: index,
          opacity: isDragging ? '0' : '1',
          transition: 'opacity 0.2s ease',
          backgroundImage: 'url(/lovable-uploads/5b92a5bc-abd7-42ae-a1d3-98e1c51b1ed3.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...style
        }}
        className={cn(
          baseCardClasses,
          isOver && "ring-2 ring-yellow-400",
          isHighlighted && "ring-2 ring-yellow-300 animate-pulse",
          isShuffling && "animate-shuffle",
          className
        )}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      />
    );
  }

  const isRed = card.suit === "hearts" || card.suit === "diamonds";
  
  measureCardOperation('Render Face Up Card', startTime);
  
  return (
    <div
      ref={ref}
      {...attributes}
      {...listeners}
      style={{
        zIndex: index,
        opacity: isDragging ? '0' : '1',
        transition: 'opacity 0.2s ease',
        ...style
      }}
      className={cn(
        baseCardClasses,
        "bg-white p-1 md:p-4",
        "flex flex-col justify-between cursor-pointer hover:shadow-sm transition-shadow",
        isOver && "ring-2 ring-yellow-400",
        isHighlighted && "ring-2 ring-yellow-300 animate-pulse",
        isShuffling && "animate-shuffle",
        isRevealed && "animate-reveal",
        className
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className={cn("text-sm md:text-3xl font-bold leading-none", isRed ? "text-red-500" : "text-black")}>
        {card.rank}
        <span className="ml-px">{suitSymbols[card.suit]}</span>
      </div>
      <div className={cn("text-xl md:text-6xl leading-none self-center", isRed ? "text-red-500" : "text-black")}>
        {suitSymbols[card.suit]}
      </div>
      <div className={cn("text-sm md:text-3xl font-bold leading-none rotate-180", isRed ? "text-red-500" : "text-black")}>
        {card.rank}
        <span className="ml-px">{suitSymbols[card.suit]}</span>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;