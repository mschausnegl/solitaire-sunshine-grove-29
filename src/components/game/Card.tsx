import React from "react";
import { Card as CardType, Suit } from "../../utils/cards";
import { cn } from "@/lib/utils";
import { useDrag, useDrop } from 'react-dnd';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onDrop?: (draggedCard: CardType) => void;
  className?: string;
}

const suitSymbols: Record<Suit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const Card: React.FC<CardProps> = ({ card, onClick, onDoubleClick, onDrop, className }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: card,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => card.faceUp,
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (draggedCard: CardType) => {
      onDrop?.(draggedCard);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const ref = (node: HTMLDivElement | null) => {
    drag(drop(node));
  };

  if (!card.faceUp) {
    return (
      <div
        ref={ref}
        className={cn(
          "w-24 h-36 bg-white rounded-lg shadow-md border-2 border-gray-300 cursor-pointer",
          "bg-gradient-to-br from-blue-500 to-blue-600",
          isOver && "border-yellow-400",
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
      className={cn(
        "w-24 h-36 bg-white rounded-lg shadow-md border-2 border-gray-300 p-2",
        "flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow",
        isOver && "border-yellow-400",
        className
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className={cn("text-2xl font-bold", isRed ? "text-red-500" : "text-black")}>
        {card.rank}
        <span className="ml-1">{suitSymbols[card.suit]}</span>
      </div>
      <div className={cn("text-4xl self-center", isRed ? "text-red-500" : "text-black")}>
        {suitSymbols[card.suit]}
      </div>
      <div className={cn("text-2xl font-bold rotate-180", isRed ? "text-red-500" : "text-black")}>
        {card.rank}
        <span className="ml-1">{suitSymbols[card.suit]}</span>
      </div>
    </div>
  );
};

export default Card;