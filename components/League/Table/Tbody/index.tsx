import { useState } from 'react';
import Tr from './Tr';

import HiddenForm from '../../../HiddenForm';

import type { KeyStates, Currency, TableData } from '../../../../hooks/interfaces';

interface Props {
    setToHover: Function,
    leagueName: string,
    Items: Array<TableData>,
    toHover: KeyStates
}

export default function thead({
  setToHover, toHover, leagueName, Items,
}: Props) {
  const [SearchString, setSearchString] = useState<string>('');
  const [PoeTradeRef, setPoeTradeRef] = useState<HTMLFormElement>();
  const [SearchCurrency, setSearchCurrency] = useState<Currency>('chaos');

  const doSearch = (toSearch: string, Currency: Currency = 'chaos') => {
    setSearchString(toSearch);
    setSearchCurrency(Currency);
    process.nextTick(() => {
      PoeTradeRef && PoeTradeRef.submit();
    });
  };

  return (
        <>
            <HiddenForm Currency={SearchCurrency} PoeTrade={true} setFormRef={setPoeTradeRef} leagueName={leagueName} SearchString={SearchString} />
            {Items.map((Details) => <Tr key={Details.Card.name.trim()} doSearch={doSearch} setToHover={setToHover} toHover={toHover} Details={Details} />)}
        </>
  );
}
