import type {
  Card, CardDetail, LeagueDetails, Reward, TableData,
} from '../../hooks/interfaces';
import type { LeagueDataResponse, ProfitTableRowDto } from '../r2-client';

export type CurrencyRateEntry = {
  Name: string,
  chaosEquivalent: number,
};

export type MappedLeagueData = {
  Table: TableData[],
  LastUpdated: string,
  Currency: CurrencyRateEntry[],
};

const CURRENCY_ORB_NAMES = {
  exalted: 'Exalted Orb',
  divine: 'Divine Orb',
  annul: 'Orb of Annulment',
  mirror: 'Mirror of Kalandra',
} as const;

function mapCardDetail({ card }: ProfitTableRowDto): CardDetail {
  return {
    artFilename: card.details.artFilename,
    CardName: card.name,
    CardStack: card.stack,
    RewardName: card.details.rewardName,
    rewardClass: card.details.rewardClass,
    isCorrupted: card.details.isCorrupted,
    Flavour: card.details.flavour,
  };
}

function mapCard(dto: ProfitTableRowDto): Card {
  return {
    name: dto.card.name,
    stack: dto.card.stack,
    chaosprice: dto.card.chaosPrice,
    Details: mapCardDetail(dto),
  };
}

function mapReward({ reward }: ProfitTableRowDto): Reward {
  return {
    name: reward.name,
    chaosprice: reward.chaosPrice,
  };
}

function mapRow(dto: ProfitTableRowDto): TableData {
  return {
    Card: mapCard(dto),
    Reward: mapReward(dto),
    setchaosprice: dto.setChaosPrice,
    chaosprofit: dto.chaosProfit,
    isCurrency: dto.isCurrency,
  };
}

function mapCurrencyRates(rates: LeagueDataResponse['currencyRates']): CurrencyRateEntry[] {
  return [
    { Name: CURRENCY_ORB_NAMES.exalted, chaosEquivalent: rates.exalted },
    { Name: CURRENCY_ORB_NAMES.divine, chaosEquivalent: rates.divine },
    { Name: CURRENCY_ORB_NAMES.annul, chaosEquivalent: rates.annul },
    { Name: CURRENCY_ORB_NAMES.mirror, chaosEquivalent: rates.mirror },
  ];
}

export default function mapLeagueData(response: LeagueDataResponse): MappedLeagueData {
  return {
    Table: response.data.map(mapRow),
    LastUpdated: response.updatedAt,
    Currency: mapCurrencyRates(response.currencyRates),
  };
}

function getCurrencyChaosValue(rates: CurrencyRateEntry[], currencyName: string): number {
  return rates.find(({ Name }) => Name === currencyName)?.chaosEquivalent || 0;
}

/**
 * Final DTO→UI shape consumed by the league page, shared by both the SSG
 * path (`getStaticProps`) and the live-refetch API route (`/api/league-data`)
 * so the two never drift into computing currency conversions differently.
 */
export function buildLeagueDetails(response: LeagueDataResponse): LeagueDetails {
  const mapped = mapLeagueData(response);

  const exaltValue = getCurrencyChaosValue(mapped.Currency, CURRENCY_ORB_NAMES.exalted);
  const divineValue = getCurrencyChaosValue(mapped.Currency, CURRENCY_ORB_NAMES.divine);
  const annulValue = getCurrencyChaosValue(mapped.Currency, CURRENCY_ORB_NAMES.annul);

  const rawMirrorValue = getCurrencyChaosValue(mapped.Currency, CURRENCY_ORB_NAMES.mirror);
  const mirrorValue = exaltValue ? parseFloat((rawMirrorValue / exaltValue).toFixed(1)) : 0;

  return {
    ExaltValue: exaltValue,
    DivineValue: divineValue,
    AnullValue: annulValue,
    XMirrorValue: mirrorValue,
    LastUpdated: mapped.LastUpdated,
    Table: mapped.Table,
  };
}
