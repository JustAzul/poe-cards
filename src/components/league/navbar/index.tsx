import {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
} from 'react';
import type React from 'react';

import Contexts from '@/context';
import Currency from './currency';
import { NAVBAR_CURRENCIES } from './constants';
import mandali from '../../mandali.module.css';
import styles from './index.module.css';

interface Props {
    UpdateHeigh: React.Dispatch<number>;
}

export default function Navbar({ UpdateHeigh }: Props) {
  // eslint-disable-next-line no-undef
  const element: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

  const { currencyValues } = useContext(Contexts.leaguePageData);

  const HandleElement = () => {
    if (element?.current) {
      const { height } = element.current.getBoundingClientRect();
      UpdateHeigh(height);
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
  }, [element]);

  return (
        <div id="header" ref={element} className={`navbar navbar-dark bg-dark fixed-top ${mandali.mandali}`}>
            <div className={`container ${styles['font-class']}`} >

              {NAVBAR_CURRENCIES.map((item, i, a) => (
                <Currency key={i} img={item.img}>
                    {item.name} Value: <span className={`pl-1${(a.length - 1) === i ? 'mr-2' : ''}`}>{`${parseInt(currencyValues[item.name]?.toString() || '0', 10)}${item.valueText}`}</span>
                </Currency>
              ))}

            </div>
        </div>
  );
}
