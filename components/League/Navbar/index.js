import Image from 'next/image';
import {useEffect, useRef } from 'react';
import styles from './index.module.css';

export default function Navbar({UpdateHeigh}) {    
    const Element = useRef(null);

    const HandleElement = () => {
        if (Element.current) {
            const {height} = Element.current.getBoundingClientRect();
            UpdateHeigh(height);
        }
    };

    useEffect(() => {
        HandleElement();
        window.addEventListener("resize", HandleElement);
        return () => {
            window.removeEventListener('resize', () => HandleElement);
          };
    }, [Element]);

    return (
        <div id="header" ref={Element} className="navbar navbar-dark bg-dark fixed-top mandali">
            <div className="container" style={{color:"white"}}>

                <div className="row col-sm ml-1 text-center">
                    <Image className={styles.image} src="/images/ExaltedOrb.png" width={24} height={24} />
                    <div className="ml-1">Exalted Value: <span className="pl-1">999c</span></div>
                </div>

                <div className="row col-sm ml-1">
                    <Image className={styles.image} src="/images/DivineOrb.png" width={24} height={24} />
                    <div className="ml-1">Divine Value: <span className="pl-1">99c</span></div>
                </div>

                <div className="row col-sm ml-1">
                    <Image className={styles.image} src="/images/AnnullOrb.png" width={24} height={24} />
                    <div className="ml-1">Annull Value: <span className="pl-1">99c</span></div>
                </div>                

                <div className="row col-sm ml-1">
                    <Image className={styles.image} src="/images/MirrorKalandra.png" width={24} height={24} />
                    <div className="ml-1">Mirror Value: <span className="pl-1 mr-2">999 ex</span></div>
                </div>

            </div>
        </div> 
    );
};