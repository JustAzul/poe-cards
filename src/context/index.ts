import {
  CurrencyValues,
  KeyStates,
  Leagues,
  TableData,
} from '@/hooks/interfaces';

import React, { createContext } from 'react';

interface LeagueData {
  navbarHeight: number,
  lastUpdatedDate: string,
  leagueName: string,
  splitsArray: Array<number>,
  currencyValues: CurrencyValues,
  cardsTable: Array<TableData>,
  sortKey: KeyStates,
  sortType: 0 | 1,
  setSortKey: React.Dispatch<React.SetStateAction<KeyStates>>,
  setSortType: React.Dispatch<React.SetStateAction<0 | 1>>
}

export default {
  leagueDetails: createContext<Leagues[]>([]),
  leaguePageData: createContext({} as LeagueData),
};
