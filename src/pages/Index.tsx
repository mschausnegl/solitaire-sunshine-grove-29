import React from "react";
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useSolitaire } from "../hooks/useSolitaire";
import Card from "../components/game/Card";
import GameControls from "../components/game/GameControls";
import { Card as CardType, canMoveToFoundation } from "../utils/cards";

const Index = () => {
  const { gameState, newGame, undo, draw, moveCard, findHint, highlightedCards } = useSolitaire();
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

    // Find source pile
    let sourcePile = gameState.waste;
    if (!sourcePile.includes(draggedCard)) {
      sourcePile = gameState.tableau.find(pile => 
        pile.some(card => card.id === draggedCard.id)
      ) || [];
    }

    // Find target pile
    let targetPile = gameState.foundations.find(foundation => 
      foundation.some(card => card.id === targetCard.id)
    );
    
    if (!targetPile) {
      targetPile = gameState.tableau.find(pile => 
        pile.some(card => card.id === targetCard.id)
      );
    }

    if (!targetPile) {
      // If no cards in target pile, find empty tableau pile
      targetPile = gameState.tableau.find(pile => 
        pile.length === 0
      );
    }

    if (sourcePile && targetPile) {
      moveCard(sourcePile, targetPile, draggedCard);
    }
  };

  const handleCardDoubleClick = (card: CardType) => {
    if (!card.faceUp) return;

    // Find the source pile (either from tableau or waste)
    const sourcePile = gameState.tableau.find(pile => pile.includes(card)) || gameState.waste;
    if (!sourcePile) return;

    // Try each foundation pile
    for (const foundation of gameState.foundations) {
      const topCard = foundation.length > 0 ? foundation[foundation.length - 1] : undefined;
      if (canMoveToFoundation(card, topCard)) {
        if (moveCard(sourcePile, foundation, card)) {
          return;
        }
      }
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
            onHint={findHint}
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
                    isHighlighted={highlightedCards.includes(gameState.stock[gameState.stock.length - 1].id)}
                  />
                )}
              </div>
              <div className="w-24 h-36 rounded-lg border-2 border-white/20">
                {gameState.waste.length > 0 && (
                  <Card 
                    card={gameState.waste[gameState.waste.length - 1]}
                    onDoubleClick={() => handleCardDoubleClick(gameState.waste[gameState.waste.length - 1])}
                    isHighlighted={highlightedCards.includes(gameState.waste[gameState.waste.length - 1].id)}
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
                      isHighlighted={highlightedCards.includes(foundation[foundation.length - 1].id)}
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
                      isHighlighted={highlightedCards.includes(card.id)}
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