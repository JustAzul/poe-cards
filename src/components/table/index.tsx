/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import type { KeyStates, Leagues } from '@/hooks/interfaces';
import { useContext, useMemo, useState } from 'react';

import CentralSpinner from '@/components/central-spinner';
import Contexts from '@/context';
import TableWrapper from './wrapper';
import Th from './th';
import { ToSearch } from '@/components/league/table/tbody/to-search.interface';
import Tr from './Tr';
import styles from './index.module.css';

function sortLeagueDetails(leagueDetails: Leagues[]) {
  return useMemo(
    () => leagueDetails.sort((a, b) => ((`${a.leagueName}`).localeCompare(`${b.leagueName}`) * -1)),
    [leagueDetails],
  );
}

function openNewTab({ itemName }: ToSearch): void {
  if (typeof window === 'undefined') return;

  //! we only get here if this is defined.
  // eslint-disable-next-line no-undef
  window.open(itemName, itemName);
}

export default function SelectLeagueTable() {
  const [state, SetMouseOver] = useState<KeyStates>();

  const LeagueDetails = useContext(Contexts.leagueDetails);

  if (!LeagueDetails || LeagueDetails.length === 0) return <CentralSpinner />;

  return (
        <>
        <div className="row justify-content-md-center mt-5 pb-3">
            <TableWrapper>
                <thead>
                            <tr className={`${styles.row100} ${styles.head}`}>
                                <Th Class={styles.span} SetMouseOver={SetMouseOver} KeyState={state} key="th_c1" _Key="c1">
                                    League
                                </Th>

                                <Th Class={styles.span} SetMouseOver={SetMouseOver} KeyState={state} key="th_c4" _Key="c4">
                                    Ladder
                                </Th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortLeagueDetails(LeagueDetails)
                              .map(({
                                leagueName, endAt, DaysLeft, ladder,
                              }) => (
                                    <Tr
                                        key={leagueName?.trim().toLowerCase()}
                                        NewTab={openNewTab}
                                        state={state}
                                        SetMouseOver={SetMouseOver}
                                        leagueName={leagueName}
                                        endAt={endAt}
                                        DaysLeft={DaysLeft}
                                        ladder={ladder}
                                    />
                              ))}
                        </tbody>
            </TableWrapper>
        </div>
        </>
  );
}
