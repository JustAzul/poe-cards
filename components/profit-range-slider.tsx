"use client";

import { useMemo, useRef, useCallback, useEffect, useState } from "react";

interface ProfitRangeSliderProps {
  profits: number[];
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  currencySuffix?: string;
}

// Symmetric log scale: handles negatives via sign * log1p(|val|)
function symLog(val: number): number {
  return Math.sign(val) * Math.log1p(Math.abs(val));
}

function symExp(val: number): number {
  return Math.sign(val) * Math.expm1(Math.abs(val));
}

function toFraction(val: number, min: number, max: number): number {
  if (max <= min) return 0;
  const minL = symLog(min);
  const maxL = symLog(max);
  if (maxL === minL) return 0;
  return (symLog(val) - minL) / (maxL - minL);
}

function fromFraction(frac: number, min: number, max: number): number {
  if (max <= min) return min;
  const minL = symLog(min);
  const maxL = symLog(max);
  return symExp(minL + frac * (maxL - minL));
}

export function ProfitRangeSlider({
  profits,
  min,
  max,
  value,
  onChange,
  currencySuffix = "c",
}: ProfitRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  // Adaptive bucket count: fewer buckets for fewer cards, more for larger datasets
  const bucketCount = useMemo(() => {
    return Math.max(8, Math.min(40, Math.round(profits.length * 0.8)));
  }, [profits.length]);

  const histogram = useMemo(() => {
    if (max <= min || profits.length === 0) return [];
    const minL = symLog(min);
    const maxL = symLog(max);
    const logRange = maxL - minL;
    if (logRange === 0) return [];
    const buckets = new Array(bucketCount).fill(0);

    for (const p of profits) {
      const clamped = Math.max(Math.min(p, max), min);
      const logPos = (symLog(clamped) - minL) / logRange;
      const idx = Math.min(Math.floor(logPos * bucketCount), bucketCount - 1);
      if (idx >= 0) buckets[idx]++;
    }

    const maxCount = Math.max(...buckets, 1);
    return buckets.map((count) => count / maxCount);
  }, [profits, min, max, bucketCount]);

  const leftFrac = toFraction(value[0], min, max);
  const rightFrac = toFraction(value[1], min, max);
  const leftPct = leftFrac * 100;
  const rightPct = rightFrac * 100;

  const getValueFromEvent = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return min;
      const rect = track.getBoundingClientRect();
      const frac = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(fromFraction(frac, min, max));
    },
    [min, max],
  );

  const handlePointerDown = useCallback(
    (which: "min" | "max") => (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragging(which);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const val = getValueFromEvent(e.clientX);
      if (dragging === "min") {
        onChange([Math.min(val, value[1]), value[1]]);
      } else {
        onChange([value[0], Math.max(val, value[0])]);
      }
    },
    [dragging, getValueFromEvent, onChange, value],
  );

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  // Click on track to move nearest thumb
  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      const val = getValueFromEvent(e.clientX);
      const distToMin = Math.abs(val - value[0]);
      const distToMax = Math.abs(val - value[1]);
      if (distToMin <= distToMax) {
        onChange([Math.min(val, value[1]), value[1]]);
      } else {
        onChange([value[0], Math.max(val, value[0])]);
      }
    },
    [getValueFromEvent, onChange, value],
  );

  return (
    <div className="flex-1 min-w-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Profit Range
        </span>
        <span className="text-xs font-semibold tabular-nums text-primary">
          {Math.round(value[0]).toLocaleString()}{currencySuffix} – {Math.round(value[1]).toLocaleString()}{currencySuffix}
        </span>
      </div>

      {/* Track area */}
      <div
        ref={trackRef}
        className="relative h-14 rounded-lg border border-border/40 bg-background/50 cursor-pointer select-none touch-none"
        onClick={handleTrackClick}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Histogram bars */}
        <div className="absolute inset-x-1 bottom-0 top-0 flex items-end gap-0.5 py-1 pointer-events-none">
          {histogram.map((h, i) => {
            const barLeft = (i / bucketCount) * 100;
            const barRight = ((i + 1) / bucketCount) * 100;
            const inRange = barRight >= leftPct && barLeft <= rightPct;
            const isEmpty = h <= 0.01;
            return (
              <div
                key={i}
                className="flex-1 rounded-t transition-colors duration-75"
                style={{
                  height: isEmpty ? "0%" : `${Math.max(h * 100, 8)}%`,
                  backgroundColor: isEmpty
                    ? "transparent"
                    : inRange
                      ? "rgba(196, 119, 42, 0.75)"
                      : "rgba(196, 119, 42, 0.15)",
                }}
              />
            );
          })}
        </div>

        {/* Selected range overlay */}
        <div
          className="absolute top-0 bottom-0 bg-primary/5 border-x border-primary/30 pointer-events-none"
          style={{
            left: `${leftPct}%`,
            width: `${rightPct - leftPct}%`,
          }}
        />

        {/* Min thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-5 h-5 rounded-full bg-primary border-2 border-background shadow-[0_0_6px_rgba(196,119,42,0.6)] cursor-grab active:cursor-grabbing active:scale-110 transition-transform ${dragging === "min" ? "scale-110 shadow-[0_0_10px_rgba(196,119,42,0.8)]" : "hover:scale-105"}`}
          style={{ left: `${leftPct}%` }}
          onPointerDown={handlePointerDown("min")}
        />

        {/* Max thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-5 h-5 rounded-full bg-primary border-2 border-background shadow-[0_0_6px_rgba(196,119,42,0.6)] cursor-grab active:cursor-grabbing active:scale-110 transition-transform ${dragging === "max" ? "scale-110 shadow-[0_0_10px_rgba(196,119,42,0.8)]" : "hover:scale-105"}`}
          style={{ left: `${rightPct}%` }}
          onPointerDown={handlePointerDown("max")}
        />
      </div>
    </div>
  );
}
