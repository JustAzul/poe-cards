/* eslint-disable no-undef */

import {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import Contexts from '../../../context';
import type { KeyStates } from '../../../hooks/interfaces';
import TableBody from './Tbody';
import TableHead from './THead';
import TableWrapper from '../../Table/Wrapper';

export default function Table() {
  const [toHover, setToHover] = useState<KeyStates>();
  const [isSticky, setSticky] = useState<Boolean>(false);

  const { navbarHeight } = useContext(Contexts.leaguePageData);

  const ref: MutableRefObject<HTMLTableSectionElement | null> = useRef<HTMLTableSectionElement>(null);

  const handleScroll = () => {
    if (ref?.current) {
      const { top } = ref.current.getBoundingClientRect();
      setSticky(top <= navbarHeight);
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
                        ShouldSticky={isSticky}
                        toHover={toHover}
                        setToHover={setToHover}
                    />
                </thead>

                <tbody>
                    <TableBody
                      toHover={toHover}
                      setToHover={setToHover}
                    />
                </tbody>
        </TableWrapper>
  );
}
