import { useRef, useEffect, MutableRefObject } from 'react';
import PoeTradeInputs from './PoeTradeInputs';

interface Props {
    setFormRef: Function,
    SearchString: string,
    maxPrice?: number,
    METHOD?: 'POST' | 'GET',
    leagueName?: string,
    Href?: string,
    PoeTrade?: Boolean
}

export default function PoeTradeForm({
  setFormRef, SearchString, METHOD = 'POST', maxPrice, leagueName, Href = '/api/trade_redirect', PoeTrade = false,
}: Props) {
  // eslint-disable-next-line no-undef
  const Ref: MutableRefObject<HTMLFormElement| null> = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (Ref && Ref.current) setFormRef(Ref.current);
  }, [Ref]);

  return (
        <form ref={Ref} method={METHOD} action={Href} target={SearchString}>
            {PoeTrade && <PoeTradeInputs maxPrice={maxPrice || 0} leagueName={leagueName} SearchString={SearchString} />}
        </form>
  );
}
