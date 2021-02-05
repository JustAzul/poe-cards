import styles from '../index.module.css';
import TableStyles from '../../../Table/index.module.css';
import { useState } from 'react';
import Head from '../Head.js';
import Row from './Row';

import Transition from '../../../Transition';

export default function SplitedExalted({SplitsArray = [], boxHeight}) {
    const [row, setRow] = useState("");
    
    return (
        <Transition>
            <Head>
                Exalted Splited Values
            </Head>

            <div className={`${TableStyles['table100']} ${TableStyles['ver1']} pt-2`}>
                <table style={{height: boxHeight, width: "100%"}} className={styles['bg-white']}>
                    <thead>
                        <tr className={`${TableStyles['head']}`}>
                            <th className={`${TableStyles['column100']} user-select-none`}>Split</th>
                            <th className={`${TableStyles['column100']} user-select-none`}>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                    
                            {SplitsArray.map((Value, i) => {
                                return (
                                    <Row setRow={setRow} row={row} i={i} Value={Value}/>
                                );
                            })}
                        
                    </tbody>
                </table>
            </div>
        </Transition>
    );
}