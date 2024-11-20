import React from "react";
import { Button } from "@/components/ui/button";
import { Undo2, RotateCcw, Lightbulb, Play } from "lucide-react";

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
  return (
    <div className="flex gap-2 mb-4">
      <Button onClick={onNewGame} variant="secondary">
        <RotateCcw className="w-4 h-4 mr-2" />
        New Game
      </Button>
      <Button onClick={onUndo} variant="outline">
        <Undo2 className="w-4 h-4 mr-2" />
        Undo
      </Button>
      <Button onClick={onHint} variant="outline">
        <Lightbulb className="w-4 h-4 mr-2" />
        Hint
      </Button>
      <Button onClick={onAutoPlay} variant="outline">
        <Play className="w-4 h-4 mr-2" />
        Auto Play
      </Button>
    </div>
  );
};

export default GameControls;