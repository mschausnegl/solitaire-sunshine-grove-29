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
    const cards = from.slice(fromIndex);
    
    if (to.length === 0 || canStack(cards[0], to[to.length - 1])) {
      setHistory([...history, gameState]);
      const newFrom = from.slice(0, fromIndex);
      if (newFrom.length > 0) {
        newFrom[newFrom.length - 1].faceUp = true;
      }
      setGameState(prev => ({
        ...prev,
        score: prev.score + 10,
        moves: prev.moves + 1,
      }));
      
      if (isGameWon(gameState)) {
        toast.success("Congratulations! You've won the game!");
      }
    }
  }, [gameState, history]);

  return {
    gameState,
    newGame,
    undo,
    draw,
    moveCard,
  };
};