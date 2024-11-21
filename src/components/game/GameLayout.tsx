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

      <main className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6">
        <div className="container mx-auto px-1 sm:px-2 md:px-4">
          <div className="w-full max-w-[calc(7*7rem+6*0.5rem)] mx-auto">
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
            className="w-[2.8rem] h-[3.9rem] sm:w-[4rem] sm:h-[5.6rem] md:w-[7rem] md:h-[9.8rem]"
          />
        ) : null}
      </DragOverlay>
    </div>
  );
};

export default GameLayout;