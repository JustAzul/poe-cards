"use client";

import { useState } from "react";

export function CardThumb({
  artFilename,
  name,
}: {
  artFilename: string;
  name: string;
}) {
  const [error, setError] = useState(false);
  return (
    <div className="h-[22px] w-[32px] flex-shrink-0">
      {error ? (
        <div className="h-full w-full rounded-sm bg-secondary" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://web.poecdn.com/image/divination-card/${artFilename}.png`}
          alt={name}
          width={32}
          height={22}
          className="h-[22px] w-[32px] rounded-sm object-cover"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
