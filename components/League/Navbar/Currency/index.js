import styles from './index.module.css';
import Image from 'next/image';

export default function Currency({img, children}) {
    return (
        <div className="row col-sm ml-1">
                    <Image className={styles.image} src={`/images/${img}.png`} width={24} height={24}/>
                    <div className="ml-1">
                        {children}
                    </div>
                </div>
    );
}