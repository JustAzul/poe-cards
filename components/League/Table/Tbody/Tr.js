import styles from '../index.module.css';
import TableStyles from '../../../Table/index.module.css';
import Img from './Img';
import Td from '../../../Table/Td';
import {OverlayTrigger} from 'react-bootstrap';
import Dynamic from 'next/dynamic';
import Spinner from '../../../Spinner';

const DivCard = Dynamic(() => import('../DivCard'), { loading: () => <div className="mr-2"><Spinner /></div>});

export default function Tr({setToHover, toHover, Details}) {
    const {Card, Reward, chaosprofit, exprofit, isCurrency, setchaosprice, setexprice} = Details;
    
    const GenDivCard = CardDetails => (
        <div className="mr-2">
            <DivCard CardDetails={CardDetails} />
        </div>
    );

    return (
    <OverlayTrigger overlay={GenDivCard(Card)} placement="left">
        <tr className={TableStyles['row100']}>

                    <Td setTitle="Divination Card Name" Class={`click${isCurrency ? ` ${styles['currency']}` : ""}`} SetMouseOver={setToHover} KeyState={toHover} _Key="c1" >
                        {<Img artFileName="InventoryIcon" />}
                        <span className="ml-2">
                            {Card['name']}
                        </span>
                    </Td>

                    <Td setTitle={`${Card['name']} Stack Size`} SetMouseOver={setToHover} KeyState={toHover} _Key="c2" >
                        <span className="ml-3">{Card['stack']}</span>
                    </Td>

                    <Td setTitle={`${Card['name']} Chaos Price`} Class="click" SetMouseOver={setToHover} KeyState={toHover} _Key="c3" >
                        {<Img artFileName="ChaosOrb" />}<span className="ml-2">{Card['chaosprice']}</span>
                    </Td>

                    <Td setTitle={`${Card['name']} Exalted Price`} SetMouseOver={setToHover} KeyState={toHover} _Key="c4" >
                        {<Img artFileName="ExaltedOrb" />}<span className="ml-2">{Card['exaltedprice']}</span>
                    </Td>

                    <Td setTitle={`${Card['name']} Stacked Chaos Value`} SetMouseOver={setToHover} KeyState={toHover} _Key="c5" >
                        {<Img artFileName="ChaosOrb" />}<span className="ml-2">{setchaosprice}</span>
                    </Td>

                    <Td setTitle={`${Card['name']} Stacked Exalted Value`} SetMouseOver={setToHover} KeyState={toHover} _Key="c6" >
                        {<Img artFileName="ExaltedOrb" />}<span className="ml-2">{setexprice}</span>
                    </Td>

                    <Td setTitle={`${Card['name']} Chaos Value`} Class="click" SetMouseOver={setToHover} KeyState={toHover} _Key="c7" >
                        {<Img artFileName="ChaosOrb" />}<span className="ml-2">{Reward['chaosprice']}</span>
                    </Td>

                    <Td setTitle={`${Card['name']} Exalted Value`} Class="click" SetMouseOver={setToHover} KeyState={toHover} _Key="c8" >
                        {<Img artFileName="ExaltedOrb" />}<span className="ml-2">{Reward['exaltedprice']}</span>
                    </Td>

                    <Td setTitle={`Chaos Profit`} SetMouseOver={setToHover} KeyState={toHover} _Key="c9" >
                        {<Img artFileName="ChaosOrb" />}<span className="ml-2">{chaosprofit}</span>
                    </Td>

                    <Td setTitle={`Exalted Profit`} SetMouseOver={setToHover} KeyState={toHover} _Key="c9" >
                        {<Img artFileName="ExaltedOrb" />}<span className="ml-2">{exprofit}</span>
                    </Td>
         </tr>
        </OverlayTrigger >
    );
}