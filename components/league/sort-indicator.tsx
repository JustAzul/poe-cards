import type { SortDir } from "@/lib/league-utils";

export function SortIndicator({
  active,
  dir,
}: {
  active: boolean;
  dir: SortDir;
}) {
  if (!active)
    return <span className="ml-1 opacity-30">{"\u25B2\u25BC"}</span>;
  return <span className="ml-1">{dir === "asc" ? "\u25B2" : "\u25BC"}</span>;
}
