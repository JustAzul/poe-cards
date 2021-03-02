import Image from 'next/image';
import styles from './index.module.css';

interface Props {
    artFilename: string
}

export default function CardArt({ artFilename }: Props) {
  return (
        <span className={styles['divicard-art']}>
            <Image
                src={`https://web.poecdn.com/image/divination-card/${artFilename}.png`}
                width={200}
                height={140}
            />
        </span>
  );
}
