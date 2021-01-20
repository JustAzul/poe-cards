import styles from './index.module.css';
import ChangeHelperStyles from '../ChangeHelper/index.module.css';
import { useState } from 'react';

export default function SplitedExalted({SplitsArray = [], boxHeight}) {
    const [row, setRow] = useState("");
    
    return (
        <>
        <div className={`pl-2 pr-2 text-center ${styles.header2} user-select-none`}>
            Exalted Splited Values
        </div>

        <div className={`table100 ver1 pt-2`}>
            <table style={{height: boxHeight}} className={ChangeHelperStyles['bg-white']}>
                <thead>
                    <tr className="head">
                        <th className="column100 user-select-none">Split</th>
                        <th className="column100 user-select-none">Value</th>
                    </tr>
                </thead>
                <tbody>
                 
                        {SplitsArray.map((Value, i) => {
                            return (
                                <tr>
                                    <td onMouseOver={()=> setRow(i+1)} onMouseLeave={()=> setRow("")} className={`border column100 user-select-none${row == (i+1) ? " hov-column-ver1" : ""}`}>0.{i+1}</td>
                                    <td onMouseOver={()=> setRow(i+1)} onMouseLeave={()=> setRow("")} className={`border column100${row == (i+1) ? " hov-column-ver1" : ""}`}>{parseInt(Value)}</td>
                                </tr>
                            );
                        })}
                    
                </tbody>
            </table>
        </div>
        </>
    );
}