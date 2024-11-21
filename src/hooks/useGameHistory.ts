import { GameState } from "../utils/solitaire";
import { toast } from "sonner";

export const useGameHistory = () => {
  const [history, setHistory] = useState<GameState[]>([]);

  const pushHistory = (state: GameState) => {
    setHistory(prev => [...prev, structuredClone(state)]);
  };

  const popHistory = (): GameState | null => {
    if (history.length === 0) {
      toast.error("No moves to undo!");
      return null;
    }
    const previousState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    return structuredClone(previousState);
  };

  return {
    history,
    pushHistory,
    popHistory,
  };
};