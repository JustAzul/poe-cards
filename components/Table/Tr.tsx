/* eslint-disable import/extensions */

import type { KeyStates } from '../../hooks/interfaces';
import Td from './Td';
import styles from './index.module.css';

// eslint-disable-next-line import/no-unresolved

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
            <Td
            Class={styles.span}
            SetMouseOver={SetMouseOver}
            KeyState={state}
            _Key="c1"
            Href={`/league/${leagueName}`}>
                {leagueName}
            </Td>

            <Td
            Click={NewTab}
            toSearchDetails={{
              // @ts-expect-error 'ladder' will never be undefined.
              itemName: ladder,
            }}
            Class={styles.link}
            SetMouseOver={SetMouseOver}
            KeyState={state}
            _Key="c4">
                <span>[Link]</span>
            </Td>

    </tr>
  );
}
