import { Card, createDeck } from "./cards";

export interface GameState {
  stock: Card[];
  waste: Card[];
  foundations: Card[][];
  tableau: Card[][];
  score: number;
  moves: number;
}

export const initializeGame = (): GameState => {
  const deck = createDeck();
  const tableau: Card[][] = Array(7).fill([]).map(() => []);
  let cardIndex = 0;

  // Deal cards to tableau
  for (let i = 0; i < 7; i++) {
    for (let j = i; j < 7; j++) {
      const card = deck[cardIndex++];
      card.faceUp = i === j;
      tableau[j].push(card);
    }
  }

  // Remaining cards go to stock
  const stock = deck.slice(cardIndex).map(card => ({ ...card, faceUp: false }));

  return {
    stock,
    waste: [],
    foundations: [[], [], [], []],
    tableau,
    score: 0,
    moves: 0,
  };
};

export const drawCard = (state: GameState): GameState => {
  if (state.stock.length === 0) {
    if (state.waste.length === 0) return state;
    return {
      ...state,
      stock: state.waste.reverse().map(card => ({ ...card, faceUp: false })),
      waste: [],
      moves: state.moves + 1,
    };
  }

  const card = state.stock[state.stock.length - 1];
  return {
    ...state,
    stock: state.stock.slice(0, -1),
    waste: [...state.waste, { ...card, faceUp: true }],
    moves: state.moves + 1,
  };
};

export const isGameWon = (state: GameState): boolean => {
  return state.foundations.every(foundation => foundation.length === 13);
};