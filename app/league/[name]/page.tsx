"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { use } from "react";
import Image from "next/image";
import { fetchLeagueData } from "@/lib/api";
import type { ProfitTableRowDto, LeagueDataResponse } from "@/lib/types/api";
import {
  buildCardTradeUrl,
  buildRewardTradeUrl,
  buildPoeNinjaUrl,
} from "@/lib/trade-url";
import { CurrencyBar, CURRENCY_ICONS } from "@/components/currency-bar";
import { LastUpdated } from "@/components/last-updated";
import { DivineSplits } from "@/components/exalted-splits";
import { ChangeCalculator } from "@/components/change-calculator";
import { useSmartPolling } from "@/hooks/use-smart-polling";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardTooltip } from "@/components/card-tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ProfitRangeSlider } from "@/components/profit-range-slider";

// ---------------------------------------------------------------------------
// Currency icon URLs
// ---------------------------------------------------------------------------

const CHAOS_ICON = CURRENCY_ICONS.Chaos;
const DIVINE_ICON = CURRENCY_ICONS.Divine;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type CurrencyMode = "chaos" | "divine";

function formatChaos(value: number): string {
  if (Math.abs(value) >= 10) {
    return Math.round(value).toLocaleString("en-US");
  }
  return value.toFixed(1);
}

function formatDivine(chaosValue: number, divineRate: number): string {
  if (divineRate <= 0) return "\u2014";
  const div = chaosValue / divineRate;
  if (Math.abs(div) >= 10) {
    return Math.round(div).toLocaleString("en-US");
  }
  return div.toFixed(1);
}

function formatValue(
  chaosValue: number,
  mode: CurrencyMode,
  divineRate: number,
): string {
  return mode === "chaos"
    ? formatChaos(chaosValue)
    : formatDivine(chaosValue, divineRate);
}

function CurrencyValue({
  chaosValue,
  mode,
  divineRate,
}: {
  chaosValue: number;
  mode: CurrencyMode;
  divineRate: number;
}) {
  const icon = mode === "chaos" ? CHAOS_ICON : DIVINE_ICON;
  return (
    <span className="inline-flex items-center gap-1">
      {formatValue(chaosValue, mode, divineRate)}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" className="h-4 w-4" />
    </span>
  );
}

function ProfitCell({
  value,
  mode,
  divineRate,
}: {
  value: number;
  mode: CurrencyMode;
  divineRate: number;
}) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const prefix = isPositive ? "+" : isNegative ? "" : "";
  const colorClass = isPositive
    ? "text-green-400"
    : isNegative
      ? "text-red-400"
      : "text-muted-foreground";
  const icon = mode === "chaos" ? CHAOS_ICON : DIVINE_ICON;
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-semibold tabular-nums ${colorClass}`}
    >
      {prefix}
      {formatValue(value, mode, divineRate)}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" className="h-4 w-4" />
    </span>
  );
}

function MarginCell({ setCost, profit }: { setCost: number; profit: number }) {
  if (setCost <= 0)
    return <span className="text-muted-foreground">{"\u2014"}</span>;
  const pct = (profit / setCost) * 100;
  const isPositive = pct > 0;
  const isNegative = pct < 0;
  const colorClass = isPositive
    ? "text-green-400"
    : isNegative
      ? "text-red-400"
      : "text-muted-foreground";
  const prefix = isPositive ? "+" : "";
  const display =
    Math.abs(pct) >= 10
      ? `${prefix}${Math.round(pct)}%`
      : `${prefix}${pct.toFixed(1)}%`;
  return (
    <span className={`text-sm font-semibold tabular-nums ${colorClass}`}>
      {display}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

type SortKey =
  | "setChaosPrice"
  | "chaosProfit"
  | "rewardChaosPrice"
  | "cardChaosPrice"
  | "margin";
type SortDir = "asc" | "desc";

function getMargin(row: ProfitTableRowDto): number {
  return row.setChaosPrice > 0
    ? row.chaosProfit / row.setChaosPrice
    : -Infinity;
}

function getSortValue(row: ProfitTableRowDto, key: SortKey): number {
  switch (key) {
    case "setChaosPrice":
      return row.setChaosPrice;
    case "chaosProfit":
      return row.chaosProfit;
    case "rewardChaosPrice":
      return row.reward.chaosPrice;
    case "cardChaosPrice":
      return row.card.chaosPrice;
    case "margin":
      return getMargin(row);
  }
}

function sortRows(
  rows: ProfitTableRowDto[],
  key: SortKey,
  dir: SortDir,
): ProfitTableRowDto[] {
  return [...rows].sort((a, b) => {
    const diff = getSortValue(a, key) - getSortValue(b, key);
    if (diff !== 0) return dir === "asc" ? diff : -diff;
    // Tiebreaker: raw profit (same direction)
    if (key === "margin") {
      const profitDiff = a.chaosProfit - b.chaosProfit;
      return dir === "asc" ? profitDiff : -profitDiff;
    }
    return 0;
  });
}

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

function filterRows(
  rows: ProfitTableRowDto[],
  nameFilter: string,
  profitMin: number,
  profitMax: number,
): ProfitTableRowDto[] {
  return rows.filter((row) => {
    if (
      nameFilter &&
      !row.card.name.toLowerCase().includes(nameFilter.toLowerCase())
    ) {
      return false;
    }
    if (row.chaosProfit < profitMin) return false;
    if (profitMax < Infinity && row.chaosProfit > profitMax) return false;
    return true;
  });
}

// ---------------------------------------------------------------------------
// View presets
// ---------------------------------------------------------------------------

type ColumnId =
  | "stack"
  | "unit"
  | "setCost"
  | "reward"
  | "margin"
  | "profit"
  | "actions";
type ViewPreset = "margin" | "full" | "detailed";

const VIEW_PRESETS: Record<
  ViewPreset,
  { label: string; columns: ColumnId[]; defaultSort: SortKey; minWidth: string }
> = {
  margin: {
    label: "Margin",
    columns: ["stack", "setCost", "margin", "profit", "actions"],
    defaultSort: "margin",
    minWidth: "min-w-[700px]",
  },
  full: {
    label: "Full",
    columns: [
      "stack",
      "unit",
      "setCost",
      "reward",
      "margin",
      "profit",
      "actions",
    ],
    defaultSort: "margin",
    minWidth: "min-w-[1000px]",
  },
  detailed: {
    label: "Detailed",
    columns: ["stack", "unit", "setCost", "reward", "profit", "actions"],
    defaultSort: "chaosProfit",
    minWidth: "min-w-[900px]",
  },
};

// ---------------------------------------------------------------------------
// Card thumbnail with error fallback
// ---------------------------------------------------------------------------

function CardThumb({
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

// ---------------------------------------------------------------------------
// Table skeleton (loading state)
// ---------------------------------------------------------------------------

function TableSkeleton() {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-72" />
      </div>
      <div className="space-y-0">
        <div className="flex gap-4 border-b border-border pb-2 mb-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-2 border-b border-border/40">
            {Array.from({ length: 6 }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sort indicator
// ---------------------------------------------------------------------------

function SortIndicator({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active)
    return <span className="ml-1 opacity-30">{"\u25B2\u25BC"}</span>;
  return <span className="ml-1">{dir === "asc" ? "\u25B2" : "\u25BC"}</span>;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface LeaguePageProps {
  params: Promise<{ name: string }>;
}

export default function LeaguePage({ params }: LeaguePageProps) {
  const { name } = use(params);
  const leagueName = decodeURIComponent(name);

  const [data, setData] = useState<LeagueDataResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // View preset
  const [viewPreset, setViewPreset] = useState<ViewPreset>("margin");

  // Sort state — default follows preset
  const [sortKey, setSortKey] = useState<SortKey>("margin");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Filter state
  const [nameFilter, setNameFilter] = useState("");
  const [profitRange, setProfitRange] = useState<[number, number]>([
    -100000, 100000,
  ]);

  // Currency display mode
  const [currencyMode, setCurrencyMode] = useState<CurrencyMode>("chaos");

  // Column hover tracking
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const activePreset = VIEW_PRESETS[viewPreset];
  const visibleColumns = activePreset.columns;

  function handlePresetChange(preset: ViewPreset) {
    setViewPreset(preset);
    setSortKey(VIEW_PRESETS[preset].defaultSort);
    setSortDir("desc");
  }

  function hasCol(col: ColumnId): boolean {
    return visibleColumns.includes(col);
  }

  useEffect(() => {
    document.title = `POE Cards \u2014 ${leagueName}`;
    document.body.classList.add("has-league-navbar");
    return () => document.body.classList.remove("has-league-navbar");
  }, [leagueName]);

  const loadData = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchLeagueData(name)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          const profits = result.data.map((r) => r.chaosProfit);
          const minProfit = Math.min(...profits, 0);
          const maxProfit = Math.max(...profits, 0);
          setProfitRange([Math.floor(minProfit), Math.ceil(maxProfit)]);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [name]);

  useEffect(() => {
    return loadData();
  }, [loadData]);

  const allProfits = useMemo(() => {
    if (!data) return [];
    return data.data.map((r) => r.chaosProfit);
  }, [data]);

  const minProfitValue = useMemo(() => {
    if (!data) return -100000;
    return Math.min(...data.data.map((r) => r.chaosProfit), 0);
  }, [data]);

  const maxProfitValue = useMemo(() => {
    if (!data) return 100000;
    return Math.max(...data.data.map((r) => r.chaosProfit), 0);
  }, [data]);

  const filteredAndSorted = useMemo(() => {
    if (!data) return [];
    const filtered = filterRows(
      data.data,
      nameFilter,
      profitRange[0],
      profitRange[1],
    );
    return sortRows(filtered, sortKey, sortDir);
  }, [data, nameFilter, profitRange, sortKey, sortDir]);

  const fetchFn = useCallback(() => fetchLeagueData(name), [name]);
  useSmartPolling(fetchFn, setData);

  function handleSortToggle(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  // ------------------------------------------------------------------
  // States
  // ------------------------------------------------------------------

  if (loading) return <TableSkeleton />;

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <p className="text-destructive font-medium">Failed to load data</p>
        <p className="text-muted-foreground text-sm">{error}</p>
        <Button variant="outline" onClick={loadData}>
          Try again
        </Button>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <p className="text-muted-foreground">
          No profitable opportunities found
        </p>
      </div>
    );
  }

  const divineRate = data.currencyRates.divine;

  // Total visible columns = 1 (Card) + visible optional columns
  const totalCols = 1 + visibleColumns.length;

  // ------------------------------------------------------------------
  // Sortable header helper
  // ------------------------------------------------------------------

  const colGlow = "text-primary [text-shadow:0_0_8px_rgba(196,119,42,0.4)]";
  const colActive = "text-green-400";

  function SortableHead({
    label,
    sortKeyVal,
    colIndex,
  }: {
    label: string;
    sortKeyVal: SortKey;
    colIndex: number;
  }) {
    const isActive = sortKey === sortKeyVal;
    const isGlowing = hoveredCol === colIndex;
    return (
      <TableHead
        className={`text-right text-sm font-bold uppercase tracking-wide cursor-pointer select-none transition-all duration-150 hover:text-foreground ${
          isGlowing
            ? colGlow
            : isActive
              ? colActive
              : "text-foreground/80"
        }`}
        onClick={() => handleSortToggle(sortKeyVal)}
      >
        {label}
        <SortIndicator active={isActive} dir={sortDir} />
      </TableHead>
    );
  }

  function PlainHead({
    label,
    colIndex,
    align = "right",
  }: {
    label: string;
    colIndex: number;
    align?: "left" | "right" | "center";
  }) {
    const textAlign =
      align === "center"
        ? "text-center"
        : align === "left"
          ? "text-left"
          : "text-right";
    return (
      <TableHead
        className={`${textAlign} text-sm font-bold uppercase tracking-wide transition-all duration-150 ${hoveredCol === colIndex ? colGlow : "text-foreground/80"}`}
      >
        {label}
      </TableHead>
    );
  }

  // ------------------------------------------------------------------
  // Column index tracking (dynamic based on visible columns)
  // ------------------------------------------------------------------

  // Card is always col 0. Then each visible column gets an incrementing index.
  function colIdx(col: ColumnId): number {
    return 1 + visibleColumns.indexOf(col);
  }

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  const inputClass =
    "rounded-md border border-border/60 bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/60 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors";

  return (
    <div className="p-4 sm:p-6">
      {/* Full navbar — fixed at top, replaces layout header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 px-4 py-2 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-base sm:text-lg font-bold tracking-tight whitespace-nowrap">
              <span className="text-primary">{"\u25C6"}</span>{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                POE Cards
              </span>
            </h1>
            <div className="h-4 w-px bg-border/60 hidden sm:block" />
            <span className="text-sm font-semibold truncate hidden sm:inline">
              {leagueName}
            </span>
            <span className="text-xs text-muted-foreground hidden md:inline">
              ({data.entryCount} cards)
            </span>
            <span className="hidden lg:inline">
              <LastUpdated updatedAt={data.updatedAt} />
            </span>
          </div>
          <div className="hidden sm:block">
            <CurrencyBar currencyRates={data.currencyRates} />
          </div>
        </div>
      </div>
      {/* Spacer for fixed navbar */}
      <div className="h-[48px] sm:h-[52px]" />

      {/* Mobile: league info + currency bar */}
      <div className="sm:hidden mb-3">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-sm font-semibold">{leagueName}</span>
          <span className="text-xs text-muted-foreground">
            ({data.entryCount} cards)
          </span>
          <LastUpdated updatedAt={data.updatedAt} />
        </div>
        <div className="-mx-4 px-4 overflow-x-auto">
          <CurrencyBar currencyRates={data.currencyRates} />
        </div>
      </div>

      {/* Compact utilities + filters row */}
      <div className="mb-4 flex flex-wrap items-start gap-3">
        <DivineSplits divineRate={data.currencyRates.divine} />
        <ChangeCalculator divineRate={data.currencyRates.divine} />
      </div>

      {/* Filter bar */}
      <div className="mb-4 rounded-lg border border-border/40 bg-card/50 p-3">
        <div className="flex flex-wrap items-end gap-4">
          {/* Search */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder={"Card name\u2026"}
                className={`${inputClass} w-44 pl-8`}
              />
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
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>

          {/* Profit range slider with histogram */}
          <ProfitRangeSlider
            profits={allProfits}
            min={Math.floor(minProfitValue)}
            max={Math.ceil(maxProfitValue)}
            value={profitRange}
            onChange={setProfitRange}
            currencySuffix={currencyMode === "chaos" ? "c" : "div"}
          />

          {/* View preset */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              View
            </label>
            <select
              value={viewPreset}
              onChange={(e) =>
                handlePresetChange(e.target.value as ViewPreset)
              }
              className={`${inputClass} cursor-pointer`}
            >
              <option value="margin">Margin</option>
              <option value="full">Full</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>

          {/* Currency type */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Currency
            </label>
            <select
              value={currencyMode}
              onChange={(e) =>
                setCurrencyMode(e.target.value as CurrencyMode)
              }
              className={`${inputClass} cursor-pointer`}
            >
              <option value="chaos">Chaos</option>
              <option value="divine">Divine</option>
            </select>
          </div>

          {/* Count */}
          {filteredAndSorted.length !== data.data.length && (
            <span className="text-xs text-muted-foreground pb-1.5">
              {filteredAndSorted.length} / {data.data.length}
            </span>
          )}
        </div>
      </div>

      {/* Data table */}
      <div className="rounded-lg border border-border/40 shadow-sm shadow-black/20">
        <Table className={activePreset.minWidth}>
          <TableHeader>
            <TableRow className="border-b-2 border-b-primary/30 bg-card hover:bg-card">
              {/* Card — always visible */}
              <PlainHead label="Card" colIndex={0} align="left" />

              {hasCol("stack") && (
                <PlainHead label="Stack" colIndex={colIdx("stack")} />
              )}
              {hasCol("unit") && (
                <SortableHead
                  label="Unit"
                  sortKeyVal="cardChaosPrice"
                  colIndex={colIdx("unit")}
                />
              )}
              {hasCol("setCost") && (
                <SortableHead
                  label="Set Cost"
                  sortKeyVal="setChaosPrice"
                  colIndex={colIdx("setCost")}
                />
              )}
              {hasCol("reward") && (
                <SortableHead
                  label="Reward"
                  sortKeyVal="rewardChaosPrice"
                  colIndex={colIdx("reward")}
                />
              )}
              {hasCol("margin") && (
                <SortableHead
                  label="Margin"
                  sortKeyVal="margin"
                  colIndex={colIdx("margin")}
                />
              )}
              {hasCol("profit") && (
                <SortableHead
                  label="Profit"
                  sortKeyVal="chaosProfit"
                  colIndex={colIdx("profit")}
                />
              )}
              {hasCol("actions") && (
                <PlainHead
                  label="Actions"
                  colIndex={colIdx("actions")}
                  align="center"
                />
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.map((row) => (
              <TableRow
                key={row.card.name}
                className="group transition-all duration-100 hover:bg-accent border-l-3 border-l-transparent hover:border-l-primary hover:shadow-[inset_0_0_20px_rgba(196,119,42,0.04)] even:bg-card/30"
                onMouseLeave={() => setHoveredCol(null)}
              >
                {/* Card — always visible */}
                <TableCell
                  className="py-2"
                  onMouseEnter={() => setHoveredCol(0)}
                >
                  <div className="flex items-center gap-2">
                    <CardThumb
                      artFilename={row.card.details.artFilename}
                      name={row.card.name}
                    />
                    <CardTooltip card={row.card}>
                      <a
                        href={buildCardTradeUrl(leagueName, row.card.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-offset-2 hover:underline text-foreground group-hover:text-primary transition-colors text-sm font-medium"
                      >
                        {row.card.name}
                      </a>
                    </CardTooltip>
                    {row.isCurrency && (
                      <span className="ml-0.5 rounded px-1 py-0.5 text-[10px] font-semibold uppercase leading-none bg-amber-900/40 text-amber-400 border border-amber-700/40">
                        Currency
                      </span>
                    )}
                  </div>
                </TableCell>

                {hasCol("stack") && (
                  <TableCell
                    className="text-right tabular-nums py-2 text-sm font-semibold"
                    onMouseEnter={() => setHoveredCol(colIdx("stack"))}
                  >
                    {row.card.stack}
                  </TableCell>
                )}

                {hasCol("unit") && (
                  <TableCell
                    className="text-right tabular-nums py-2 text-sm"
                    onMouseEnter={() => setHoveredCol(colIdx("unit"))}
                  >
                    <CurrencyValue
                      chaosValue={row.card.chaosPrice}
                      mode={currencyMode}
                      divineRate={divineRate}
                    />
                  </TableCell>
                )}

                {hasCol("setCost") && (
                  <TableCell
                    className="text-right tabular-nums py-2 text-sm"
                    onMouseEnter={() => setHoveredCol(colIdx("setCost"))}
                  >
                    <CurrencyValue
                      chaosValue={row.setChaosPrice}
                      mode={currencyMode}
                      divineRate={divineRate}
                    />
                  </TableCell>
                )}

                {hasCol("reward") && (
                  <TableCell
                    className="text-right tabular-nums py-2 text-sm"
                    onMouseEnter={() => setHoveredCol(colIdx("reward"))}
                  >
                    <CurrencyValue
                      chaosValue={row.reward.chaosPrice}
                      mode={currencyMode}
                      divineRate={divineRate}
                    />
                  </TableCell>
                )}

                {hasCol("margin") && (
                  <TableCell
                    className="text-right py-2"
                    onMouseEnter={() => setHoveredCol(colIdx("margin"))}
                  >
                    <MarginCell
                      setCost={row.setChaosPrice}
                      profit={row.chaosProfit}
                    />
                  </TableCell>
                )}

                {hasCol("profit") && (
                  <TableCell
                    className="text-right py-2"
                    onMouseEnter={() => setHoveredCol(colIdx("profit"))}
                  >
                    <ProfitCell
                      value={row.chaosProfit}
                      mode={currencyMode}
                      divineRate={divineRate}
                    />
                  </TableCell>
                )}

                {hasCol("actions") && (
                  <TableCell
                    className="py-2"
                    onMouseEnter={() => setHoveredCol(colIdx("actions"))}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <a
                        href={buildRewardTradeUrl(
                          leagueName,
                          row.reward.name,
                          row.card.details.isCorrupted,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all shadow-sm shadow-black/10"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7 7h10v10" />
                          <path d="M7 17 17 7" />
                        </svg>
                        Trade
                      </a>
                      <a
                        href={buildPoeNinjaUrl(leagueName, row.card.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all shadow-sm shadow-black/10"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Poe.ninja
                      </a>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {filteredAndSorted.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={totalCols}
                  className="py-8 text-center text-muted-foreground"
                >
                  No cards match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
