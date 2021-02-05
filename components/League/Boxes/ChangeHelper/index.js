import _styles from '../index.module.css';
import {useEffect, useRef, useState} from 'react';
import {useCookies} from 'react-cookie';
import styles from './index.module.css';
import Head from '../Head.js';

import Transition from '../../../Transition';

const formatNumber = require('../../../../hooks/formatNumber');

export default function ChangeHelper({Cookies, leagueName, ExaltedValue, setBoxHeight}) {
    const [ItemChaosValue, setItemChaosValue] = useState(0);

    const [ItemChaosPrice, setItemChaosPrice] = useState(parseInt(Cookies[`${leagueName}_ItemChaosPrice`] || 0));
    const [Amount, setAmount] = useState(parseInt(Cookies[`${leagueName}_Amount`] || 1));
    const [ExaltedPayment, setExaltedPayment] = useState(parseInt(Cookies[`${leagueName}_ExaltedPayment`] || 0));
    const [Change, setChange] = useState(0);

    const ItemChaosPriceRef = useRef(null);
    const AmountRef = useRef(null);
    const ExaltedPaymentRef = useRef(null);
    const ChangeRef = useRef(null);    

    const [,setItemChaosPriceCookie] = useCookies([`${leagueName}_ItemChaosPrice`]);
    const [,setAmountCookie] = useCookies([`${leagueName}_Amount`]);
    const [,setExaltedPaymentCookie] = useCookies([`${leagueName}_ExaltedPayment`]);

    const DefaultCookieOptions = {
        "path": "/",
        "sameSite": true
    };
    
    const Handle = {
        ItemChaosPrice: () => {
            const {value} = ItemChaosPriceRef['current'];
            setItemChaosPrice(value);
            setItemChaosPriceCookie(`${leagueName}_ItemChaosPrice`, value, DefaultCookieOptions);
            //console.log('ItemChaosPrice', value);
        },
        Amount: () => {
            const {value} = AmountRef['current'];
            setAmount(value);
            setAmountCookie(`${leagueName}_Amount`, value, DefaultCookieOptions);
            //console.log('Amount', value);
        },
        ExaltedPayment: () => {
            const {value} = ExaltedPaymentRef['current'];
            setExaltedPayment(value);
            setExaltedPaymentCookie(`${leagueName}_ExaltedPayment`, value, DefaultCookieOptions);
            //console.log('ExaltedPayment', value);
        }
    };

    useEffect(() => {
        setItemChaosValue(ItemChaosPrice * Amount);
    }, [ItemChaosPrice, Amount]);

    useEffect(()=>{
        setChange(formatNumber((ExaltedValue * ExaltedPayment) - ItemChaosValue));
    }, [ItemChaosValue, ExaltedPayment]);

    useEffect(() => {

        if (ItemChaosPriceRef && ItemChaosPriceRef.current) {
            ItemChaosPriceRef.current.addEventListener("change", Handle['ItemChaosPrice']);
            ItemChaosPriceRef.current.addEventListener("input", Handle['ItemChaosPrice']);
        }

        return () => {
            try {
                ItemChaosPriceRef.current.removeEventListener("change", Handle['ItemChaosPrice']);
                ItemChaosPriceRef.current.removeEventListener("input", Handle['ItemChaosPrice']);
            } catch (e) {}
        }
    }, [ItemChaosPriceRef]);

    useEffect(() => {

        if (AmountRef && AmountRef.current) {
            AmountRef.current.addEventListener("change", Handle['Amount']);
            AmountRef.current.addEventListener("input", Handle['Amount']);
        }

        return () => {
            try {
                AmountRef.current.removeEventListener("change", Handle['Amount']);
                AmountRef.current.removeEventListener("input", Handle['Amount']);
            } catch (e) {}

        }
    }, [AmountRef]);

    useEffect(() => {

        if (ExaltedPaymentRef && ExaltedPaymentRef.current) {
            ExaltedPaymentRef.current.addEventListener("change", Handle['ExaltedPayment']);
            ExaltedPaymentRef.current.addEventListener("input", Handle['ExaltedPayment']);
        }

        return () => {
            try {
                ExaltedPaymentRef.current.removeEventListener("change", Handle['ExaltedPayment']);
                ExaltedPaymentRef.current.removeEventListener("input", Handle['ExaltedPayment']);
            } catch (e) {}
        }
    }, [ExaltedPaymentRef]);
    
    /* Box Height */
    const BoxElement = useRef(null);

    const HandleElement = () => {
        if (BoxElement.current) {
            const {height} = BoxElement.current.getBoundingClientRect();
            setBoxHeight(height);
        }
    };

    useEffect(() => {
        HandleElement();
        window.addEventListener("resize", HandleElement);
        return () => {
            window.removeEventListener('resize', () => HandleElement);
          };
    }, [BoxElement]);
    
    return (
        <Transition>
            <Head>
                Change Helper 
            </Head>

            <div ref={BoxElement} className={`mt-2 border ${_styles['bg-white']}`}>
                <div className="container">
                    <div className="row p-2 pt-1 justify-content-center text-center">
                        
                        <div className="form-group">
                            <label className="user-select-none">Item Chaos Price:</label>
                            <input ref={ItemChaosPriceRef} defaultValue={ItemChaosPrice} min={0} type="number" placeholder="Chaos Price per item" className="form-control-sm text-center border mr-2 ml-2"></input>
                        </div>
                        
                        <div className="form-group">
                            <label className="user-select-none">Amount:</label>
                            <input ref={AmountRef} defaultValue={Amount} min={0} type="number" placeholder="Item Amount Value" className="form-control-sm text-center border mr-2 ml-2"></input>
                        </div>
                        
                        <div className="form-group mb-2">
                            <label className="user-select-none">Exalted Payment:</label>
                            <input ref={ExaltedPaymentRef} defaultValue={ExaltedPayment} min={0} type="number" placeholder="Exalted Payment Value" className="form-control-sm text-center border mr-2 ml-2"></input>
                        </div>
                        
                        <div className="form-group mb-2">
                            <label className="user-select-none">Change:</label>
                            <input ref={ChangeRef} value={`${Change || 0}c`} min={0} type="text"  className={`form-control-sm text-center mr-2 ml-2 ${styles['change']}`} readOnly></input>
                        </div>
                        
                        <div className={`p-0 m-0 pb-1 ${styles.chaosvalue}`}>
                            <span className="user-select-none">Item Chaos Value: </span><span className="pl-1">{ItemChaosValue}c</span>
                        </div>

                    </div>
                </div>
            </div>
        </Transition>
    );
}