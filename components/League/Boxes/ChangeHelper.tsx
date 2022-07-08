/* eslint-disable no-undef */

import * as React from 'react';

import {
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getCookie, setCookie } from 'cookies-next';

import Head from './Head';
import styles from './index.module.css';

const formatNumber: Function = require('../../../hooks/formatNumber');

interface Props {
    leagueName: string,
    ExaltedValue: number,
    setBoxHeight: Function
}

export default function ChangeHelper({
  leagueName, ExaltedValue, setBoxHeight,
}: Props) {
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

  const itemChaosPriceRef: MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
  const amountRef: MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
  const exaltedPaymentRef: MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
  const changeRef: MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

  const defaultCookieOptions = {
    path: '/',
    sameSite: true,
  };

  const Handle = {
    ItemChaosPrice: () => {
      // eslint-disable-next-line no-undef
      const { value } = itemChaosPriceRef.current ?? new HTMLInputElement();
      setItemChaosPrice(parseInt(value, 10));
      setCookie(`${leagueName}_ItemChaosPrice`, value, defaultCookieOptions);
    },
    Amount: () => {
      // eslint-disable-next-line no-undef
      const { value } = amountRef.current ?? new HTMLInputElement();
      setAmount(parseInt(value, 10));
      setCookie(`${leagueName}_Amount`, value, defaultCookieOptions);
    },
    ExaltedPayment: () => {
      // eslint-disable-next-line no-undef
      const { value } = exaltedPaymentRef.current ?? new HTMLInputElement();
      setExaltedPayment(parseInt(value, 10));
      setCookie(`${leagueName}_ExaltedPayment`, value, defaultCookieOptions);
    },
  };

  useEffect(() => {
    setItemChaosValue(itemChaosPrice * amount);
  }, [itemChaosPrice, amount]);

  useEffect(() => {
    setChange(formatNumber((ExaltedValue * exaltedPayment) - itemChaosValue));
  }, [itemChaosValue, exaltedPayment]);

  useEffect(() => {
    if (itemChaosPriceRef?.current) {
      itemChaosPriceRef.current.addEventListener('change', Handle.ItemChaosPrice);
      itemChaosPriceRef.current.addEventListener('input', Handle.ItemChaosPrice);
    }

    return () => {
      try {
        itemChaosPriceRef?.current?.removeEventListener('change', Handle.ItemChaosPrice);
        itemChaosPriceRef?.current?.removeEventListener('input', Handle.ItemChaosPrice);
      } catch {}
    };
  }, [itemChaosPriceRef]);

  useEffect(() => {
    if (amountRef?.current) {
      amountRef.current.addEventListener('change', Handle.Amount);
      amountRef.current.addEventListener('input', Handle.Amount);
    }

    return () => {
      try {
        amountRef?.current?.removeEventListener('change', Handle.Amount);
        amountRef?.current?.removeEventListener('input', Handle.Amount);
      } catch {}
    };
  }, [amountRef]);

  useEffect(() => {
    if (exaltedPaymentRef?.current) {
      exaltedPaymentRef.current.addEventListener('change', Handle.ExaltedPayment);
      exaltedPaymentRef.current.addEventListener('input', Handle.ExaltedPayment);
    }

    return () => {
      try {
        exaltedPaymentRef?.current?.removeEventListener('change', Handle.ExaltedPayment);
        exaltedPaymentRef?.current?.removeEventListener('input', Handle.ExaltedPayment);
      } catch (e) {}
    };
  }, [exaltedPaymentRef]);

  /* Box Height */
  // eslint-disable-next-line no-undef
  const BoxElement = useRef<HTMLDivElement>(null);

  const HandleElement = () => {
    if (BoxElement?.current) {
      const { height } = BoxElement.current.getBoundingClientRect();
      setBoxHeight(height);
    }
  };

  useEffect(() => {
    HandleElement();
    // eslint-disable-next-line no-undef
    window.addEventListener('resize', HandleElement);
    return () => {
      // eslint-disable-next-line no-undef
      window.removeEventListener('resize', () => HandleElement);
    };
  }, [BoxElement]);

  return (
        <div>
            <Head>
                Change Calculator
            </Head>

            <div ref={BoxElement} className={`mt-2 border ${styles['bg-white']}`}>
                <div className="container">
                    <div className="row p-2 pt-1 justify-content-center text-center">

                        <div className="form-group">
                            <label className="user-select-none">Item Chaos Price:</label>
                            <input ref={itemChaosPriceRef} defaultValue={itemChaosPrice} min={0} type="number" placeholder="Chaos Price per item" className="form-control-sm text-center border mr-2 ml-2"></input>
                        </div>

                        <div className="form-group">
                            <label className="user-select-none">Amount:</label>
                            <input ref={amountRef} defaultValue={amount} min={0} type="number" placeholder="Item Amount Value" className="form-control-sm text-center border mr-2 ml-2"></input>
                        </div>

                        <div className="form-group mb-2">
                            <label className="user-select-none">Exalted Payment:</label>
                            <input ref={exaltedPaymentRef} defaultValue={exaltedPayment} min={0} type="number" placeholder="Exalted Payment Value" className="form-control-sm text-center border mr-2 ml-2"></input>
                        </div>

                        <div className="form-group mb-2">
                            <label className="user-select-none">Change:</label>
                            <input ref={changeRef} value={`${change || 0}c`} min={0} type="text" className={`form-control-sm text-center mr-2 ml-2 ${styles.change}`} readOnly></input>
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
