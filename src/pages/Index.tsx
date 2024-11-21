import React, { useState, useEffect } from "react";
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { useSolitaire } from "../hooks/useSolitaire";
import StockAndWaste from "../components/game/StockAndWaste";
import FoundationPiles from "../components/game/FoundationPiles";
import TableauSection from "../components/game/TableauSection";
import GameLayout from "../components/game/GameLayout";
import { Card as CardType } from "../utils/cards";

const Index = () => {
  const { gameState, newGame, undo, draw, moveCard, findHint, highlightedCards, restartGame } = useSolitaire();
  const [activeCard, setActiveCard] = React.useState<CardType | null>(null);
  const [isNewGame, setIsNewGame] = useState(true);

  useEffect(() => {
    // Set initial animation
    setIsNewGame(true);
    // Reset isNewGame after animation
    const timer = setTimeout(() => {
      setIsNewGame(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleNewGame = () => {
    setIsNewGame(true);
    newGame();
  };

  const handleRestartGame = () => {
    setIsNewGame(true);
    restartGame();
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
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
      targetPile = gameState.tableau.find(pile => 
        pile.length === 0
      );
    }

    if (sourcePile && targetPile) {
      moveCard(sourcePile, targetPile, draggedCard);
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <GameLayout
        activeCard={activeCard}
        gameState={gameState}
        onNewGame={handleNewGame}
        onUndo={undo}
        onHint={findHint}
        onRestartGame={handleRestartGame}
      >
        <div className="w-full flex justify-between mb-2 md:mb-4">
          <StockAndWaste
            stock={gameState.stock}
            waste={gameState.waste}
            onDraw={draw}
            onCardDoubleClick={card => {
              // Find target pile
              for (const foundation of gameState.foundations) {
                const topCard = foundation.length > 0 ? foundation[foundation.length - 1] : undefined;
                if (moveCard(gameState.waste, foundation, card)) {
                  return;
                }
              }

              // Try tableau piles
              for (const targetPile of gameState.tableau) {
                if (moveCard(gameState.waste, targetPile, card)) {
                  return;
                }
              }
            }}
            highlightedCards={highlightedCards}
          />
          <FoundationPiles
            foundations={gameState.foundations}
            highlightedCards={highlightedCards}
          />
        </div>
        <TableauSection
          tableau={gameState.tableau}
          onCardDoubleClick={card => {
            // Find source pile
            const sourcePile = gameState.tableau.find(pile => pile.includes(card));
            if (!sourcePile) return;

            // Try foundation piles first
            for (const foundation of gameState.foundations) {
              if (moveCard(sourcePile, foundation, card)) {
                return;
              }
            }

            // Try other tableau piles
            for (const targetPile of gameState.tableau) {
              if (targetPile !== sourcePile && moveCard(sourcePile, targetPile, card)) {
                return;
              }
            }
          }}
          highlightedCards={highlightedCards}
          isNewGame={isNewGame}
        />
      </GameLayout>
    </DndContext>
  );
};

export default Index;