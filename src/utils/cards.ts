export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export interface Card {
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
  id: string;
}

export const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
export const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      deck.push({
        suit,
        rank,
        faceUp: false,
        id: `${rank}-${suit}`,
      });
    });
  });
  return shuffle(deck);
};

export const shuffle = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const isRed = (suit: Suit): boolean => {
  return suit === "hearts" || suit === "diamonds";
};

export const canStack = (top: Card, bottom: Card): boolean => {
  const rankIndex = RANKS.indexOf(top.rank);
  const bottomRankIndex = RANKS.indexOf(bottom.rank);
  return rankIndex + 1 === bottomRankIndex && isRed(top.suit) !== isRed(bottom.suit);
};

export const canMoveToFoundation = (card: Card, topCard?: Card): boolean => {
  if (!topCard) {
    return card.rank === "A";
  }
  const rankIndex = RANKS.indexOf(card.rank);
  const topRankIndex = RANKS.indexOf(topCard.rank);
  return card.suit === topCard.suit && rankIndex === topRankIndex + 1;
};