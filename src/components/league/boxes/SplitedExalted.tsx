import { useContext, useState } from 'react';
import type React from 'react';

import Contexts from '@/context';
import Head from './Head';
import TableStyles from '../../table/index.module.css';
import styles from './index.module.css';

interface Props {
    boxHeight: number
}

interface RowProps {
    i: number;
    Value: number;
    setRow: React.Dispatch<string>;
    row: string;
}

function Row({
  row, setRow, Value, i,
}: RowProps) {
  return (
        <tr>
            <td onMouseOver={() => setRow((i + 1).toString())} onMouseLeave={() => setRow('')} className={`border ${TableStyles.column100} user-select-none${row === (i + 1).toString() ? ` ${TableStyles['hov-column-ver1']}` : ''}`}>0.{i + 1}</td>
            <td onMouseOver={() => setRow((i + 1).toString())} onMouseLeave={() => setRow('')} className={`border ${TableStyles.column100}${row === (i + 1).toString() ? ` ${TableStyles['hov-column-ver1']}` : ''}`}>{Math.round(Value)}</td>
        </tr>
  );
}

export default function SplitedExalted({ boxHeight }: Props) {
  const [row, setRow] = useState<string>('');

  const { splitsArray } = useContext(Contexts.leaguePageData);

  return (
        <div>
            <Head>
                Exalted Splited Values
            </Head>

            <div className={`${TableStyles.table100} ${TableStyles.ver1} pt-2`}>
                <table style={{ height: boxHeight, width: '100%' }} className={styles['bg-white']}>

                    <thead>
                        <tr className={`${TableStyles.head}`}>
                            <th className={`${TableStyles.column100} user-select-none`}>Split</th>
                            <th className={`${TableStyles.column100} user-select-none`}>Value</th>
                        </tr>
                    </thead>

                    <tbody>
                        {splitsArray.map((Value, i) => <Row key={`splited-exalted-${i}`} setRow={setRow} row={row} i={i} Value={Value} />)}
                    </tbody>

                </table>
            </div>
        </div>
  );
}
