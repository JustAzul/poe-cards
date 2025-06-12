import Image from 'next/image';
import { memo } from 'react';
import styles from './index.module.css';

import CardBG from 'public/images/cardbg.png';

function CardFrame() {
  return (
        <span className={styles['divicard-frame']}>
            <Image
                placeholder="blur"
                src={CardBG}
                width={220}
                height={334}
            />
        </span>
  );
}

export default memo(CardFrame);
