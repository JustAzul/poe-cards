"use client";

import { useState } from "react";

interface ChangeCalculatorProps {
  divineRate: number;
}

export function ChangeCalculator({ divineRate }: ChangeCalculatorProps) {
  const [open, setOpen] = useState(false);
  const [itemPrice, setItemPrice] = useState("");
  const [amount, setAmount] = useState("1");
  const [divPayment, setDivPayment] = useState("");

  const totalCost =
    (parseFloat(itemPrice) || 0) * (parseInt(amount, 10) || 1);
  const paid = (parseFloat(divPayment) || 0) * divineRate;
  const change = paid - totalCost;

  const inputClass =
    "w-24 rounded-md border border-border/60 bg-background px-2.5 py-1.5 text-right text-sm tabular-nums text-foreground placeholder:text-muted-foreground/40 focus:border-primary/60 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-colors";

  return (
    <div className="rounded-lg border border-border/60 bg-card shadow-sm shadow-black/20 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
      >
        <span>Change Calculator</span>
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
        <div className="border-t border-border/40 bg-background/50 px-4 py-3 space-y-3">
          <p className="text-xs font-medium text-primary">
            1 div = {Math.round(divineRate)}c
          </p>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">Item Price</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
                <span className="text-xs text-muted-foreground w-4">c</span>
              </div>
            </label>

            <label className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">Amount</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1"
                  className={inputClass}
                />
                <span className="w-4" />
              </div>
            </label>

            <label className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">Divine Payment</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={divPayment}
                  onChange={(e) => setDivPayment(e.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
                <span className="text-xs text-muted-foreground w-4">div</span>
              </div>
            </label>
          </div>

          <div className="rounded-md border border-border/40 bg-card px-3 py-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Change</span>
              <span
                className={`font-semibold tabular-nums ${
                  change > 0
                    ? "text-green-400"
                    : change < 0
                      ? "text-red-400"
                      : "text-foreground"
                }`}
              >
                {change !== 0 || paid > 0
                  ? `${change >= 0 ? "+" : ""}${change.toFixed(1)}c`
                  : "\u2014"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
