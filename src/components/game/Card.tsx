import React from "react";
import { Card as CardType, Suit } from "../../utils/cards";
import { cn } from "@/lib/utils";
import { useDraggable, useDroppable } from "@dnd-kit/core";

interface CardProps {
  card: CardType;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onDrop?: (draggedCard: CardType) => void;
  className?: string;
  index?: number;
  isHighlighted?: boolean;
}

const suitSymbols: Record<Suit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const Card: React.FC<CardProps> = ({ 
  card, 
  onClick, 
  onDoubleClick, 
  onDrop, 
  className, 
  index = 0,
  isHighlighted = false
}) => {
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: card.id,
    data: card,
    disabled: !card.faceUp,
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `droppable-${card.id}`,
    data: card,
  });

  const ref = (node: HTMLDivElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  if (!card.faceUp) {
    return (
      <div
        ref={ref}
        {...attributes}
        {...listeners}
        style={{
          zIndex: index,
          transform: isDragging ? 'scale(1.05)' : undefined,
          transition: 'transform 0.2s ease'
        }}
        className={cn(
          "w-16 h-24 sm:w-24 sm:h-36 bg-white rounded-lg shadow-md border-2 border-gray-300 cursor-pointer",
          "bg-gradient-to-br from-blue-500 to-blue-600",
          isOver && "ring-2 ring-yellow-400",
          isHighlighted && "ring-4 ring-yellow-300 animate-pulse",
          className
        )}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      />
    );
  }

  const isRed = card.suit === "hearts" || card.suit === "diamonds";

  return (
    <div
      ref={ref}
      {...attributes}
      {...listeners}
      style={{
        zIndex: index,
        transform: isDragging ? 'scale(1.05)' : undefined,
        transition: 'transform 0.2s ease'
      }}
      className={cn(
        "w-16 h-24 sm:w-24 sm:h-36 bg-white rounded-lg shadow-md border-2 border-gray-300 p-1 sm:p-2",
        "flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow",
        isOver && "ring-2 ring-yellow-400",
        isHighlighted && "ring-4 ring-yellow-300 animate-pulse",
        isDragging && "shadow-xl",
        className
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className={cn("text-base sm:text-2xl font-bold", isRed ? "text-red-500" : "text-black")}>
        {card.rank}
        <span className="ml-0.5 sm:ml-1">{suitSymbols[card.suit]}</span>
      </div>
      <div className={cn("text-2xl sm:text-4xl self-center", isRed ? "text-red-500" : "text-black")}>
        {suitSymbols[card.suit]}
      </div>
      <div className={cn("text-base sm:text-2xl font-bold rotate-180", isRed ? "text-red-500" : "text-black")}>
        {card.rank}
        <span className="ml-0.5 sm:ml-1">{suitSymbols[card.suit]}</span>
      </div>
    </div>
  );
};

export default Card;