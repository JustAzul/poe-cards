import Image from 'next/image';
import styles from './index.module.css';

export default function CardFrame() {
  return (
        <span className={styles['divicard-frame']}>
            <Image
                // placeholder="blur"
                src={'/images/cardbg.png'}
                width={220}
                height={334}
                priority={true}
            />
        </span>
  );
}
