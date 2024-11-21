import React from "react";
import GameControls from "./GameControls";

interface GameHeaderProps {
  onNewGame: () => void;
  onUndo: () => void;
  onHint: () => void;
  onRestartGame: () => void;
}

const GameHeader = ({
  onNewGame,
  onUndo,
  onHint,
  onRestartGame
}: GameHeaderProps) => {
  return (
    <header className="bg-felt-green/80 backdrop-blur-sm border-b border-white/10 py-2 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <GameControls
          onNewGame={onNewGame}
          onUndo={onUndo}
          onHint={onHint}
          onAutoPlay={() => {}}
          onRestartGame={onRestartGame}
        />
      </div>
    </header>
  );
};

export default GameHeader;