import React from "react";
import { useSolitaire } from "../hooks/useSolitaire";
import Card from "../components/game/Card";
import GameControls from "../components/game/GameControls";

const Index = () => {
  const { gameState, newGame, undo, draw } = useSolitaire();

  return (
    <div className="min-h-screen bg-felt-green p-4">
      <div className="max-w-7xl mx-auto">
        <GameControls
          onNewGame={newGame}
          onUndo={undo}
          onHint={() => {}}
          onAutoPlay={() => {}}
        />
        
        <div className="flex justify-between mb-8">
          {/* Stock and Waste */}
          <div className="flex gap-4">
            <div
              className="w-24 h-36 rounded-lg border-2 border-white/20 cursor-pointer"
              onClick={draw}
            >
              {gameState.stock.length > 0 && (
                <Card card={gameState.stock[gameState.stock.length - 1]} />
              )}
            </div>
            <div className="w-24 h-36 rounded-lg border-2 border-white/20">
              {gameState.waste.length > 0 && (
                <Card card={gameState.waste[gameState.waste.length - 1]} />
              )}
            </div>
          </div>

          {/* Foundations */}
          <div className="flex gap-4">
            {gameState.foundations.map((foundation, i) => (
              <div
                key={i}
                className="w-24 h-36 rounded-lg border-2 border-white/20"
              >
                {foundation.length > 0 && (
                  <Card card={foundation[foundation.length - 1]} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div className="flex gap-4">
          {gameState.tableau.map((pile, i) => (
            <div key={i} className="relative w-24">
              {pile.map((card, j) => (
                <div
                  key={card.id}
                  className="absolute"
                  style={{ top: `${j * 30}px` }}
                >
                  <Card card={card} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Score */}
        <div className="fixed bottom-4 right-4 bg-white/90 rounded-lg p-4 shadow-lg">
          <div className="text-lg font-bold">Score: {gameState.score}</div>
          <div className="text-sm text-gray-600">Moves: {gameState.moves}</div>
        </div>
      </div>
    </div>
  );
};

export default Index;