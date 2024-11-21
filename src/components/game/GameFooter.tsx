import React from "react";

interface GameFooterProps {
  wins: number;
  time: number;
  moves: number;
}

const GameFooter = ({ wins, time, moves }: GameFooterProps) => {
  return (
    <footer className="bg-felt-green/80 backdrop-blur-sm border-t border-white/10 py-1.5 sm:py-2 sticky bottom-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 flex justify-between items-center text-white/80 text-xs sm:text-sm">
        <div>Wins: {wins}</div>
        <div>Time: {time}</div>
        <div>Moves: {moves}</div>
      </div>
    </footer>
  );
};

export default GameFooter;