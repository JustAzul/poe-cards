import { CSSProperties, useContext } from 'react';

import Contexts from '@/context';
import type { KeyStates } from '@/hooks/interfaces';
import TableStyles from '../../../table/index.module.css';
import Th from '../../../table/th';

interface Props {
    ShouldSticky: boolean,
    setToHover: Function,
    toHover: KeyStates,
}

export default function thead({
  setToHover, toHover, ShouldSticky,
}: Props) {
  const {
    navbarHeight, setSortKey, setSortType, sortKey, sortType,
  } = useContext(Contexts.leaguePageData);

  const StickyStyle: CSSProperties = {
    top: `${navbarHeight}px`,
  };

  return (
        <tr style={ShouldSticky ? StickyStyle : {}} className={`${TableStyles.row100} ${TableStyles.head} sticky-inner`}>

            <Th enableClick={false} SetMouseOver={setToHover} KeyState={toHover} SortKey={sortKey} SortType={sortType} _Key="c1">
                Card Name
            </Th>

            <Th enableClick={false} SetMouseOver={setToHover} KeyState={toHover} SortKey={sortKey} SortType={sortType} _Key="c2">
                Stack Size
            </Th>

            <Th enableClick={false} SetMouseOver={setToHover} KeyState={toHover} SortKey={sortKey} SortType={sortType} _Key="c3">
                Price (c)
            </Th>

            <Th enableClick={false} SetMouseOver={setToHover} KeyState={toHover} SortKey={sortKey} SortType={sortType} _Key="c4">
                Price (ex)
            </Th>

            <Th setSortKey={setSortKey} setSortType={setSortType} enableClick={true} SetMouseOver={setToHover} KeyState={toHover} SortKey={sortKey} SortType={sortType} _Key="c5">
                Set Price (c)
            </Th>

            <Th setSortKey={setSortKey} setSortType={setSortType} enableClick={true} SetMouseOver={setToHover} KeyState={toHover} SortKey={sortKey} SortType={sortType} _Key="c6">
                Set Price (ex)
            </Th>

            <Th enableClick={false} SetMouseOver={setToHover} KeyState={toHover} SortKey={sortKey} SortType={sortType} _Key="c7">
                Item Price (c)
            </Th>

            <Th enableClick={false} SetMouseOver={setToHover} KeyState={toHover} SortKey={sortKey} SortType={sortType} _Key="c8">
                Item Price (ex)
            </Th>

            <Th setSortKey={setSortKey} setSortType={setSortType} enableClick={true} SetMouseOver={setToHover} KeyState={toHover} SortKey={sortKey} SortType={sortType} _Key="c9">
                Profit (c)
            </Th>

            <Th setSortKey={setSortKey} setSortType={setSortType} enableClick={true} SetMouseOver={setToHover} KeyState={toHover} SortKey={sortKey} SortType={sortType} _Key="c10">
                Profit (ex)
            </Th>

        </tr>
  );
}
