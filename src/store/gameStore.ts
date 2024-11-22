import { create } from 'zustand';
import { Card } from '../utils/cards';

interface GameStore {
  stock: Card[];
  waste: Card[];
  foundations: Card[][];
  tableau: Card[][];
  draw: () => void;
  tryAutoMoveCard: (card: Card, pileIndex: number, pileType: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  stock: [],
  waste: [],
  foundations: [],
  tableau: [],
  draw: () => {},
  tryAutoMoveCard: () => {},
}));