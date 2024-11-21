import React from "react";
import { Button } from "@/components/ui/button";
import { Undo2, RotateCcw, Lightbulb, Play } from "lucide-react";
import { toast } from "sonner";

interface GameControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  onHint?: () => void;
  onAutoPlay?: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onUndo,
  onHint,
  onAutoPlay,
}) => {
  const handleNewGame = () => {
    toast.info("Shuffling cards...");
    // Add a small delay to allow the animation to play
    setTimeout(onNewGame, 500);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button onClick={handleNewGame} variant="secondary" className="text-xs sm:text-sm">
        <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        New Game
      </Button>
      <Button onClick={onUndo} variant="outline" className="text-xs sm:text-sm">
        <Undo2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        Undo
      </Button>
      <Button onClick={onHint} variant="outline" className="text-xs sm:text-sm">
        <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        Hint
      </Button>
      <Button onClick={onAutoPlay} variant="outline" className="text-xs sm:text-sm">
        <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        Auto Play
      </Button>
    </div>
  );
};

export default GameControls;