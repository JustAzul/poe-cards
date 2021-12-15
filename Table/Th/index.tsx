import styles from '../index.module.css';

import type { KeyStates } from '../../../hooks/interfaces';

interface Props {
    children: React.ReactNode,
    SetMouseOver: Function,
    KeyState?: KeyStates,
    _Key: KeyStates,
    Class?: string
}

export default function Th({
  SetMouseOver, KeyState, _Key, Class, children,
}: Props) {
  return (
        <th onMouseOver={() => SetMouseOver(_Key)} onMouseLeave={() => SetMouseOver('')} className={`${Class ? `${Class} ` : ''}${styles.column100}${_Key === 'c1' ? ` ${styles.column1}` : ''}${KeyState === _Key ? ` ${styles['hov-column-head-ver1']}` : ''}`}>{children}</th>
  );
}
