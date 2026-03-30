"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { ProfitTableRowDto } from "@/lib/types/api";

// ---------------------------------------------------------------------------
// Reward color by item class
// ---------------------------------------------------------------------------

function getRewardColor(rewardClass: number | null): string {
  switch (rewardClass) {
    case 3:
      return "#af6025"; // Unique (brown)
    case 4:
      return "#178d87"; // Skill Gem (teal)
    case 6:
      return "#b1e7e4"; // Divination Card (cyan)
    case 8:
      return "#ffffff"; // Normal/White
    default:
      return "#aa9e82"; // Default (gray)
  }
}

// ---------------------------------------------------------------------------
// CardTooltip
// ---------------------------------------------------------------------------

interface CardTooltipProps {
  card: ProfitTableRowDto["card"];
  /** The trigger element (e.g. an <a> or <span>). Base UI merges tooltip handlers onto it. */
  children: React.ReactElement;
}

export function CardTooltip({ card, children }: CardTooltipProps) {
  const [imgError, setImgError] = useState(false);

  const artUrl = `https://web.poecdn.com/image/divination-card/${card.details.artFilename}.png`;
  const rewardColor = getRewardColor(card.details.rewardClass);

  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent
        side="right"
        sideOffset={8}
        className="flex min-w-[250px] max-w-[280px] flex-col items-center gap-2 border-t-2 border-t-primary bg-card p-4 text-foreground shadow-xl shadow-black/40 rounded-lg"
      >
        {!imgError && (
          <div className="overflow-hidden rounded">
            <Image
              src={artUrl}
              alt={card.name}
              width={200}
              height={140}
              className="object-cover"
              onError={() => setImgError(true)}
              unoptimized
            />
          </div>
        )}

        <div className="w-full text-center">
          <p className="font-semibold text-white">{card.name}</p>
          <hr className="my-1 border-border" />
          <p className="text-xs text-muted-foreground">Stack: {card.stack}</p>
        </div>

        {card.details.rewardName && (
          <p className="text-sm font-medium" style={{ color: rewardColor }}>
            {card.details.rewardName}
          </p>
        )}

        {card.details.isCorrupted && (
          <p className="text-xs font-semibold text-red-500">
            &quot;Corrupted&quot;
          </p>
        )}

        {card.details.flavour && (
          <p className="text-xs italic text-muted-foreground">
            &quot;{card.details.flavour}&quot;
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
