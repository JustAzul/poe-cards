export default function Inputs({leagueName, Currency, SearchString}) {
    return (
        <>
            <input type="hidden" name="league" value={leagueName}></input>
            <input type="hidden" name="online" value="x"></input>
            <input type="hidden" name="buyout_currency" value={Currency}></input>
            <input type="hidden" name="name" value={SearchString}></input>
        </>
    );
}