import type { CurrencyRatesDto } from "@/lib/types/api";

interface CurrencyBarProps {
  currencyRates: CurrencyRatesDto;
}

const CURRENCY_ICONS: Record<string, string> = {
  Divine:
    "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyModValues.png",
  Exalted:
    "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyAddModToRare.png",
  Annulment:
    "https://web.poecdn.com/image/Art/2DItems/Currency/AnnullOrb.png",
  Mirror:
    "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyDuplicate.png",
  Chaos:
    "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png",
};

function formatRate(value: number): string {
  if (value >= 1000) return `${Math.round(value).toLocaleString("en-US")}c`;
  if (value >= 10) return `${Math.round(value)}c`;
  return `${value.toFixed(1)}c`;
}

interface CurrencyItem {
  label: string;
  value: number;
}

export function CurrencyBar({ currencyRates }: CurrencyBarProps) {
  const items: CurrencyItem[] = [
    { label: "Divine", value: currencyRates.divine },
    { label: "Exalted", value: currencyRates.exalted },
    { label: "Annulment", value: currencyRates.annul },
    { label: "Mirror", value: currencyRates.mirror },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map(({ label, value }) => (
        <div
          key={label}
          className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card px-3.5 py-2 shadow-sm shadow-black/20"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CURRENCY_ICONS[label]}
            alt=""
            className="h-8 w-8 drop-shadow-[0_0_4px_rgba(196,119,42,0.3)]"
          />
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[11px] text-muted-foreground">{label}</span>
            <span className="text-sm font-bold tabular-nums text-primary">
              {formatRate(value)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export { CURRENCY_ICONS };
