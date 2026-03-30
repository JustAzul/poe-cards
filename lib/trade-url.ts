// Build URL for searching a divination card on PoE trade
export function buildCardTradeUrl(league: string, cardName: string): string {
  const query = {
    query: {
      type: "Divination Card",
      name: cardName,
    },
  };
  return `https://www.pathofexile.com/trade/search/${encodeURIComponent(league)}?q=${encodeURIComponent(JSON.stringify(query))}`;
}

// Build URL for searching the reward item on PoE trade
export function buildRewardTradeUrl(
  league: string,
  rewardName: string,
  isCorrupted: boolean,
): string {
  const query: Record<string, unknown> = {
    query: {
      name: rewardName,
      filters: {},
    },
  };
  if (isCorrupted) {
    (query.query as Record<string, unknown>).filters = {
      misc_filters: {
        filters: {
          corrupted: { option: true },
        },
      },
    };
  }
  return `https://www.pathofexile.com/trade/search/${encodeURIComponent(league)}?q=${encodeURIComponent(JSON.stringify(query))}`;
}

// Build URL for viewing a card on poe.ninja
export function buildPoeNinjaUrl(league: string, cardName: string): string {
  return `https://poe.ninja/economy/${encodeURIComponent(league.toLowerCase())}/divination-cards?name=${encodeURIComponent(cardName)}`;
}
