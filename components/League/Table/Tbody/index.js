import Tr from './Tr';

export default function thead({setToHover, toHover, Items/* , leagueName */}) {
    /* const target = useRef(null); */
    
    /* const [SearchString, setSearchString] = useState('');
    const ref = useRef(null); */

    /* const Search = (String = "") => {
        setSearchString(String);
        target.current && target['current'].submit();
    } */

    /* const FakeForm = () => (
        <form ref={ref} method="POST" action="https://poe.trade/search" target={SearchString}>
            <input type="hidden" name="league" value={leagueName}></input>
            <input type="hidden" name="online" value="x"></input>
            <input type="hidden" name="buyout_currency" value="chaos"></input>
            <input type="hidden" name="name" value={SearchString}></input>
        </form>
    ); */
    
    return (
        <>  {/* {FakeForm} */}
            {Items.map( ({Card, Reward, chaosprofit, exprofit, isCurrency, setchaosprice, setexprice}, i) => {
                const Details = {
                    Card, Reward, chaosprofit, exprofit, isCurrency, setchaosprice, setexprice
                };
                return (
                    <Tr setToHover={setToHover} toHover={toHover} Details={Details} />
                );
            })}
        </>
    );
}