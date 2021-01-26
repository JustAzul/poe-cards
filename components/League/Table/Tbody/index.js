import {useRef, useEffect, useState} from 'react';
import Tr from './Tr';

import HiddenForm from '../../../HiddenForm';

export default function thead({setToHover, toHover, leagueName, Items}) {

    const FormRef = useRef(null);
    const [SearchString, setSearchString] = useState(null);
    const [PoeTradeRef, setPoeTradeRef] = useState(null);
    const [SearchCurrency, setSearchCurrency] = useState("chaos");
    
    useEffect(() => {
        if(FormRef && FormRef['current']) setPoeTradeRef(FormRef['current']);
    }, [FormRef]);

    const doSearch = (toSearch = "", Currency = 'chaos') => {
        setSearchString(toSearch);
        setSearchCurrency(Currency);
        process.nextTick(() => {
            PoeTradeRef && PoeTradeRef.submit();
        });
    };
    
    return (
        <>  <HiddenForm Currency={SearchCurrency} PoeTrade={true} FormRef={FormRef} leagueName={leagueName} SearchString={SearchString} />
            {Items.map( ({Card, Reward, chaosprofit, exprofit, isCurrency, setchaosprice, setexprice}) => {
                const Details = {Card, Reward, chaosprofit, exprofit, isCurrency, setchaosprice, setexprice};
                return (
                    <Tr doSearch={doSearch} setToHover={setToHover} toHover={toHover} Details={Details} />
                );
            })}
        </>
    );
}