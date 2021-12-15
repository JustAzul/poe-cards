import { MutableRefObject, useEffect, useRef } from 'react';
import styles from './index.module.css';
import Currency from './Currency';
import mandali from '../../mandali.module.css';

import type { CurrencyValues } from '../../../hooks/interfaces';

interface Props {
    CurrencyValues: CurrencyValues,
    UpdateHeigh: Function
}

export default function Navbar({ CurrencyValues, UpdateHeigh }: Props) {
  const Element: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

  const HandleElement = () => {
    if (Element?.current) {
      const { height } = Element.current.getBoundingClientRect();
      UpdateHeigh(height);
    }
  };

  useEffect(() => {
    HandleElement();
    window.addEventListener('resize', HandleElement);
    return () => {
      window.removeEventListener('resize', () => HandleElement);
    };
  }, [Element]);

  return (
        <div id="header" ref={Element} className={`navbar navbar-dark bg-dark fixed-top ${mandali.mandali}`}>
            <div className={`container ${styles['font-class']}`} >

                <Currency img="ExaltedOrb">
                    Exalted Value: <span className="pl-1">{CurrencyValues.Exalted}c</span>
                </Currency>

                <Currency img="DivineOrb">
                    Divine Value: <span className="pl-1">{CurrencyValues.Divine}c</span>
                </Currency>

                <Currency img="AnnulOrb">
                    Annul Value: <span className="pl-1">{CurrencyValues.Annul}c</span>
                </Currency>

                <Currency img="MirrorKalandra">
                    Mirror Value: <span className="pl-1 mr-2">{CurrencyValues.Mirror} ex</span>
                </Currency>

            </div>
        </div>
  );
}
