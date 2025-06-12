import {
  CurrencyValues,
  KeyStates,
  Leagues,
  TableData,
} from '@/hooks/interfaces';

import { createContext } from 'react';

interface LeagueData {
  navbarHeight: number,
  lastUpdatedDate: string,
  leagueName: string,
  splitsArray: Array<number>,
  currencyValues: CurrencyValues,
  cardsTable: Array<TableData>,
  sortKey: KeyStates,
  sortType: 0 | 1,
  setSortKey: Function,
  setSortType: Function
}

export default {
  leagueDetails: createContext<Leagues[]>([]),
  leaguePageData: createContext({} as LeagueData),
};
