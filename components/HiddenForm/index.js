import PoeTradeInputs from './PoeTradeInputs';

export default function PoeTradeForm({FormRef, SearchString, METHOD = "POST", Currency = "chaos", leagueName, Href = "https://poe.trade/search", PoeTrade = false}) {
    return (
        <form ref={FormRef} method={METHOD} action={Href} target={SearchString}>
            {PoeTrade && <PoeTradeInputs Currency={Currency} leagueName={leagueName} SearchString={SearchString} />}
        </form>
        );
}