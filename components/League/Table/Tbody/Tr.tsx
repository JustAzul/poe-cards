import { memo } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import Dynamic from 'next/dynamic';
import styles from '../index.module.css';
import TableStyles from '../../../Table/index.module.css';
import Img from './Img';
import Td from '../../../Table/Td';
import Spinner from '../../../Spinner';
import type { KeyStates, Card, TableData } from '../../../../hooks/interfaces';

import InventoryIcon from '../../../../public/images/InventoryIcon.png';
import ChaosOrb from '../../../../public/images/ChaosOrb.png';
import ExaltedOrb from '../../../../public/images/ExaltedOrb.png';

const DivCard = Dynamic(() => import('../DivCard'), { loading: () => <div className="mr-2"><Spinner /></div> });
const formatNumber: Function = require('../../../../hooks/formatNumber');

interface Props {
    setToHover: Function,
    toHover: KeyStates,
    doSearch: Function,
    Details: TableData
}

function Tr({
  setToHover, toHover, Details, doSearch,
}: Props) {
  const {
    // eslint-disable-next-line no-shadow
    Card, Reward, chaosprofit, exprofit, isCurrency, setchaosprice, setexprice,
  } = Details;

  const GenDivCard = (CardDetails: Card) => (
        <div className="mr-2">
            <DivCard CardDetails={CardDetails} />
        </div>
  );

  return (
    <OverlayTrigger overlay={GenDivCard(Card)} placement="left">
        <tr key={Card.name.trim().toLowerCase() + Reward.name.trim().toLowerCase()} className={TableStyles.row100}>

                    <Td Click={doSearch} SearchString={Card.name} setTitle="Divination Card Name" Class={`click${isCurrency ? ` ${styles.currency}` : ''}`} SetMouseOver={setToHover} KeyState={toHover} _Key="c1" key={`${Card.name}-c1`} >
                        {<Img artFileName={InventoryIcon} />}
                        <span className="ml-2">
                            {Card.name}
                        </span>
                    </Td>

                    <Td setTitle={`${Card.name} Stack Size`} SetMouseOver={setToHover} KeyState={toHover} _Key="c2" key={`${Card.name}-c2`} >
                        <span className="ml-3">{Card.stack}</span>
                    </Td>

                    <Td Click={doSearch} SearchString={Card.name} setTitle={`${Card.name} Chaos Price`} Class="click" SetMouseOver={setToHover} KeyState={toHover} _Key="c3" key={`${Card.name}-c3`} >
                        {<Img artFileName={ChaosOrb} />}<span className="ml-2">{formatNumber(Card.chaosprice)}</span>
                    </Td>

                    <Td Click={doSearch} Currency="exalted" SearchString={Card.name} setTitle={`${Card.name} Exalted Price`} SetMouseOver={setToHover} Class="click" KeyState={toHover} _Key="c4" key={`${Card.name}-c4`} >
                        {<Img artFileName={ExaltedOrb} />}<span className="ml-2">{Card.exaltedprice}</span>
                    </Td>

                    <Td setTitle={`${Card.name} Stacked Chaos Value`} SetMouseOver={setToHover} KeyState={toHover} _Key="c5" key={`${Card.name}-c5`} >
                        {<Img artFileName={ChaosOrb} />}<span className="ml-2">{formatNumber(setchaosprice)}</span>
                    </Td>

                    <Td setTitle={`${Card.name} Stacked Exalted Value`} SetMouseOver={setToHover} KeyState={toHover} _Key="c6" key={`${Card.name}-c6`} >
                        {<Img artFileName={ExaltedOrb} />}<span className="ml-2">{setexprice}</span>
                    </Td>

                    <Td Click={doSearch} SearchString={Reward.name} setTitle={`${Reward.name} Chaos Value`} Class="click" SetMouseOver={setToHover} KeyState={toHover} _Key="c7" key={`${Card.name}-c7`} >
                        {<Img artFileName={ChaosOrb} />}<span className="ml-2">{formatNumber(Reward.chaosprice)}</span>
                    </Td>

                    <Td Click={doSearch} Currency="exalted" SearchString={Reward.name} setTitle={`${Reward.name} Exalted Value`} Class="click" SetMouseOver={setToHover} KeyState={toHover} _Key="c8" key={`${Card.name}-c8`} >
                        {<Img artFileName={ExaltedOrb} />}<span className="ml-2">{Reward.exaltedprice}</span>
                    </Td>

                    <Td setTitle={'Chaos Profit'} SetMouseOver={setToHover} KeyState={toHover} _Key="c9" key={`${Card.name}-c9`} >
                        {<Img artFileName={ChaosOrb} />}<span className="ml-2">{formatNumber(chaosprofit)}</span>
                    </Td>

                    <Td setTitle={'Exalted Profit'} SetMouseOver={setToHover} KeyState={toHover} _Key="c10" key={`${Card.name}-c10`} >
                        {<Img artFileName={ExaltedOrb} />}<span className="ml-2">{exprofit}</span>
                    </Td>
         </tr>
        </OverlayTrigger >
  );
}

export default memo(Tr);
