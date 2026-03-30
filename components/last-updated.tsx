"use client";

import { useEffect, useState } from "react";

interface LastUpdatedProps {
  updatedAt: string;
}

function getRelativeTime(updatedAt: string): string {
  const diffMs = Date.now() - new Date(updatedAt).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);

  if (diffMin < 1) return "Updated just now";
  if (diffMin === 1) return "Updated 1 minute ago";
  return `Updated ${diffMin} minutes ago`;
}

export function LastUpdated({ updatedAt }: LastUpdatedProps) {
  const [label, setLabel] = useState(() => getRelativeTime(updatedAt));

  useEffect(() => {
    setLabel(getRelativeTime(updatedAt));

    const id = setInterval(() => {
      setLabel(getRelativeTime(updatedAt));
    }, 60_000);

    return () => clearInterval(id);
  }, [updatedAt]);

  return <p className="text-xs text-muted-foreground">{label}</p>;
}
