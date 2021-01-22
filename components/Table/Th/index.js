import styles from '../index.module.css';

export default function Th({SetMouseOver, KeyState, _Key, Class, children}) {
    return (
        <th onMouseOver={() => SetMouseOver(_Key)} onMouseLeave={() => SetMouseOver("")} className={`${Class ? `${Class} ` : ""}${styles['column100']}${_Key === "c1" ? ` ${styles['column1']}` : ""}${KeyState === _Key ? ` ${styles['hov-column-head-ver1']}`: ""}`}>{children}</th>
    );
}