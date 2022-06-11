import { ReactNode, memo } from 'react';

import type { KeyStates } from '../../../hooks/interfaces';
import Link from 'next/link';
import styles from '../index.module.css';

interface Props {
    children: ReactNode,
    SetMouseOver: Function,
    KeyState?: KeyStates,
    _Key: KeyStates,
    Href?: string,
    Class?: string,
    setTitle?: string,
    SearchString?: string,
    SearchMaxValue?: number,
    Click?: Function
}

function Td({
  // eslint-disable-next-line no-shadow
  children, SetMouseOver, KeyState, _Key, Href, Class, setTitle, Click, SearchString, SearchMaxValue,
}: Props) {
  const TD = (_children: ReactNode) => (<td onClick={() => Click && Click({ itemName: SearchString, searchMaxValue: SearchMaxValue })} title={setTitle} onMouseOver={() => SetMouseOver(_Key)} onMouseLeave={() => SetMouseOver('')} className={`${Class ? `${Class} ` : ''}${styles.column100}${_Key === 'c1' ? ` ${styles.column1}` : ''}${_Key === KeyState ? ` ${styles['hov-column-ver1']}` : ''}`}>{_children}</td>);

  if (Href) {
    return (
            <Link href={Href}>
                {TD(children)}
            </Link>
    );
  }

  return (
        <>
            {TD(children)}
        </>
  );
}

export default memo(Td);
