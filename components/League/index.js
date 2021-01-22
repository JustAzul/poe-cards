import Dynamic from 'next/dynamic';
import { useState } from 'react';
import Spinner from '../Spinner';
import LastUpdated from './LastUpdated';

const SplitedValues = Dynamic(() => import('./Boxes/SplitedExalted'), {loading: () => <Spinner/>});
const ChangeHelper = Dynamic(() => import('./Boxes/ChangeHelper'), {loading: () => <Spinner/>});
const TableView = Dynamic(() => import('./Table'), {loading: () => <Spinner/>});

export default function League({Cookies, leagueName, CurrencyValues, SplitsArray, CardsTable, LastUpdated: LastUpdatedDate, NavbarHeight}) {

    const [boxHeight, setBoxHeight] = useState(Number);
    
    return (
        <>
            <div className="container">
                <div className="row mandali">

                    <div className="col-sm mt-2 text-center">
                        <SplitedValues boxHeight={boxHeight} SplitsArray={SplitsArray}/>
                    </div>

                    <div className="col-sm mt-2 text-center">
                        <ChangeHelper leagueName={leagueName} Cookies={Cookies} ExaltedValue={CurrencyValues['Exalted']} setBoxHeight={setBoxHeight}/>
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