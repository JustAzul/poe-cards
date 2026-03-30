// ---------------------------------------------------------------------------
// Currency formatting helpers
// ---------------------------------------------------------------------------

export type CurrencyMode = "chaos" | "divine";

export function formatChaos(value: number): string {
  if (Math.abs(value) >= 10) {
    return Math.round(value).toLocaleString("en-US");
  }
  return value.toFixed(1);
}

export function formatDivine(chaosValue: number, divineRate: number): string {
  if (divineRate <= 0) return "\u2014";
  const div = chaosValue / divineRate;
  if (Math.abs(div) >= 10) {
    return Math.round(div).toLocaleString("en-US");
  }
  return div.toFixed(1);
}

export function formatValue(
  chaosValue: number,
  mode: CurrencyMode,
  divineRate: number,
): string {
  return mode === "chaos"
    ? formatChaos(chaosValue)
    : formatDivine(chaosValue, divineRate);
}
