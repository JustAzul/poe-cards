import * as gtag from '../../../../lib/gtag';

import type { KeyStates, TableData } from '../../../../hooks/interfaces';
import { useEffect, useState } from 'react';

import SortTable from '../../../../hooks/sortTable';
import Tr from './Tr';

interface Props {
    setToHover: Function,
    leagueName: string,
    Items: Array<TableData>,
    toHover: KeyStates,
    SortKey: KeyStates,
    SortType: 0 | 1,
}

interface ToSearch {
  itemName: string;
  searchMaxValue: number;
}

function sendGoogleTagEvent({ itemName }: ToSearch, leagueName: string) {
  const o: any = {
    action: 'item_search',
    category: leagueName,
    label: itemName,
  };

  gtag.event(o);
}

function generateSearchQuery(toSearch: ToSearch) {
  // TODO: handle cards that rewards leveled gems

  return {
    query: {
      status: {
        option: 'onlineleague',
      },
      stats: [
        {
          type: 'and',
          filters: [],
        },
      ],
      term: toSearch.itemName,
    },
    sort: {
      price: 'asc',
    },
  };
}

function doSearch(toSearch: ToSearch, leagueName: string) {
  if (typeof window === 'undefined') return;

  const targetUrl = new URL(`https://www.pathofexile.com/trade/search/${leagueName}`);

  targetUrl
    .searchParams
    .append('q', JSON.stringify(
      generateSearchQuery(toSearch),
    ));

  //! we only get here if this is defined.
  // eslint-disable-next-line no-undef
  window.open(targetUrl.toString(), `${toSearch.itemName.trim()}_${leagueName.trim()}`.toLowerCase());
  sendGoogleTagEvent(toSearch, leagueName);
}

export default function thead({
  setToHover, toHover, leagueName, Items, SortKey = 'c9', SortType = 1,
}: Props) {
  const [LeagueItems, setLeagueItems] = useState<Array<TableData>>(Items);

  useEffect(() => {
    if (Items.length > 1) {
      const SortedTable = SortTable(Items, SortKey, SortType);
      setLeagueItems(SortedTable);
    }
  }, [SortKey, SortType]);

  return (
        <>
            {LeagueItems
              .map((Details) => <Tr key={Details.Card.name.trim()} doSearch={(toSearch:ToSearch) => doSearch(toSearch, leagueName)} setToHover={setToHover} toHover={toHover} Details={Details} />)
            }
        </>
  );
}
