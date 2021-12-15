import styles from './index.module.css';
import Td from './Td';

import type { KeyStates } from '../../hooks/interfaces';

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
  SetMouseOver, state, leagueName, ladder, NewTab,
}: Props) {
  return (
        <tr className={`${styles.row100} click`}>
            <Td Class={styles.span} SetMouseOver={SetMouseOver} KeyState={state} _Key="c1" Href={`/league/${leagueName}`}>
                {leagueName}
            </Td>

            <Td Click={NewTab} SearchString={ladder} Class={styles.link} SetMouseOver={SetMouseOver} KeyState={state} _Key="c4">
                <span>[Link]</span>
            </Td>

    </tr>
  );
}
