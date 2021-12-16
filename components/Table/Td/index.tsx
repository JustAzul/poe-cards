import Link from 'next/link';
import { ReactNode } from 'react';
import styles from '../index.module.css';

import type { KeyStates, Currency } from '../../../hooks/interfaces';

interface Props {
    children: ReactNode,
    SetMouseOver: Function,
    KeyState?: KeyStates,
    _Key: KeyStates,
    Href?: string,
    Class?: string,
    setTitle?: string,
    SearchString?: string,
    Currency?: Currency,
    Click?: Function
}

export default function Td({
  // eslint-disable-next-line no-shadow
  children, SetMouseOver, KeyState, _Key, Href, Class, setTitle, Click, SearchString, Currency,
}: Props) {
  const TD = (_children: ReactNode) => (<td onClick={() => Click && Click(SearchString, Currency)} title={setTitle} onMouseOver={() => SetMouseOver(_Key)} onMouseLeave={() => SetMouseOver('')} className={`${Class ? `${Class} ` : ''}${styles.column100}${_Key === 'c1' ? ` ${styles.column1}` : ''}${_Key === KeyState ? ` ${styles['hov-column-ver1']}` : ''}`}>{_children}</td>);

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
