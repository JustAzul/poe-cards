//import styles from './index.module.css';
import { useState, useEffect, useRef } from 'react';
import TableHead from './thead.js';
import TableBody from './tbody.js';

export default function Table({Items, leagueName, NavbarHeight}) {
    const [toHover, setToHover] = useState("");
    const [isSticky, setSticky] = useState(false);
    
    const ref = useRef(null);
    
    const handleScroll = () => {
        if (ref.current) {
            const {top} = ref.current.getBoundingClientRect();
            setSticky(top <= NavbarHeight);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', () => handleScroll);
        };
      }, [ref]);
    
    return (
        <table>
                <thead key={`${leagueName}_thead`} ref={ref} className={`sticky-wrapper${isSticky ? ' sticky' : ''}`}>
                    <TableHead NavbarHeight={NavbarHeight} ShouldSticky={isSticky} toHover={toHover} setToHover={setToHover}></TableHead>
                </thead>                 
            
                <tbody key={`${leagueName}_tbody`}>
                    <TableBody toHover={toHover} setToHover={setToHover} Items={Items}></TableBody>
                </tbody>
        </table> 
    );
}