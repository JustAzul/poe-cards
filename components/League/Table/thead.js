//import styles from './index.module.css';

export default function thead({setToHover, toHover, ShouldSticky: isSticky, NavbarHeight}) {
    
    const StickyStyle = {
        'top': `${NavbarHeight}px`
    };

    const NotSticky = {};

    return (
        <tr style={isSticky ? StickyStyle : NotSticky} onScroll={() => {}} className="row100 head sticky-inner">
            <th onMouseOver={() => setToHover("c1")} onMouseOut={() => setToHover("")} className={`column100 ${toHover === "c1" ? " hov-column-head-ver1" : ""}`}>Card Name</th>
            <th onMouseOver={() => setToHover("c2")} onMouseOut={() => setToHover("")} className={`column100 ${toHover === "c2" ? " hov-column-head-ver1" : ""}`}>Stack Size</th>
            <th onMouseOver={() => setToHover("c3")} onMouseOut={() => setToHover("")} className={`column100 ${toHover === "c3" ? " hov-column-head-ver1" : ""}`}>Chaos Price</th>
            <th onMouseOver={() => setToHover("c4")} onMouseOut={() => setToHover("")} className={`column100 ${toHover === "c4" ? " hov-column-head-ver1" : ""}`}>Exalted Price</th>
            <th onMouseOver={() => setToHover("c5")} onMouseOut={() => setToHover("")} className={`column100 ${toHover === "c5" ? " hov-column-head-ver1" : ""}`}>Set Price (c)</th>
            <th onMouseOver={() => setToHover("c6")} onMouseOut={() => setToHover("")} className={`column100 ${toHover === "c6" ? " hov-column-head-ver1" : ""}`}>Set Price (ex)</th>
            <th onMouseOver={() => setToHover("c7")} onMouseOut={() => setToHover("")} className={`column100 ${toHover === "c7" ? " hov-column-head-ver1" : ""}`}>Item Price (c)</th>
            <th onMouseOver={() => setToHover("c8")} onMouseOut={() => setToHover("")} className={`column100 ${toHover === "c8" ? " hov-column-head-ver1" : ""}`}>Item Price (ex)</th>
            <th onMouseOver={() => setToHover("c9")} onMouseOut={() => setToHover("")} className={`column100 ${toHover === "c9" ? " hov-column-head-ver1" : ""}`}>Profit (c)</th>
            <th onMouseOver={() => setToHover("c10")} onMouseOut={() => setToHover("")} className={`column100 ${toHover === "c10" ? " hov-column-head-ver1" : ""}`}>Profit (ex)</th>                     
        </tr>
    );
}