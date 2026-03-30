"use client";

import { useEffect, useRef } from "react";
import type { LeagueDataResponse } from "@/lib/types/api";

const INITIAL_INTERVAL_MS = 60_000;       // 60 seconds
const MAX_INTERVAL_MS = 900_000;          // 15 minutes

export function useSmartPolling(
  fetchFn: () => Promise<LeagueDataResponse>,
  onData: (data: LeagueDataResponse) => void,
) {
  const intervalRef = useRef(INITIAL_INTERVAL_MS);
  const lastUpdatedAtRef = useRef<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onDataRef = useRef(onData);

  // Keep onData ref current so the closure never goes stale
  useEffect(() => {
    onDataRef.current = onData;
  });

  useEffect(() => {
    let cancelled = false;

    function schedule(delayMs: number) {
      timeoutRef.current = setTimeout(async () => {
        if (cancelled) return;

        try {
          const result = await fetchFn();
          if (cancelled) return;

          if (result.updatedAt !== lastUpdatedAtRef.current) {
            // Data changed — deliver update and reset interval
            lastUpdatedAtRef.current = result.updatedAt;
            intervalRef.current = INITIAL_INTERVAL_MS;
            onDataRef.current(result);
          } else {
            // No change — double the interval, capped at max
            intervalRef.current = Math.min(
              intervalRef.current * 2,
              MAX_INTERVAL_MS,
            );
          }
        } catch {
          // On error keep current interval and retry on next tick
        }

        if (!cancelled) {
          schedule(intervalRef.current);
        }
      }, delayMs);
    }

    schedule(intervalRef.current);

    return () => {
      cancelled = true;
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
    // fetchFn identity is expected to be stable (defined inline in page component
    // with useCallback or recreated on name change — the effect re-runs on name
    // change because the parent useEffect resets state, which is sufficient).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFn]);
}
