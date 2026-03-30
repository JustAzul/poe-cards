"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchLeagues } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [leagues, setLeagues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeagues()
      .then((res) => setLeagues(res.leagues))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load leagues");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <p className="mb-8 text-sm text-muted-foreground">
        Find profitable divination card turn-ins
      </p>

      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {!loading && !error && leagues.length === 0 && (
        <p className="text-muted-foreground">No leagues available</p>
      )}

      {!loading && !error && leagues.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {leagues.map((league) => (
            <Link key={league} href={`/league/${league}`} className="group">
              <div className="relative overflow-hidden rounded-lg border border-border/60 bg-card px-5 py-4 shadow-sm shadow-black/20 transition-all duration-200 hover:border-primary/50 hover:bg-accent hover:shadow-md hover:shadow-primary/5 group-hover:translate-y-[-2px]">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
                <h3 className="font-semibold text-foreground">{league}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  View profit table &rarr;
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
