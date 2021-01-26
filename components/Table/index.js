import { useState, useRef, useEffect } from 'react';
import styles from './index.module.css';

import HiddenForm from '../HiddenForm';
import TableWrapper from './Wrapper';
import Th from './Th';
import Tr from './Tr';

export default function SelectLeagueTable({LeagueDetails}) {
    const [state, SetMouseOver] = useState("");   

    const FormRef = useRef(null);
    const [TargetHref, setTargetHref] = useState(null);
    const [HiddenFormRef, setHiddenFormRef] = useState(null);
    
    useEffect(() => {
        if(FormRef && FormRef['current']) setHiddenFormRef(FormRef['current']);
    }, [FormRef]);

    const NewTab = (href = "") => {
        setTargetHref(href);
        process.nextTick(() => {
            HiddenFormRef && HiddenFormRef.submit();
        });
    };
    
    return (
        <>
        <HiddenForm SearchString={TargetHref} Href={TargetHref} FormRef={FormRef} METHOD="GET" />
        <div className="row justify-content-md-center mt-3 mb-3">
            <TableWrapper>
                <thead>
                            <tr className={`${styles['row100']} ${styles['head']}`}>
                                <Th Class={styles.span} SetMouseOver={SetMouseOver} KeyState={state} _Key="c1">
                                    League
                                </Th>

                                <Th Class={styles.span} SetMouseOver={SetMouseOver} KeyState={state} _Key="c2">
                                    End At
                                </Th>

                                <Th Class={styles.span} SetMouseOver={SetMouseOver} KeyState={state} _Key="c3">
                                    Days Left
                                </Th>

                                <Th Class={styles.span} SetMouseOver={SetMouseOver} KeyState={state} _Key="c4">
                                    Ladder
                                </Th>
                            </tr>
                        </thead>

                        <tbody>
                            {Object.values(LeagueDetails).map(({leagueName:Name, endAt:EndAt, DaysLeft, ladder:Ladder}, i) => {
                                return (
                                    <Tr NewTab={NewTab} state={state} SetMouseOver={SetMouseOver} leagueName={Name} endAt={EndAt} DaysLeft={DaysLeft} ladder={Ladder} />
                                );
                            })}
                        </tbody>
            </TableWrapper>
        </div>
        </>
    );
};