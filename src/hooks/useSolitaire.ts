import { useState, useCallback, useEffect } from "react";
import { GameState, initializeGame, drawCard, isGameWon } from "../utils/solitaire";
import { Card, canStack, canMoveToFoundation } from "../utils/cards";
import { toast } from "sonner";

export const useSolitaire = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame());
  const [history, setHistory] = useState<GameState[]>([]);
  const [highlightedCards, setHighlightedCards] = useState<string[]>([]);

  // Clear highlights after delay
  useEffect(() => {
    if (highlightedCards.length > 0) {
      const timer = setTimeout(() => {
        setHighlightedCards([]);
      }, 2000); // Clear after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [highlightedCards]);

  const newGame = useCallback(() => {
    setGameState(initializeGame());
    setHistory([]);
    setHighlightedCards([]);
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) {
      toast.error("No moves to undo!");
      return;
    }
    const previousState = history[history.length - 1];
    setGameState(previousState);
    setHistory(history.slice(0, -1));
    setHighlightedCards([]);
  }, [history]);

  const findHint = useCallback(() => {
    setHighlightedCards([]); // Clear previous highlights

    // Check for moves to foundation first
    for (const foundation of gameState.foundations) {
      // Check waste pile
      if (gameState.waste.length > 0) {
        const wasteCard = gameState.waste[gameState.waste.length - 1];
        const topFoundationCard = foundation.length > 0 ? foundation[foundation.length - 1] : undefined;
        if (canMoveToFoundation(wasteCard, topFoundationCard)) {
          setHighlightedCards([wasteCard.id]);
          toast.info("Try moving " + wasteCard.rank + " of " + wasteCard.suit + " to the foundation");
          return;
        }
      }

      // Check tableau piles
      for (const pile of gameState.tableau) {
        if (pile.length === 0) continue;
        const tableauCard = pile[pile.length - 1];
        if (!tableauCard.faceUp) continue;
        
        const topFoundationCard = foundation.length > 0 ? foundation[foundation.length - 1] : undefined;
        if (canMoveToFoundation(tableauCard, topFoundationCard)) {
          setHighlightedCards([tableauCard.id]);
          toast.info("Try moving " + tableauCard.rank + " of " + tableauCard.suit + " to the foundation");
          return;
        }
      }
    }

    // Check for tableau to tableau moves
    for (const sourcePile of gameState.tableau) {
      if (sourcePile.length === 0) continue;
      
      const faceUpIndex = sourcePile.findIndex(card => card.faceUp);
      if (faceUpIndex === -1) continue;
      
      const movableCard = sourcePile[faceUpIndex];
      
      for (const targetPile of gameState.tableau) {
        if (sourcePile === targetPile) continue;
        
        if (targetPile.length === 0) {
          if (movableCard.rank === 'K') {
            setHighlightedCards([movableCard.id]);
            toast.info("Try moving " + movableCard.rank + " of " + movableCard.suit + " to an empty column");
            return;
          }
        } else {
          const targetCard = targetPile[targetPile.length - 1];
          if (canStack(movableCard, targetCard)) {
            setHighlightedCards([movableCard.id, targetCard.id]);
            toast.info("Try moving " + movableCard.rank + " of " + movableCard.suit + " onto " + targetCard.rank + " of " + targetCard.suit);
            return;
          }
        }
      }
    }

    // If no moves found
    toast.warning("No obvious moves found. Try drawing a card!");
  }, [gameState]);

  const draw = useCallback(() => {
    setHistory([...history, gameState]);
    setGameState(drawCard(gameState));
    setHighlightedCards([]);
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
      setHighlightedCards([]); // Clear highlights after move
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
    findHint,
    highlightedCards,
  };
};