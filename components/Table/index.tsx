import { useState } from 'react';
import styles from './index.module.css';
import CentralSpinner from '../CentralSpinner';
import HiddenForm from '../HiddenForm';
import TableWrapper from './Wrapper';
import Th from './Th';
import Tr from './Tr';

import type { Leagues, KeyStates } from '../../hooks/interfaces';

interface Props {
    LeagueDetails: Array<Leagues>
}

export default function SelectLeagueTable({ LeagueDetails }: Props) {
  const [state, SetMouseOver] = useState<KeyStates>();

  const [TargetHref, setTargetHref] = useState<string>('');
  const [HiddenFormRef, setHiddenFormRef] = useState<HTMLFormElement>();

  const NewTab = (href: string) => {
    setTargetHref(href);
    process.nextTick(() => {
      HiddenFormRef && HiddenFormRef.submit();
    });
  };

  if (!LeagueDetails || LeagueDetails.length === 0) return <CentralSpinner />;

  return (
        <>
        <HiddenForm SearchString={TargetHref} Href={TargetHref} setFormRef={setHiddenFormRef} METHOD="GET" />
        <div className="row justify-content-md-center mt-3 mb-3">
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
                            {LeagueDetails
                              .sort((a, b) => ((`${a.leagueName}`).localeCompare(`${b.leagueName}`) * -1))
                              .map(({
                                leagueName, endAt, DaysLeft, ladder,
                              }) => (
                                    <Tr key={leagueName?.trim()} NewTab={NewTab} state={state} SetMouseOver={SetMouseOver} leagueName={leagueName} endAt={endAt} DaysLeft={DaysLeft} ladder={ladder} />
                              ))}
                        </tbody>
            </TableWrapper>
        </div>
        </>
  );
}
