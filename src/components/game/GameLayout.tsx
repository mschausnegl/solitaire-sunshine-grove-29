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
    <div className="h-full flex flex-col">
      <GameHeader
        onNewGame={onNewGame}
        onUndo={onUndo}
        onHint={onHint}
        onRestartGame={onRestartGame}
      />

      <main className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 relative overflow-hidden">
        <div className="absolute inset-0 p-2 sm:p-3 md:p-4 lg:p-6">
          <div className="h-full max-w-[1400px] mx-auto flex flex-col">
            {children}
          </div>
        </div>
      </main>

      <GameFooter
        wins={gameState.wins}
        time={gameState.time}
        moves={gameState.moves}
      />

      <DragOverlay dropAnimation={null}>
        {activeCard ? (
          <Card 
            card={activeCard}
          />
        ) : null}
      </DragOverlay>
    </div>
  );
};

export default GameLayout;