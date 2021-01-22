import styles from './index.module.css';
import Td from './Td';

const moment = require('moment');

export default function Tr({SetMouseOver, state, leagueName:Name, endAt:EndAt, DaysLeft, ladder:Ladder}) {
    const MaxDaysLeft = 30 * 6;

    return (
        <tr className={`${styles['row100']} click`}>
            <Td Class={styles.span} SetMouseOver={SetMouseOver} KeyState={state} _Key="c1" Href={`/league/${Name}`}>
                {Name}
            </Td>
            
            <Td Class={styles.span} SetMouseOver={SetMouseOver} KeyState={state} _Key="c2" Href={`/league/${Name}`}>
                {EndAt ? (DaysLeft > MaxDaysLeft ? "?" : moment(EndAt).format("D MMM, YYYY")) : "?"}
            </Td>
            
            <Td Class={styles.span} SetMouseOver={SetMouseOver} KeyState={state} _Key="c3" Href={`/league/${Name}`}>
                {DaysLeft === 0 ? (Name === "Standard" || Name === "Hardcore" ? "?" : 0) : DaysLeft > MaxDaysLeft ? "?" : DaysLeft}
            </Td> 
            
            <Td Class={styles.link} SetMouseOver={SetMouseOver} KeyState={state} _Key="c4" Href={Ladder}>
                <span>[Link]</span>
            </Td>                                        

    </tr>  
    );
}