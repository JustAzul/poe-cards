import Image from 'next/image';
import styles from './index.module.css';

import CardBG from '../../../../public/images/cardbg.png';

export default function CardFrame() {
  return (
        <span className={styles['divicard-frame']}>
            <Image
                // placeholder="blur"
                src={CardBG}
                width={220}
                height={334}
                priority={true}
            />
        </span>
  );
}
