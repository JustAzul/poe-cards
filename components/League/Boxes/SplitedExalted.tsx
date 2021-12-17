import { useState } from 'react';
import styles from './index.module.css';
import TableStyles from '../../Table/index.module.css';
import Head from './Head';

interface Props {
    SplitsArray: Array<number>,
    boxHeight: number
}

interface RowProps {
    i: number,
    Value: number,
    setRow: Function,
    row: string
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

export default function SplitedExalted({ SplitsArray, boxHeight }: Props) {
  const [row, setRow] = useState<string>('');

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
                        {SplitsArray.map((Value, i) => <Row key={`splited-exalted-${i}`} setRow={setRow} row={row} i={i} Value={Value} />)}
                    </tbody>

                </table>
            </div>
        </div>
  );
}
