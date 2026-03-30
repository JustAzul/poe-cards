export interface ProfitTableRowDto {
  card: {
    name: string;
    stack: number;
    chaosPrice: number;
    details: {
      artFilename: string;
      rewardName: string;
      rewardClass: number | null;
      isCorrupted: boolean;
      flavour: string;
    };
  };
  reward: { name: string; chaosPrice: number };
  setChaosPrice: number;
  chaosProfit: number;
  isCurrency: boolean;
}

export interface CurrencyRatesDto {
  exalted: number;
  divine: number;
  annul: number;
  mirror: number;
}

export interface LeagueDataResponse {
  data: ProfitTableRowDto[];
  currencyRates: CurrencyRatesDto;
  updatedAt: string;
  entryCount: number;
}

export interface LeaguesListResponse {
  leagues: string[];
}

export interface ApiErrorResponse {
  error: string;
}
