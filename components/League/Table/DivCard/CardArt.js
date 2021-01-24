import styles from './index.module.css';
import Image from 'next/image';

export default function CardArt({artFilename}) {
    return (
        <span className={styles['divicard-art']}>
            <Image
                src={`https://web.poecdn.com/image/divination-card/${artFilename}.png`}
                width={200}
                height={140}
                priority
            />
        </span>
    );
}