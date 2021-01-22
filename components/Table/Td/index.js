import styles from '../index.module.css';
import Link from 'next/link';

export default function Td ({children, SetMouseOver, KeyState, _Key, Href, Class, setTitle}) {

    const TD = _children => (<td title={setTitle} onMouseOver={() => SetMouseOver(_Key)} onMouseLeave={() => SetMouseOver("")} className={`${Class ? `${Class} ` : ""}${styles['column100']}${_Key === "c1" ? ` ${styles['column1']}` : ""}${_Key === KeyState ? ` ${styles['hov-column-ver1']}`: ""}`}>{_children}</td>);

    if(Href) {
        return (
            <Link href={Href}>
                {TD(children)}
            </Link>
        );
    }
    
    return (
        <>
            {TD(children)}
        </>
    );
}