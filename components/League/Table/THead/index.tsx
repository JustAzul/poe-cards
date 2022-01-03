import { CSSProperties } from 'react';
import TableStyles from '../../../Table/index.module.css';
import Th from '../../../Table/Th';

import type { KeyStates } from '../../../../hooks/interfaces';

interface Props {
    NavbarHeight: number,
    setToHover: Function,
    ShouldSticky: Boolean,
    toHover: KeyStates,
    SortKey?: KeyStates,
    SortType?: 0 | 1,
    setSortKey: Function,
    setSortType: Function
}

export default function thead({
  setToHover, toHover, ShouldSticky, NavbarHeight, SortKey = 'c9', SortType = 1, setSortKey, setSortType,
}: Props) {
  const StickyStyle: CSSProperties = {
    top: `${NavbarHeight}px`,
  };

  return (
        <tr style={ShouldSticky ? StickyStyle : {}} className={`${TableStyles.row100} ${TableStyles.head} sticky-inner`}>

            <Th /* setSortKey={setSortKey} setSortType={setSortType} */ enableClick={false} SetMouseOver={setToHover} KeyState={toHover} SortKey={SortKey} SortType={SortType} _Key="c1">
                Card Name
            </Th>

            <Th /* setSortKey={setSortKey} setSortType={setSortType} */ enableClick={false} SetMouseOver={setToHover} KeyState={toHover} SortKey={SortKey} SortType={SortType} _Key="c2">
                Stack Size
            </Th>

            <Th /* setSortKey={setSortKey} setSortType={setSortType} */ enableClick={false} SetMouseOver={setToHover} KeyState={toHover} SortKey={SortKey} SortType={SortType} _Key="c3">
                Price (c)
            </Th>

            <Th /* setSortKey={setSortKey} setSortType={setSortType} */ enableClick={false} SetMouseOver={setToHover} KeyState={toHover} SortKey={SortKey} SortType={SortType} _Key="c4">
                Price (ex)
            </Th>

            <Th setSortKey={setSortKey} setSortType={setSortType} enableClick={true} SetMouseOver={setToHover} KeyState={toHover} SortKey={SortKey} SortType={SortType} _Key="c5">
                Set Price (c)
            </Th>

            <Th setSortKey={setSortKey} setSortType={setSortType} enableClick={true} SetMouseOver={setToHover} KeyState={toHover} SortKey={SortKey} SortType={SortType} _Key="c6">
                Set Price (ex)
            </Th>

            <Th /* setSortKey={setSortKey} setSortType={setSortType} */ enableClick={false} SetMouseOver={setToHover} KeyState={toHover} SortKey={SortKey} SortType={SortType} _Key="c7">
                Item Price (c)
            </Th>

            <Th /* setSortKey={setSortKey} setSortType={setSortType} */ enableClick={false} SetMouseOver={setToHover} KeyState={toHover} SortKey={SortKey} SortType={SortType} _Key="c8">
                Item Price (ex)
            </Th>

            <Th setSortKey={setSortKey} setSortType={setSortType} enableClick={true} SetMouseOver={setToHover} KeyState={toHover} SortKey={SortKey} SortType={SortType} _Key="c9">
                Profit (c)
            </Th>

            <Th setSortKey={setSortKey} setSortType={setSortType} enableClick={true} SetMouseOver={setToHover} KeyState={toHover} SortKey={SortKey} SortType={SortType} _Key="c10">
                Profit (ex)
            </Th>

        </tr>
  );
}
