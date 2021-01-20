import Link from 'next/link';
import { useState } from 'react';
import styles from './index.module.css';

export default function SelectLeagueTable({LeagueDetails}) {
    const [state, SetMouseOver] = useState("");

    return (
        <div className="row justify-content-md-center mt-3 mb-3">
            <div className="table100 ver1 user-select-none">
                <table className={styles.table}>

                    <thead>
                        <tr className="row100 head">
                            <th onMouseOver={() => SetMouseOver("c1")} onMouseLeave={() => SetMouseOver("")} className={`column100 column1${state === "c1" ? " hov-column-head-ver1": ""}`}>League</th>
                            <th onMouseOver={() => SetMouseOver("c2")} onMouseLeave={() => SetMouseOver("")} className={`column100${state === "c2" ? " hov-column-head-ver1": ""}`}>End At</th>
                            <th onMouseOver={() => SetMouseOver("c3")} onMouseLeave={() => SetMouseOver("")} className={`column100${state === "c3" ? " hov-column-head-ver1": ""}`}>Days Left</th>
                            <th onMouseOver={() => SetMouseOver("c4")} onMouseLeave={() => SetMouseOver("")} className={`column100${state === "c4" ? " hov-column-head-ver1": ""}`}>Ladder</th>
                        </tr>
                    </thead>

                    <tbody>
                        {LeagueDetails.map(({Name, EndAt, DaysLeft, Ladder}) => {
                            return (
                                <tr className="row100 click">
                                    <Link href={`/league/${Name}`}>
                                        <td onMouseOver={() => SetMouseOver("c1")} onMouseLeave={() => SetMouseOver("")} className={`column100 column1${state === "c1" ? " hov-column-ver1": ""}`}><a>{Name}</a></td>
                                    </Link>

                                    <Link href={`/league/${Name}`}>
                                        <td onMouseOver={() => SetMouseOver("c2")} onMouseLeave={() => SetMouseOver("")} className={`column100${state === "c2" ? " hov-column-ver1": ""}`}><a>{EndAt}</a></td>
                                    </Link>

                                    <Link href={`/league/${Name}`}>
                                        <td onMouseOver={() => SetMouseOver("c3")} onMouseLeave={() => SetMouseOver("")} className={`column100${state === "c3" ? " hov-column-ver1": ""}`}><a>{DaysLeft}</a></td>
                                    </Link>

                                    <Link href={Ladder}>
                                        <td onMouseOver={() => SetMouseOver("c4")} onMouseLeave={() => SetMouseOver("")} className={`column100${state === "c4" ? " hov-column-ver1": ""} ${styles.link}`}><a className={styles.link} target="_BLANK">Link</a></td>
                                    </Link>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>
        </div>
    );
};