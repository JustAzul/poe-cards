import { CSSProperties } from 'react';
import TableStyles from '../../../Table/index.module.css';
import Th from '../../../Table/Th';

import type {KeyStates} from '../../../../hooks/interfaces';

interface Props {
    NavbarHeight: number,
    setToHover: Function,
    ShouldSticky: Boolean,
    toHover: KeyStates
}

export default function thead({setToHover, toHover, ShouldSticky, NavbarHeight}: Props) {
    
    const StickyStyle: CSSProperties = {
        top: `${NavbarHeight}px`
    };

    return (
        <tr style={ShouldSticky ? StickyStyle : {}} className={`${TableStyles['row100']} ${TableStyles['head']} sticky-inner`}>
            
            <Th SetMouseOver={setToHover} KeyState={toHover} _Key="c1">
                Card Name
            </Th>
            
            <Th SetMouseOver={setToHover} KeyState={toHover} _Key="c2">
                Stack Size
            </Th>
            
            <Th SetMouseOver={setToHover} KeyState={toHover} _Key="c3">
                Chaos Price
            </Th>
            
            <Th SetMouseOver={setToHover} KeyState={toHover} _Key="c4">
                Exalted Price
            </Th>
            
            <Th SetMouseOver={setToHover} KeyState={toHover} _Key="c5">
                Set Price (c)
            </Th>
            
            <Th SetMouseOver={setToHover} KeyState={toHover} _Key="c6">
                Set Price (ex)
            </Th>
            
            <Th SetMouseOver={setToHover} KeyState={toHover} _Key="c7">
                Item Price (c)
            </Th>
            
            <Th SetMouseOver={setToHover} KeyState={toHover} _Key="c8">
                Item Price (ex)
            </Th>
            
            <Th SetMouseOver={setToHover} KeyState={toHover} _Key="c9">
                Profit (c)
            </Th>
            
            <Th SetMouseOver={setToHover} KeyState={toHover} _Key="c10">
                Profit (ex)
            </Th>
                                
        </tr>
    );
}