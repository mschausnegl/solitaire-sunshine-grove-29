import { useState, useEffect } from "react";

export const useHighlight = () => {
  const [highlightedCards, setHighlightedCards] = useState<string[]>([]);

  useEffect(() => {
    if (highlightedCards.length > 0) {
      const timer = setTimeout(() => {
        setHighlightedCards([]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedCards]);

  return {
    highlightedCards,
    setHighlightedCards,
  };
};