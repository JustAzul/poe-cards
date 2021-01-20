//import styles from './index.module.css';
import { useState } from 'react';
import SplitedValues from './SplitedExalted';
import ChangeHelper from './ChangeHelper';
import TableView from './Table';

export default function League({Cookies, leagueName, CurrencyValues, SplitsArray, CardsArray, NavbarHeight}) {

    const [boxHeight, setBoxHeight] = useState(Number);
    
    return (
        <>
            <div className="container">
                <div className="row mandali">

                    <div className="col-sm mt-2">
                        <SplitedValues boxHeight={boxHeight} SplitsArray={SplitsArray}></SplitedValues>
                    </div>

                    <div className="col-sm mt-2">
                        <ChangeHelper leagueName={leagueName} Cookies={Cookies} ExaltedValue={CurrencyValues['Exalted']} setBoxHeight={setBoxHeight}></ChangeHelper>
                    </div>

                </div>
            </div>
            
            <div className="text-center pt-3 mandali user-select-none">
            - Last updated a minute ago - 
            </div>

            
            <div className="row justify-content-md-center pt-3 pb-3">
                <div className="table100 ver1 user-select-none">
                    <TableView leagueName={leagueName} NavbarHeight={NavbarHeight} Items={CardsArray}></TableView>
                </div>
            </div>
        </>        
    );
}