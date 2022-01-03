import React from 'react';
import styles from '../index.module.css';
import Arrow from './Arrow';

import type { KeyStates } from '../../../hooks/interfaces';

interface Props {
    children: React.ReactNode,
    SetMouseOver: Function,
    setSortType?: Function,
    setSortKey?: Function,
    KeyState?: KeyStates,
    SortKey?: KeyStates,
    _Key: KeyStates,
    enableClick?: Boolean,
    SortType?: 0 | 1;
    Class?: string
}

export default function Th({
  SetMouseOver, KeyState, _Key, Class, children, SortKey = 'c9', SortType = 1, enableClick = false, setSortKey, setSortType,
}: Props) {
  const clickExec = () => {
    if (!setSortKey || !setSortType) return;
    if (SortKey !== _Key) setSortKey(_Key);
    else setSortType(SortType === 1 ? 0 : 1);
  };

  return (
        <th onClick={() => clickExec()} onMouseOver={() => SetMouseOver(_Key)} onMouseLeave={() => SetMouseOver('')} className={`${(_Key !== 'c1' && enableClick === true) ? 'click ' : ''}${Class ? `${Class} ` : ''}${styles.column100}${_Key === 'c1' ? ` ${styles.column1}` : ''}${KeyState === _Key ? ` ${styles['hov-column-head-ver1']}` : ''}`}>
          {children} {SortKey === _Key && <Arrow isUp={!!SortType} />}
          </th>
  );
}
