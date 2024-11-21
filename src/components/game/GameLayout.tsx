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

      <main className="flex-1 p-2 transition-all duration-150">
        <div className="container mx-auto px-1">
          <div className="w-full max-w-[calc(7*theme(spacing.card-w)+6*theme(spacing.stack-space))] mx-auto">
            {children}
          </div>
        </div>
      </main>

      <GameFooter
        wins={gameState.wins}
        time={gameState.time}
        moves={gameState.moves}
      />

      <DragOverlay dropAnimation={{
        duration: 150,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {activeCard ? (
          <Card card={activeCard} />
        ) : null}
      </DragOverlay>
    </div>
  );
};

export default GameLayout;