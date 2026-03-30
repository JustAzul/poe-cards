"use client";

import { useState } from "react";

interface DivineSplitsProps {
  divineRate: number;
}

export function DivineSplits({ divineRate }: DivineSplitsProps) {
  const [open, setOpen] = useState(false);

  const splits = Array.from({ length: 9 }, (_, i) => {
    const fraction = (i + 1) / 10;
    return {
      label: `${fraction.toFixed(1)} div`,
      value: (divineRate * fraction).toFixed(1),
    };
  });

  return (
    <div className="rounded-lg border border-border/60 bg-card shadow-sm shadow-black/20 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
      >
        <span>Divine Split Values</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-border/40 bg-background/50 px-4 py-3">
          <p className="mb-2.5 text-xs font-medium text-primary">
            1 div = {Math.round(divineRate)}c
          </p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
            {splits.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between text-sm tabular-nums"
              >
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-medium text-foreground">{s.value}c</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
