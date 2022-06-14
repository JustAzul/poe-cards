import * as gtag from '../../../../lib/gtag';

import type { KeyStates, TableData } from '../../../../hooks/interfaces';
import { useEffect, useState } from 'react';

import SortTable from '../../../../hooks/sortTable';
import { ToSearch } from './toSearch.interface';
import Tr from './Tr';

interface Props {
    setToHover: Function,
    leagueName: string,
    Items: Array<TableData>,
    toHover: KeyStates,
    SortKey: KeyStates,
    SortType: 0 | 1,
}

function sendGoogleTagEvent({ itemName }: ToSearch, leagueName: string) {
  const o: any = {
    action: 'item_search',
    category: leagueName,
    label: itemName,
  };

  gtag.event(o);
}

function generateSearchCardQuery(toSearch: ToSearch) {
  return {
    query: {
      filters: {
        type_filters: {
          filters: {
            category: {
              option: 'card',
            },
          },
        },
      },
      status: {
        option: 'onlineleague',
      },
      type: toSearch.itemName,
    },
    sort: {
      price: 'asc',
    },
  };
}

function generateSearchQuery(toSearch: ToSearch) {
  if (toSearch.isCard) return generateSearchCardQuery(toSearch);

  const result = {
    query: {
      filters: {
        misc_filters: {
          filters: {
            corrupted: {
              option: toSearch.isCorrupted || false,
            },
          },
        },
      },
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

  if (toSearch.itemName.includes('Level ')) {
    const split = toSearch.itemName.split(' ');

    // remove word 'Level'
    split.shift();

    const requiredLevel = split.shift();
    const itemName = split.join(' ');

    result.query.term = itemName;

    // @ts-expect-error no problem defining a undefined key here
    result.query.filters.misc_filters.filters.gem_level = {
      min: requiredLevel,
    };
  }

  return result;
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
              .map((Details) => <Tr
              key={Details.Card.name.trim()}
              doSearch={(toSearch:ToSearch) => doSearch(toSearch, leagueName)}
              setToHover={setToHover}
              toHover={toHover}
              Details={Details}
              />)
            }
        </>
  );
}
