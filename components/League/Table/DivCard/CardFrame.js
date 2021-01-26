import styles from './index.module.css';
import Image from 'next/image';

export default function CardFrame() {
    return (
        <span className={styles['divicard-frame']}>
            <Image
                src={`/images/cardbg.png`}
                width={220}
                height={334}
                priority={true}
                loading={"eager"}
            />
        </span>
    );
}