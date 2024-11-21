<lov-code>
import React from "react";
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useSolitaire } from "../hooks/useSolitaire";
import Card from "../components/game/Card";
import GameControls from "../components/game/GameControls";
import { Card as CardType, canMoveToFoundation, canStack } from "../utils/cards";
import StockAndWaste from "../components/game/StockAndWaste";
import FoundationPiles from "../components/game/FoundationPiles";
import TableauSection from "../components/game/TableauSection";

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

    // First try foundation piles
    for (const foundation of gameState.foundations) {
      const topCard = foundation.length > 0 ? foundation[foundation.length - 1] : undefined;
      if (canMoveToFoundation(card, topCard)) {
        if (moveCard(sourcePile, foundation, card)) {
          return;
        }
      }
    }

    // If foundation move wasn't possible, try tableau piles
    for (const targetPile of gameState.tableau) {
      // Skip if it's the same pile
      if (targetPile === sourcePile) continue;

      // Check if we can move to this tableau pile
      if (targetPile.length === 0) {
        // Can only move kings to empty piles
        if (card.rank === 'K') {
          if (moveCard(sourcePile, targetPile, card)) {
            return;
          }
        }
      } else {
        const targetCard = targetPile[targetPile.length - 1];
        if (targetCard.faceUp && canStack(card,