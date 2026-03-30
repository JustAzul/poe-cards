"use client";

import { formatValue } from "@/lib/format";
import type { CurrencyMode } from "@/lib/format";
import { CURRENCY_ICONS } from "@/components/currency-bar";

const CHAOS_ICON = CURRENCY_ICONS.Chaos;
const DIVINE_ICON = CURRENCY_ICONS.Divine;

export function CurrencyValue({
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

export function ProfitCell({
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
  const prefix = isPositive ? "+" : "";
  const colorClass = isPositive
    ? "text-green-400"
    : isNegative
      ? "text-red-400"
      : "text-muted-foreground";
  const icon = mode === "chaos" ? CHAOS_ICON : DIVINE_ICON;
  const formatted = formatValue(value, mode, divineRate);
  const showPrefix = formatted !== "\u2014";
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-semibold tabular-nums ${colorClass}`}
    >
      {showPrefix ? prefix : ""}
      {formatted}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" className="h-4 w-4" />
    </span>
  );
}

export function MarginCell({
  setCost,
  profit,
}: {
  setCost: number;
  profit: number;
}) {
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
