import {useRef, useEffect, MutableRefObject, SetStateAction} from 'react';
import PoeTradeInputs from './PoeTradeInputs';

interface Props {
    setFormRef: Function,
    SearchString: string,
    METHOD: "POST" | "GET",
    Currency?: "chaos" | "exalted",
    leagueName?: string,
    Href: string,
    PoeTrade?: Boolean
}

export default function PoeTradeForm({setFormRef, SearchString, METHOD = "POST", Currency = "chaos", leagueName, Href = "https://poe.trade/search", PoeTrade = false}: Props) {
    const Ref: MutableRefObject<any> = useRef();

    useEffect(() => {
        if(Ref && Ref['current']) setFormRef(Ref['current']);
    }, [Ref]);

    return (
        <form ref={Ref} method={METHOD} action={Href} target={SearchString}>
            {PoeTrade && <PoeTradeInputs Currency={Currency} leagueName={leagueName} SearchString={SearchString} />}
        </form>
        );
}