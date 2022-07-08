import { useContext, useState } from 'react';

import Contexts from '../../context';
import Dynamic from 'next/dynamic';
import LastUpdated from './LastUpdated';
import Spinner from '../Spinner';
import mandali from '../mandali.module.css';

const SplitedValues = Dynamic(() => import('./Boxes/SplitedExalted'), { loading: () => <Spinner/> });
const ChangeHelper = Dynamic(() => import('./Boxes/ChangeHelper'), { loading: () => <Spinner/> });
const TableView = Dynamic(() => import('./Table'), { loading: () => <Spinner/> });

export default function League() {
  const [boxHeight, setBoxHeight] = useState<number>(Number);

  const { currencyValues, cardsTable } = useContext(Contexts.leaguePageData);

  return (
        <>
            <div className="container">
                <div className={`row ${mandali.mandali}`}>

                    <div className="col-sm mt-2 text-center">
                    {currencyValues.Exalted ? <SplitedValues boxHeight={boxHeight} /> : <Spinner/>}
                    </div>

                    <div className="col-sm mt-2 text-center">
                       {currencyValues.Exalted ? <ChangeHelper setBoxHeight={setBoxHeight}/> : <Spinner/>}
                    </div>

                </div>
            </div>

            <LastUpdated />

            <div className="row justify-content-md-center pt-3 pb-3">
                <div className="table100 ver1 user-select-none">
                    {cardsTable.length === 0 ? <Spinner/> : <TableView />}
                </div>
            </div>
        </>
  );
}
