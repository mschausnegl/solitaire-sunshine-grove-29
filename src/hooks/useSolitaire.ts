import { useState, useCallback } from "react";
import { GameState, initializeGame, drawCard, isGameWon } from "../utils/solitaire";
import { Card, canStack, canMoveToFoundation } from "../utils/cards";
import { toast } from "sonner";

export const useSolitaire = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [history, setHistory] = useState<GameState[]>([]);

  const newGame = useCallback(() => {
    setGameState(initializeGame());
    setHistory([]);
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setGameState(previousState);
    setHistory(history.slice(0, -1));
  }, [history]);

  const draw = useCallback(() => {
    setHistory([...history, gameState]);
    setGameState(drawCard(gameState));
  }, [gameState, history]);

  const moveCard = useCallback((from: Card[], to: Card[], card: Card) => {
    const fromIndex = from.findIndex(c => c.id === card.id);
    if (fromIndex === -1) return false;
    
    const cards = from.slice(fromIndex);
    let isValidMove = false;

    // Check if moving to foundation
    const isFoundationMove = gameState.foundations.some(f => f === to);
    if (isFoundationMove) {
      const topFoundationCard = to.length > 0 ? to[to.length - 1] : undefined;
      isValidMove = canMoveToFoundation(card, topFoundationCard);
    } else {
      // Regular tableau move
      isValidMove = to.length === 0 || canStack(cards[0], to[to.length - 1]);
    }
    
    if (isValidMove) {
      setHistory([...history, gameState]);
      setGameState(prev => {
        // Create new state
        const newState = { ...prev };
        
        // Find and update source pile
        if (prev.waste.includes(card)) {
          newState.waste = prev.waste.filter(c => c.id !== card.id);
        } else {
          const sourcePileIndex = prev.tableau.findIndex(pile => pile.includes(card));
          if (sourcePileIndex !== -1) {
            const newPile = prev.tableau[sourcePileIndex].slice(0, fromIndex);
            if (newPile.length > 0) {
              newPile[newPile.length - 1].faceUp = true;
            }
            newState.tableau[sourcePileIndex] = newPile;
          }
        }

        // Find and update target pile
        if (isFoundationMove) {
          const targetPileIndex = prev.foundations.findIndex(f => f === to);
          if (targetPileIndex !== -1) {
            newState.foundations[targetPileIndex] = [...prev.foundations[targetPileIndex], card];
          }
        } else {
          const targetPileIndex = prev.tableau.findIndex(pile => pile === to);
          if (targetPileIndex !== -1) {
            newState.tableau[targetPileIndex] = [...prev.tableau[targetPileIndex], ...cards];
          }
        }

        // Update score
        newState.score += isFoundationMove ? 15 : 5;
        newState.moves += 1;

        // Check for win condition
        if (isGameWon(newState)) {
          toast.success("Congratulations! You've won the game!");
        }

        return newState;
      });
      return true;
    }
    return false;
  }, [gameState, history]);

  return {
    gameState,
    newGame,
    undo,
    draw,
    moveCard,
  };
};