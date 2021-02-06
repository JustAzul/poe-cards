import { useState, useEffect, useRef } from 'react';
import TableWrapper from '../../Table/Wrapper';
import TableHead from './THead';
import TableBody from './Tbody';

export default function Table({Items, NavbarHeight, leagueName}) {
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
      console.log(new Date(), 'Table');
    return (
        <TableWrapper>
                <thead ref={ref} className={`sticky-wrapper${isSticky ? ' sticky' : ''}`}>
                    <TableHead NavbarHeight={NavbarHeight} ShouldSticky={isSticky} toHover={toHover} setToHover={setToHover}></TableHead>
                </thead>                 
            
                <tbody>
                    <TableBody leagueName={leagueName} toHover={toHover} setToHover={setToHover} Items={Items}></TableBody>
                </tbody>
        </TableWrapper> 
    );
}