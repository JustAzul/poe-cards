/* eslint-disable no-undef */
import * as React from 'react';

import {
  useContext,
  useEffect,
  useRef,
  useState,
  ChangeEvent,
} from 'react';
import { getCookie, setCookie } from 'cookies-next';

import Contexts from '@/context';
import Head from './Head';
import styles from './index.module.css';

const formatNumber: Function = require('@/hooks/formatNumber');

interface Props {
    setBoxHeight: Function
}

export default function ChangeHelper({
  setBoxHeight,
}: Props) {
  const { leagueName, currencyValues } = useContext(Contexts.leaguePageData);

  const [itemChaosValue, setItemChaosValue] = useState<number>(0);

  const [itemChaosPrice, setItemChaosPrice] = useState<number>(
    parseInt(
      getCookie(`${leagueName}_ItemChaosPrice`)?.toString() || '0',
      10,
    ),
  );

  const [amount, setAmount] = useState<number>(
    parseInt(
      getCookie(`${leagueName}_Amount`)?.toString() || '1',
      10,
    ),
  );

  const [exaltedPayment, setExaltedPayment] = useState<number>(
    parseInt(
      getCookie(`${leagueName}_ExaltedPayment`)?.toString() || '0',
      10,
    ),
  );

  const [change, setChange] = useState<number>(0);
  const defaultCookieOptions = {
    path: '/',
    sameSite: true,
  };

  const handleItemChaosPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const price = parseInt(value, 10) || 0;
    setItemChaosPrice(price);
    setCookie(`${leagueName}_ItemChaosPrice`, price.toString(), defaultCookieOptions);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const amountValue = parseInt(value, 10) || 0;
    setAmount(amountValue);
    setCookie(`${leagueName}_Amount`, amountValue.toString(), defaultCookieOptions);
  };
  const handleExaltedPaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const exaltedValue = parseInt(value, 10) || 0;
    setExaltedPayment(exaltedValue);
    setCookie(`${leagueName}_ExaltedPayment`, exaltedValue.toString(), defaultCookieOptions);
  };

  useEffect(() => {
    setItemChaosValue(itemChaosPrice * amount);
  }, [itemChaosPrice, amount]);

  useEffect(() => {
    setChange(
      formatNumber(
        ((currencyValues?.Exalted || 0) * exaltedPayment) - itemChaosValue,
      ),
    );
  }, [itemChaosValue, exaltedPayment]);

  /* Box Height */
  // eslint-disable-next-line no-undef
  const boxRef = useRef<HTMLDivElement>(null);

  const handleResize = () => {
    if (boxRef.current) {
      const { height } = boxRef.current.getBoundingClientRect();
      setBoxHeight(height);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
        <div>
            <Head>
                Change Calculator
            </Head>

            <div ref={boxRef} className={`mt-2 border ${styles['bg-white']}`}>
                <div className="container">
                    <div className="row p-2 pt-1 justify-content-center text-center">

                        <div className="form-group">
                            <label className="user-select-none">Item Chaos Price:</label>
                            <input value={itemChaosPrice} onChange={handleItemChaosPriceChange} min={0} type="number" placeholder="Chaos Price per item" className="form-control-sm text-center border mr-2 ml-2" />
                        </div>

                        <div className="form-group">
                            <label className="user-select-none">Amount:</label>
                            <input value={amount} onChange={handleAmountChange} min={0} type="number" placeholder="Item Amount Value" className="form-control-sm text-center border mr-2 ml-2" />
                        </div>

                        <div className="form-group mb-2">
                            <label className="user-select-none">Exalted Payment:</label>
                            <input value={exaltedPayment} onChange={handleExaltedPaymentChange} min={0} type="number" placeholder="Exalted Payment Value" className="form-control-sm text-center border mr-2 ml-2" />
                        </div>

                        <div className="form-group mb-2">
                            <label className="user-select-none">Change:</label>
                            <input value={`${change || 0}c`} min={0} type="text" className={`form-control-sm text-center mr-2 ml-2 ${styles.change}`} readOnly />
                        </div>

                        <div className={`p-0 m-0 pb-1 ${styles.chaosvalue}`}>
                            <span className="user-select-none">Item Chaos Value: </span><span className="pl-1">{itemChaosValue}c</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
  );
}
