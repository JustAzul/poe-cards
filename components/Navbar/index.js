import Image from 'next/image';
import styles from './index.module.css';

export default function Navbar() {
    return (
        <div className="navbar navbar-dark bg-dark fixed-top mandali">
            <div className="container" style={{color:"white"}}>

                <div className="row col-sm ml-1 text-center">
                    <Image className={styles.image} src="/images/ExaltedOrb.png" width={24} height={24} />
                    Exalted Value: <span className="pl-1">999</span>c
                </div>

                <div className="row col-sm ml-1">
                    <Image className={styles.image} src="/images/DivineOrb.png" width={24} height={24} />
                    Divine Value: <span className="pl-1">99</span>c
                </div>

                <div className="row col-sm ml-1">
                    <Image className={styles.image} src="/images/AnnullOrb.png" width={24} height={24} />
                    Annull Value: <span className="pl-1">99</span>c
                </div>                

                <div className="row col-sm ml-1">
                    <Image className={styles.image} src="/images/MirrorKalandra.png" width={24} height={24} />
                    Mirror Value: <span className="pl-1">99999</span>c (999 ex)
                </div>

            </div>
        </div> 
    );
};