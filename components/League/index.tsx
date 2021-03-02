import Dynamic from 'next/dynamic';
import { useState } from 'react';
import Spinner from '../Spinner';
import LastUpdated from './LastUpdated';

import mandali from '../mandali.module.css';

import type { CurrencyValues, TableData } from '../../hooks/interfaces';

const SplitedValues = Dynamic(() => import('./Boxes/SplitedExalted'), { loading: () => <Spinner/> });
const ChangeHelper = Dynamic(() => import('./Boxes/ChangeHelper'), { loading: () => <Spinner/> });
const TableView = Dynamic(() => import('./Table'), { loading: () => <Spinner/> });

interface Props {
    NavbarHeight: number,
    LastUpdatedDate: string,
    Cookies: any,
    leagueName: string,
    SplitsArray: Array<number>,
    CurrencyValues: CurrencyValues,
    CardsTable: Array<TableData>
}

export default function League({
  Cookies, leagueName, CurrencyValues, SplitsArray, CardsTable, LastUpdatedDate, NavbarHeight,
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
                       {CurrencyValues.Exalted ? <ChangeHelper leagueName={leagueName} Cookies={Cookies} ExaltedValue={CurrencyValues.Exalted} setBoxHeight={setBoxHeight}/> : <Spinner/>}
                    </div>

                </div>
            </div>

            <LastUpdated LastUpdatedDate={LastUpdatedDate}/>

            <div className="row justify-content-md-center pt-3 pb-3">
                <div className="table100 ver1 user-select-none">
                    {CardsTable.length === 0 ? <Spinner/> : <TableView leagueName={leagueName} NavbarHeight={NavbarHeight} Items={CardsTable}/>}
                </div>
            </div>
        </>
  );
}
