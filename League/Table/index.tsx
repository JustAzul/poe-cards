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
    Items: Array<TableData>
}

export default function Table({ Items, NavbarHeight, leagueName }: Props) {
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
                    <TableHead NavbarHeight={NavbarHeight} ShouldSticky={isSticky} toHover={toHover} setToHover={setToHover}></TableHead>
                </thead>

                <tbody>
                    <TableBody leagueName={leagueName} toHover={toHover} setToHover={setToHover} Items={Items}></TableBody>
                </tbody>
        </TableWrapper>
  );
}
