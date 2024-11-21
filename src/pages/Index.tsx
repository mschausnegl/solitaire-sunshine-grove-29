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
  const [isNewGame, setIsNewGame] = useState(false);

  useEffect(() => {
    newGame();
    setIsNewGame(true);
    const timer = setTimeout(() => {
      setIsNewGame(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleNewGame = () => {
    newGame();
    setIsNewGame(true);
    const timer = setTimeout(() => {
      setIsNewGame(false);
    }, 1000);
  };

  const handleRestartGame = () => {
    restartGame();
    setIsNewGame(true);
    const timer = setTimeout(() => {
      setIsNewGame(false);
    }, 1000);
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
    setActiveCard(active.data.current.card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    
    if (!over) return;

    const { card: draggedCard, cardsToMove } = active.data.current;
    const targetCard = over.data.current as CardType;

    let sourcePile = gameState.waste;
    if (!sourcePile.includes(draggedCard)) {
      sourcePile = gameState.tableau.find(pile => 
        pile.some(card => card.id === draggedCard.id)
      ) || [];
    }

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
      const cards = cardsToMove || [draggedCard];
      for (const card of cards) {
        moveCard(sourcePile, targetPile, card);
      }
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
        <div className="h-full flex flex-col justify-between">
          <div className="flex justify-between items-start gap-4">
            <StockAndWaste
              stock={gameState.stock}
              waste={gameState.waste}
              onDraw={draw}
              onCardDoubleClick={card => {
                for (const foundation of gameState.foundations) {
                  if (moveCard(gameState.waste, foundation, card)) {
                    return;
                  }
                }
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
          <div className="mt-4 flex-1">
            <TableauSection
              tableau={gameState.tableau}
              onCardDoubleClick={card => {
                const sourcePile = gameState.tableau.find(pile => pile.includes(card));
                if (!sourcePile) return;

                for (const foundation of gameState.foundations) {
                  if (moveCard(sourcePile, foundation, card)) {
                    return;
                  }
                }

                for (const targetPile of gameState.tableau) {
                  if (targetPile !== sourcePile && moveCard(sourcePile, targetPile, card)) {
                    return;
                  }
                }
              }}
              highlightedCards={highlightedCards}
              isNewGame={isNewGame}
            />
          </div>
        </div>
      </GameLayout>
    </DndContext>
  );
};

export default Index;