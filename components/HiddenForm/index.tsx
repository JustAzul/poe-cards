import { useRef, useEffect, MutableRefObject } from 'react';
import PoeTradeInputs from './PoeTradeInputs';

import type { Currency } from '../../hooks/interfaces';

interface Props {
    setFormRef: Function,
    SearchString: string,
    METHOD?: 'POST' | 'GET',
    Currency?: Currency,
    leagueName?: string,
    Href?: string,
    PoeTrade?: Boolean
}

export default function PoeTradeForm({
  setFormRef, SearchString, METHOD = 'POST', Currency = 'chaos', leagueName, Href = 'https://poe.trade/search', PoeTrade = false,
}: Props) {
  const Ref: MutableRefObject<HTMLFormElement| null> = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (Ref && Ref.current) setFormRef(Ref.current);
  }, [Ref]);

  return (
        <form ref={Ref} method={METHOD} action={Href} target={SearchString}>
            {PoeTrade && <PoeTradeInputs Currency={Currency} leagueName={leagueName} SearchString={SearchString} />}
        </form>
  );
}
