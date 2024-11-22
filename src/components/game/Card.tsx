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
  style?: React.CSSProperties;
  pile?: CardType[];
  isAnimating?: boolean;
  animateToPosition?: { x: number; y: number };
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
  style,
  pile = [],
  isAnimating = false,
  animateToPosition,
}: CardProps) => {
  const cardIndex = pile.findIndex(c => c.id === card.id);
  const cardsToMove = cardIndex !== -1 ? pile.slice(cardIndex) : [card];

  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: card.id,
    data: {
      card,
      cardsToMove
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

  const baseCardClasses = "w-[2.8rem] h-[3.9rem] sm:w-[4rem] sm:h-[5.6rem] md:w-[7rem] md:h-[9.8rem] rounded-sm border border-gray-300";

  const startTime = performance.now();
  
  const animationStyle = isAnimating && animateToPosition ? {
    position: 'fixed' as const,
    left: animateToPosition.x,
    top: animateToPosition.y,
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.3s ease-in-out',
    zIndex: 9999,
  } : {};
  
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
          backgroundImage: 'url(/lovable-uploads/5b92a5bc-abd7-42ae-a1d3-98e1c51b1ed3.png)',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#fff',
          ...style,
          ...animationStyle
        }}
        className={cn(
          baseCardClasses,
          isOver && "ring-2 ring-yellow-400",
          isHighlighted && "ring-2 ring-yellow-300",
          isAnimating && "animate-card-move",
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
        ...style,
        ...animationStyle
      }}
      className={cn(
        baseCardClasses,
        "bg-white px-0.5 sm:px-1 md:px-2 py-0 sm:py-0.5 md:py-1",
        "flex flex-col justify-between cursor-pointer hover:shadow-sm",
        isOver && "ring-2 ring-yellow-400",
        isHighlighted && "ring-2 ring-yellow-300",
        isAnimating && "animate-card-move",
        className
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className={cn("text-xs sm:text-sm md:text-3xl font-bold leading-none", isRed ? "text-red-500" : "text-black")}>
        {card.rank}
        <span className="ml-px">{suitSymbols[card.suit]}</span>
      </div>
      <div className={cn("text-base sm:text-xl md:text-6xl leading-none self-center", isRed ? "text-red-500" : "text-black")}>
        {suitSymbols[card.suit]}
      </div>
      <div className={cn("text-xs sm:text-sm md:text-3xl font-bold leading-none rotate-180", isRed ? "text-red-500" : "text-black")}>
        {card.rank}
        <span className="ml-px">{suitSymbols[card.suit]}</span>
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;