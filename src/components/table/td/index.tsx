import { ReactNode, memo } from 'react';
import type React from 'react';

import type { KeyStates } from '@/hooks/interfaces';
import Link from 'next/link';
import { ToSearch } from '@/components/league/table/tbody/to-search.interface';
import styles from '../index.module.css';

interface Props {
    children: ReactNode;
    SetMouseOver: React.Dispatch<KeyStates | undefined>;
    KeyState?: KeyStates;
    _Key: KeyStates;
    Href?: string;
    Class?: string;
    setTitle?: string;
    toSearchDetails?: ToSearch;
    Click?: React.Dispatch<ToSearch>;
}
function internalTD(props: Props) {
  const {
    children, SetMouseOver, KeyState, _Key, Class, setTitle, Click, toSearchDetails,
  } = props;

  const internalClass = `${Class ? `${Class} ` : ''}${styles.column100}${_Key === 'c1' ? ` ${styles.column1}` : ''}${_Key === KeyState ? ` ${styles['hov-column-ver1']}` : ''}`;

  return (
    <td
      onClick={() => {
        if (Click && toSearchDetails) Click(toSearchDetails);
      }}
      title={setTitle} onMouseOver={() => SetMouseOver(_Key)}
      onMouseLeave={() => SetMouseOver(undefined)}
      className={internalClass}>
        {children}
      </td>
  );
}

function Td(props: Props) {
  if (props.Href) {
    return (
            <Link href={props.Href}>
                {internalTD(props)}
            </Link>
    );
  }

  return (
        <>
            {internalTD(props)}
        </>
  );
}

export default memo(Td);
