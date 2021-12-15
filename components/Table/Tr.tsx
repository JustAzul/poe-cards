import styles from './index.module.css';
import Td from './Td';

import type { KeyStates } from '../../hooks/interfaces';

const moment = require('moment');

interface Props {
    leagueName?: string,
    DaysLeft?: number,
    ladder?: string,
    endAt?: string,
    state?: KeyStates,
    SetMouseOver: Function,
    NewTab?: Function
}

export default function Tr({
  SetMouseOver, state, leagueName, endAt, DaysLeft = 0, ladder, NewTab,
}: Props) {
  const MaxDaysLeft: number = 30 * 3;

  return (
        <tr className={`${styles.row100} click`}>
            <Td Class={styles.span} SetMouseOver={SetMouseOver} KeyState={state} _Key="c1" Href={`/league/${leagueName}`}>
                {leagueName}
            </Td>

            {/* <Td Class={styles.span} SetMouseOver={SetMouseOver} KeyState={state} _Key="c2" Href={`/league/${leagueName}`}>
                {endAt ? (DaysLeft > MaxDaysLeft ? '?' : moment(endAt).format('D MMM, YYYY')) : '?'}
            </Td>

            <Td Class={styles.span} SetMouseOver={SetMouseOver} KeyState={state} _Key="c3" Href={`/league/${leagueName}`}>
                {DaysLeft === 0 ? (leagueName === 'Standard' || leagueName === 'Hardcore' ? '?' : 0) : DaysLeft > MaxDaysLeft ? '?' : DaysLeft}
            </Td> */}

            <Td Click={NewTab} SearchString={ladder} Class={styles.link} SetMouseOver={SetMouseOver} KeyState={state} _Key="c4">
                <span>[Link]</span>
            </Td>

    </tr>
  );
}
