import type {
  Card, CardDetail, Reward, TableData,
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
