// ---------------------------------------------------------------------------
// Types, config, and pure logic for the league page
// ---------------------------------------------------------------------------

import type { ProfitTableRowDto } from "@/lib/types/api";

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

export type SortKey =
  | "setChaosPrice"
  | "chaosProfit"
  | "rewardChaosPrice"
  | "cardChaosPrice"
  | "margin";
export type SortDir = "asc" | "desc";

export function getMargin(row: ProfitTableRowDto): number {
  return row.setChaosPrice > 0
    ? row.chaosProfit / row.setChaosPrice
    : -Infinity;
}

export function getSortValue(row: ProfitTableRowDto, key: SortKey): number {
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

export function sortRows(
  rows: ProfitTableRowDto[],
  key: SortKey,
  dir: SortDir,
): ProfitTableRowDto[] {
  return [...rows].sort((a, b) => {
    const diff = getSortValue(a, key) - getSortValue(b, key);
    if (isNaN(diff)) return 0;
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

export function filterRows(
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
    if (row.chaosProfit > profitMax) return false;
    return true;
  });
}

// ---------------------------------------------------------------------------
// View presets
// ---------------------------------------------------------------------------

export type ColumnId =
  | "stack"
  | "unit"
  | "setCost"
  | "reward"
  | "margin"
  | "profit"
  | "actions";
export type ViewPreset = "margin" | "full" | "detailed";

export const VIEW_PRESETS: Record<
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
