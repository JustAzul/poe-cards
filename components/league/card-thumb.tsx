"use client";

import { useState } from "react";
import Image from "next/image";

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
        <Image
          src={`https://web.poecdn.com/image/divination-card/${artFilename}.png`}
          alt={name}
          width={32}
          height={22}
          className="rounded-sm object-cover"
          onError={() => setError(true)}
          unoptimized
        />
      )}
    </div>
  );
}
