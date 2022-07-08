import {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
} from 'react';

import AnnulOrb from '../../../public/images/AnnulOrb.png';
import Contexts from '../../../context';
import Currency from './Currency';
import DivineOrb from '../../../public/images/DivineOrb.png';
import ExaltedOrb from '../../../public/images/ExaltedOrb.png';
import MirrorKalandra from '../../../public/images/MirrorKalandra.png';
import mandali from '../../mandali.module.css';
import styles from './index.module.css';

interface Props {
    UpdateHeigh: Function
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

                <Currency img={ExaltedOrb}>
                    Exalted Value: <span className="pl-1">{currencyValues.Exalted}c</span>
                </Currency>

                <Currency img={DivineOrb}>
                    Divine Value: <span className="pl-1">{currencyValues.Divine}c</span>
                </Currency>

                <Currency img={AnnulOrb}>
                    Annul Value: <span className="pl-1">{currencyValues.Annul}c</span>
                </Currency>

                <Currency img={MirrorKalandra}>
                    Mirror Value: <span className="pl-1 mr-2">{currencyValues.Mirror} ex</span>
                </Currency>

            </div>
        </div>
  );
}
