import TableStyles from '../../../Table/index.module.css';

export default function row({row, setRow, Value, i}) {
    return (
        <tr>
            <td onMouseOver={()=> setRow(i+1)} onMouseLeave={()=> setRow("")} className={`border ${TableStyles['column100']} user-select-none${row === (i+1) ? ` ${TableStyles['hov-column-ver1']}` : ""}`}>0.{i+1}</td>
            <td onMouseOver={()=> setRow(i+1)} onMouseLeave={()=> setRow("")} className={`border ${TableStyles['column100']}${row === (i+1) ? ` ${TableStyles['hov-column-ver1']}` : ""}`}>{Math.round(Value)}</td>
        </tr>
    );
}