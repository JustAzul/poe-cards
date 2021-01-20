import styles from './index.module.css';
import Image from 'next/image';
import {OverlayTrigger} from 'react-bootstrap';
import {useRef, useState} from 'react';
import DivCard from './DivCard';

export default function thead({setToHover, toHover, Items, leagueName}) {
    const target = useRef(null);
    
    const chaosIMG = () => (
        <Image
            src="/images/ChaosOrb.png"
            width={24}
            height={24}
        ></Image>
    );

    const exIMG = () => (
        <Image
            src="/images/ExaltedOrb.png"
            width={24}
            height={24}
        ></Image>
    );

    const cardIMG = () => (
        <Image
            src="/images/InventoryIcon.png"
            width={24}
            height={24}
        ></Image>
    );

    const GenDivCard = CardDetails => (
        <div>
            <DivCard CardDetails={CardDetails}></DivCard>
        </div>
    );

    //const router = useRouter();
    const [SearchString, setSearchString] = useState('');
    const ref = useRef(null);

    const Search = (String = "") => {
        setSearchString(String);
        //console.log('SearchString',SearchString);
        target.current && target['current'].submit();
    }

    const Table = Items.map( ({Card, Reward, chaosprofit, exprofit, isCurrency, setchaosprice, setexprice}) => {
        return (
            <OverlayTrigger overlay={GenDivCard(Card)} target={target.current} placement="left">
                <tr className={`row100`}>
                    <td onClick={()=> {Search(Card['name'])}} onMouseOver={() => setToHover("c1")} onMouseOut={() => setToHover("")} title="Divination Card Name" className={`column100 column1  click${toHover === "c1" ? " hov-column-ver1" : ""}${isCurrency ? ` ${styles['currency']}` : ""}`}>{cardIMG()}<span className="ml-2">{Card['name']}</span></td>
                    <td onMouseOver={() => setToHover("c2")} onMouseOut={() => setToHover("")} title={`${Card['name']} Stack Size`} className={`column100 ${toHover === "c2" ? " hov-column-ver1" : ""}`}><span className="ml-3">{Card['stack']}</span></td>
                    <td onMouseOver={() => setToHover("c3")} onMouseOut={() => setToHover("")} title={`${Card['name']} Chaos Price`} className={`column100  click${toHover === "c3" ? " hov-column-ver1" : ""}`}>{chaosIMG()}<span className="ml-2">{Card['chaosprice']}</span></td>
                    <td onMouseOver={() => setToHover("c4")} onMouseOut={() => setToHover("")} title={`${Card['name']} Exalted Price`} className={`column100  click${toHover === "c4" ? " hov-column-ver1" : ""}`}>{exIMG()}<span className="ml-2">{Card['exaltedprice']}</span></td>
                    <td onMouseOver={() => setToHover("c5")} onMouseOut={() => setToHover("")} title={`${Card['name']} Stacked Chaos Value`} className={`column100 ${toHover === "c5" ? " hov-column-ver1" : ""}`}>{chaosIMG()}<span className="ml-2">{setchaosprice}</span></td>
                    <td onMouseOver={() => setToHover("c6")} onMouseOut={() => setToHover("")} title={`${Card['name']} Stacked Exalted Value`} className={`column100 ${toHover === "c6" ? " hov-column-ver1" : ""}`}>{exIMG()}<span className="ml-2">{setexprice}</span></td>
                    <td onMouseOver={() => setToHover("c7")} onMouseOut={() => setToHover("")} title={`${Card['name']} Chaos Value`} className={`column100 click ${toHover === "c7" ? " hov-column-ver1" : ""}`}>{chaosIMG()}<span className="ml-2">{Reward['chaosprice']}</span></td>
                    <td onMouseOver={() => setToHover("c8")} onMouseOut={() => setToHover("")} title={`${Card['name']} Exalted Value`} className={`column100 click ${toHover === "c8" ? " hov-column-ver1" : ""}`}>{exIMG()}<span className="ml-2">{Reward['exaltedprice']}</span></td>
                    <td onMouseOver={() => setToHover("c9")} onMouseOut={() => setToHover("")} title="Chaos Profit" className={`column100 ${toHover === "c9" ? " hov-column-ver1" : ""}`}>{chaosIMG()}<span className="ml-2">{chaosprofit}</span></td>
                    <td onMouseOver={() => setToHover("c10")} onMouseOut={() => setToHover("")} title="Exalted Profit" className={`column100 ${toHover === "c10" ? " hov-column-ver1" : ""}`}>{exIMG()}<span className="ml-2">{exprofit}</span></td>                    
                </tr>
             </OverlayTrigger >
        );
    });

    const FakeForm = () => (
        <form onSubmit={() => {console.log('cu depilado')}} ref={ref} method="POST" action="https://poe.trade/search" target={SearchString}>
            <input type="hidden" name="league" value={leagueName}></input>
            <input type="hidden" name="online" value="x"></input>
            <input type="hidden" name="buyout_currency" value="chaos"></input>
            <input type="hidden" name="name" value={SearchString}></input>
        </form>
    );
    
    return (
        <>  {FakeForm}
            {Table}
        </>
    );
}