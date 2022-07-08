import type { CurrencyValues, KeyStates, TableData } from '../../hooks/interfaces';

import Dynamic from 'next/dynamic';
import LastUpdated from './LastUpdated';
import Spinner from '../Spinner';
import mandali from '../mandali.module.css';
import { useState } from 'react';

const SplitedValues = Dynamic(() => import('./Boxes/SplitedExalted'), { loading: () => <Spinner/> });
const ChangeHelper = Dynamic(() => import('./Boxes/ChangeHelper'), { loading: () => <Spinner/> });
const TableView = Dynamic(() => import('./Table'), { loading: () => <Spinner/> });

interface Props {
    NavbarHeight: number,
    LastUpdatedDate: string,
    leagueName: string,
    SplitsArray: Array<number>,
    CurrencyValues: CurrencyValues,
    CardsTable: Array<TableData>,
    SortKey: KeyStates,
    SortType: 0 | 1,
    setSortKey: Function,
    setSortType: Function
}

export default function League({
  // eslint-disable-next-line no-shadow
  leagueName, CurrencyValues, SplitsArray, CardsTable, LastUpdatedDate, NavbarHeight, SortType = 1, SortKey = 'c9', setSortType, setSortKey,
}: Props) {
  const [boxHeight, setBoxHeight] = useState<number>(Number);

  return (
        <>
            <div className="container">
                <div className={`row ${mandali.mandali}`}>

                    <div className="col-sm mt-2 text-center">
                    {CurrencyValues.Exalted ? <SplitedValues boxHeight={boxHeight} SplitsArray={SplitsArray}/> : <Spinner/>}
                    </div>

                    <div className="col-sm mt-2 text-center">
                       {CurrencyValues.Exalted ? <ChangeHelper leagueName={leagueName} ExaltedValue={CurrencyValues.Exalted} setBoxHeight={setBoxHeight}/> : <Spinner/>}
                    </div>

                </div>
            </div>

            <LastUpdated LastUpdatedDate={LastUpdatedDate}/>

            <div className="row justify-content-md-center pt-3 pb-3">
                <div className="table100 ver1 user-select-none">
                    {CardsTable.length === 0 ? <Spinner/> : <TableView SortType={SortType} setSortType={setSortType} SortKey={SortKey} setSortKey={setSortKey} leagueName={leagueName} NavbarHeight={NavbarHeight} Items={CardsTable}/>}
                </div>
            </div>
        </>
  );
}
