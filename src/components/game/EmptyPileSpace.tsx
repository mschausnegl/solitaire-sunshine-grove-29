import React from 'react';
import { cn } from "@/lib/utils";

interface EmptyPileSpaceProps {
  index: number;
  pileType: string;
}

const EmptyPileSpace = ({ index, pileType }: EmptyPileSpaceProps) => {
  return (
    <div
      className={cn(
        "aspect-[5/7] w-full",
        "rounded-sm",
        "border-2 border-white/20"
      )}
      data-pile-type={pileType}
      data-pile-index={index}
    />
  );
};

export default EmptyPileSpace;