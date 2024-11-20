import React from "react";
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useSolitaire } from "../hooks/useSolitaire";
import Card from "../components/game/Card";
import GameControls from "../components/game/GameControls";
import { Card as CardType } from "../utils/cards";
import { toast } from "sonner";

const Index = () => {
  const { gameState, newGame, undo, draw, moveCard } = useSolitaire();
  const [activeCard, setActiveCard] = React.useState<CardType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveCard(active.data.current);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    
    if (!over) return;

    const draggedCard = active.data.current as CardType;
    const targetCard = over.data.current as CardType;

    // Find source and target piles
    const sourcePile = gameState.tableau.find(pile => 
      pile.some(card => card.id === draggedCard.id)
    );
    const targetPile = gameState.tableau.find(pile => 
      pile.some(card => card.id === targetCard.id)
    );

    if (sourcePile && targetPile) {
      moveCard(sourcePile, targetPile, draggedCard);
    }
  };

  const handleCardDoubleClick = (card: CardType) => {
    const foundationIndex = gameState.foundations.findIndex(foundation => {
      if (foundation.length === 0) {
        return card.rank === 'A';
      }
      const topCard = foundation[foundation.length - 1];
      return card.suit === topCard.suit && 
             ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
               .indexOf(card.rank) === 
             ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
               .indexOf(topCard.rank) + 1;
    });

    if (foundationIndex !== -1) {
      moveCard(gameState.tableau[foundationIndex], gameState.foundations[foundationIndex], card);
      toast.success("Card moved to foundation!");
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
                  <Card 
                    card={gameState.stock[gameState.stock.length - 1]}
                    onDoubleClick={() => handleCardDoubleClick(gameState.stock[gameState.stock.length - 1])}
                  />
                )}
              </div>
              <div className="w-24 h-36 rounded-lg border-2 border-white/20">
                {gameState.waste.length > 0 && (
                  <Card 
                    card={gameState.waste[gameState.waste.length - 1]}
                    onDoubleClick={() => handleCardDoubleClick(gameState.waste[gameState.waste.length - 1])}
                  />
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
                    <Card 
                      card={foundation[foundation.length - 1]}
                      onDrop={(draggedCard) => moveCard(foundation, foundation, draggedCard)}
                    />
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
                    <Card 
                      card={card}
                      index={j}
                      onDoubleClick={() => handleCardDoubleClick(card)}
                      onDrop={(draggedCard) => moveCard(pile, pile, draggedCard)}
                    />
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

          {/* Drag Overlay */}
          <DragOverlay>
            {activeCard ? <Card card={activeCard} /> : null}
          </DragOverlay>
        </div>
      </div>
    </DndContext>
  );
};

export default Index;