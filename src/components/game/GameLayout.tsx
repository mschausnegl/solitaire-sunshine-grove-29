import React from "react";
import { DragOverlay } from "@dnd-kit/core";
import Card from "./Card";
import { Card as CardType } from "@/utils/cards";
import GameHeader from "./GameHeader";
import GameFooter from "./GameFooter";

interface GameLayoutProps {
  children: React.ReactNode;
  activeCard: CardType | null;
  gameState: {
    wins: number;
    time: number;
    moves: number;
  };
  onNewGame: () => void;
  onUndo: () => void;
  onHint: () => void;
  onRestartGame: () => void;
}

const GameLayout = ({ 
  children, 
  activeCard,
  gameState,
  onNewGame,
  onUndo,
  onHint,
  onRestartGame
}: GameLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <GameHeader
        onNewGame={onNewGame}
        onUndo={onUndo}
        onHint={onHint}
        onRestartGame={onRestartGame}
      />

      <main className="flex-1 p-1 sm:p-2 md:p-4">
        <div className="container mx-auto px-1 sm:px-2">
          <div className="w-full max-w-[calc(7*7rem+6*0.5rem)] mx-auto md:mx-0">
            {children}
          </div>
        </div>
      </main>

      <GameFooter
        wins={gameState.wins}
        time={gameState.time}
        moves={gameState.moves}
      />

      <DragOverlay>
        {activeCard ? <Card card={activeCard} /> : null}
      </DragOverlay>
    </div>
  );
};

export default GameLayout;