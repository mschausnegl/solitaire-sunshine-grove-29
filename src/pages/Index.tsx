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
  const [animatingCard, setAnimatingCard] = useState<{
    card: CardType;
    targetPosition: { x: number; y: number };
  } | null>(null);

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

  const handleAutoMove = async (card: CardType, targetElement: HTMLElement) => {
    const rect = targetElement.getBoundingClientRect();
    setAnimatingCard({
      card,
      targetPosition: { x: rect.left, y: rect.top }
    });

    // Wait for animation to complete before updating game state
    await new Promise(resolve => setTimeout(resolve, 300));
    setAnimatingCard(null);
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
      // Move all cards together
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
        <div className="w-full flex justify-between mb-2 md:mb-4">
          <StockAndWaste
            stock={gameState.stock}
            waste={gameState.waste}
            onDraw={draw}
            onCardDoubleClick={async (card) => {
              for (const foundation of gameState.foundations) {
                const foundationElement = document.querySelector(`[data-foundation="${gameState.foundations.indexOf(foundation)}"]`);
                if (foundationElement && moveCard(gameState.waste, foundation, card)) {
                  await handleAutoMove(card, foundationElement);
                  return;
                }
              }

              for (const targetPile of gameState.tableau) {
                const tableauElement = document.querySelector(`[data-tableau="${gameState.tableau.indexOf(targetPile)}"]`);
                if (tableauElement && moveCard(gameState.waste, targetPile, card)) {
                  await handleAutoMove(card, tableauElement);
                  return;
                }
              }
            }}
            highlightedCards={highlightedCards}
            animatingCard={animatingCard}
          />
          <FoundationPiles
            foundations={gameState.foundations}
            highlightedCards={highlightedCards}
          />
        </div>
        <TableauSection
          tableau={gameState.tableau}
          onCardDoubleClick={async (card) => {
            const sourcePile = gameState.tableau.find(pile => pile.includes(card));
            if (!sourcePile) return;

            for (const foundation of gameState.foundations) {
              const foundationElement = document.querySelector(`[data-foundation="${gameState.foundations.indexOf(foundation)}"]`);
              if (foundationElement && moveCard(sourcePile, foundation, card)) {
                await handleAutoMove(card, foundationElement);
                return;
              }
            }

            for (const targetPile of gameState.tableau) {
              const tableauElement = document.querySelector(`[data-tableau="${gameState.tableau.indexOf(targetPile)}"]`);
              if (tableauElement && targetPile !== sourcePile && moveCard(sourcePile, targetPile, card)) {
                await handleAutoMove(card, tableauElement);
                return;
              }
            }
          }}
          highlightedCards={highlightedCards}
          isNewGame={isNewGame}
          animatingCard={animatingCard}
        />
      </GameLayout>
    </DndContext>
  );
};

export default Index;