import { useState, useEffect } from 'react';
import Tr from './Tr';

import HiddenForm from '../../../HiddenForm';
import SortTable from '../../../../hooks/sortTable';
import * as gtag from '../../../../lib/gtag';

import type { KeyStates, TableData } from '../../../../hooks/interfaces';

interface Props {
    setToHover: Function,
    leagueName: string,
    Items: Array<TableData>,
    toHover: KeyStates,
    SortKey: KeyStates,
    SortType: 0 | 1,
}

export default function thead({
  setToHover, toHover, leagueName, Items, SortKey = 'c9', SortType = 1,
}: Props) {
  const [SearchString, setSearchString] = useState<string>('');
  // eslint-disable-next-line no-undef
  const [PoeTradeRef, setPoeTradeRef] = useState<HTMLFormElement>();
  const [SearchMaxValue, setSearchMaxValue] = useState<number>(0);
  const [LeagueItems, setLeagueItems] = useState<Array<TableData>>(Items);

  useEffect(() => {
    if (Items.length > 1) {
      const SortedTable = SortTable(Items, SortKey, SortType);
      setLeagueItems(SortedTable);
    }
  }, [SortKey, SortType]);

  const doSearch = (toSearch: string, maxValue: number) => {
    setSearchString(toSearch);
    setSearchMaxValue(maxValue);
    process.nextTick(() => PoeTradeRef && PoeTradeRef.submit());

    {
      const o: any = {
        action: 'item_search',
        category: leagueName,
        label: toSearch,
      };

      gtag.event(o);
    }
  };

  return (
        <>
            <HiddenForm PoeTrade={true} setFormRef={setPoeTradeRef} maxPrice={SearchMaxValue} leagueName={leagueName} SearchString={SearchString} />
            {LeagueItems
              .map((Details) => <Tr key={Details.Card.name.trim()} doSearch={doSearch} setToHover={setToHover} toHover={toHover} Details={Details} />)
            }
        </>
  );
}
