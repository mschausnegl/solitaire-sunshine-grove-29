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

  const baseCardClasses = "w-[4rem] h-[5.6rem] rounded-sm border border-gray-300";

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
          baseCardClasses,
          "bg-gradient-to-br from-blue-500 to-blue-600",
          isOver && "ring-2 ring-yellow-400",
          isHighlighted && "ring-2 ring-yellow-300 animate-pulse",
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
        baseCardClasses,
        "bg-white p-1",
        "flex flex-col justify-between cursor-pointer hover:shadow-sm transition-shadow",
        isOver && "ring-2 ring-yellow-400",
        isHighlighted && "ring-2 ring-yellow-300 animate-pulse",
        isDragging && "shadow-md",
        className
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className={cn("text-sm font-bold leading-none", isRed ? "text-red-500" : "text-black")}>
        {card.rank}
        <span className="ml-px">{suitSymbols[card.suit]}</span>
      </div>
      <div className={cn("text-2xl leading-none self-center", isRed ? "text-red-500" : "text-black")}>
        {suitSymbols[card.suit]}
      </div>
      <div className={cn("text-sm font-bold leading-none rotate-180", isRed ? "text-red-500" : "text-black")}>
        {card.rank}
        <span className="ml-px">{suitSymbols[card.suit]}</span>
      </div>
    </div>
  );
};

export default Card;
