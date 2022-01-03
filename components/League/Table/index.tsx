/* eslint-disable no-undef */
import {
  useState, useEffect, useRef, MutableRefObject,
} from 'react';
import TableWrapper from '../../Table/Wrapper';
import TableHead from './THead';
import TableBody from './Tbody';

import type { KeyStates, TableData } from '../../../hooks/interfaces';

interface Props {
    leagueName: string,
    NavbarHeight: number,
    Items: Array<TableData>,
    SortKey: KeyStates,
    SortType: 0 | 1,
    setSortKey: Function,
    setSortType: Function
}

export default function Table({
  Items, NavbarHeight, leagueName, SortKey = 'c9', SortType = 1, setSortKey, setSortType,
}: Props) {
  const [toHover, setToHover] = useState<KeyStates>();
  const [isSticky, setSticky] = useState<Boolean>(false);

  const ref: MutableRefObject<HTMLTableSectionElement | null> = useRef<HTMLTableSectionElement>(null);

  const handleScroll = () => {
    if (ref?.current) {
      const { top } = ref.current.getBoundingClientRect();
      setSticky(top <= NavbarHeight);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, [ref]);

  return (
        <TableWrapper>
                <thead ref={ref} className={`sticky-wrapper${isSticky ? ' sticky' : ''}`}>
                    <TableHead
                      SortKey={SortKey}
                      SortType={SortType}
                      setSortKey={setSortKey}
                      setSortType={setSortType}
                      NavbarHeight={NavbarHeight}
                      ShouldSticky={isSticky}
                      toHover={toHover}
                      setToHover={setToHover}
                    />
                </thead>

                <tbody>
                    <TableBody
                      leagueName={leagueName}
                      SortKey={SortKey}
                      SortType={SortType}
                      toHover={toHover}
                      setToHover={setToHover}
                      Items={Items}
                    />
                </tbody>
        </TableWrapper>
  );
}
